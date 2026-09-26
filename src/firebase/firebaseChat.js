// ─────────────────────────────────────────────────────────────────────────────
// src/firebase/firebaseChat.js
//
// Real-time encrypted chat using Firebase Firestore.
// Encryption: AES-256-GCM, key derived from user IDs + app secret (WebCrypto).
// Messages are stored encrypted; only conversation participants can decrypt.
// ─────────────────────────────────────────────────────────────────────────────
import {
  collection,
  doc,
  getDoc,
  getDocs,
  setDoc,
  addDoc,
  updateDoc,
  query,
  where,
  orderBy,
  onSnapshot,
  serverTimestamp,
  arrayUnion,
} from 'firebase/firestore';
import { db, APP_ENCRYPTION_SECRET } from './firebase';

// ── Helpers ───────────────────────────────────────────────────────────────────

/** Stable conversation ID: always smaller UID first */
export function convId(uid1, uid2) {
  return [String(uid1), String(uid2)].sort().join('__');
}

/** Convert ArrayBuffer to base64 string */
function bufToB64(buf) {
  return btoa(String.fromCharCode(...new Uint8Array(buf)));
}

/** Convert base64 string to Uint8Array */
function b64ToBuf(b64) {
  const binary = atob(b64);
  const buf = new Uint8Array(binary.length);
  for (let i = 0; i < binary.length; i++) buf[i] = binary.charCodeAt(i);
  return buf;
}

// ── Key Derivation ────────────────────────────────────────────────────────────

/**
 * Derive a per-conversation AES-256-GCM key using HKDF.
 * Both users derive identical keys since uid pair is sorted.
 *
 * @param {string|number} uid1 - First user ID
 * @param {string|number} uid2 - Second user ID
 * @returns {Promise<CryptoKey>}
 */
export async function deriveEncryptionKey(uid1, uid2) {
  const secret = APP_ENCRYPTION_SECRET;
  const sortedPair = [String(uid1), String(uid2)].sort().join(':');
  const keyMaterial = `milansetu:${sortedPair}:${secret}`;

  const encoder = new TextEncoder();
  const keyMaterialBuf = await crypto.subtle.importKey(
    'raw',
    encoder.encode(keyMaterial),
    { name: 'PBKDF2' },
    false,
    ['deriveKey']
  );

  return crypto.subtle.deriveKey(
    {
      name: 'PBKDF2',
      salt: encoder.encode(`conv:${sortedPair}`),
      iterations: 100000,
      hash: 'SHA-256',
    },
    keyMaterialBuf,
    { name: 'AES-GCM', length: 256 },
    false,
    ['encrypt', 'decrypt']
  );
}

// ── Encrypt / Decrypt ─────────────────────────────────────────────────────────

/**
 * Encrypt plaintext with AES-256-GCM.
 * Returns { ciphertext: base64, iv: base64 }
 */
async function encryptMessage(text, key) {
  const iv = crypto.getRandomValues(new Uint8Array(12)); // 96-bit IV
  const enc = new TextEncoder();
  const cipherBuf = await crypto.subtle.encrypt(
    { name: 'AES-GCM', iv },
    key,
    enc.encode(text)
  );
  return {
    ciphertext: bufToB64(cipherBuf),
    iv: bufToB64(iv),
  };
}

/**
 * Decrypt AES-256-GCM ciphertext.
 * Returns plaintext string, or '[Encrypted message]' on failure.
 */
async function decryptMessage(ciphertext, ivB64, key) {
  try {
    const decBuf = await crypto.subtle.decrypt(
      { name: 'AES-GCM', iv: b64ToBuf(ivB64) },
      key,
      b64ToBuf(ciphertext)
    );
    return new TextDecoder().decode(decBuf);
  } catch {
    return '[Encrypted message]';
  }
}

// ── Firestore Operations ──────────────────────────────────────────────────────

/**
 * Get or create a conversation document between two users.
 * Returns the conversation ID.
 */
export async function getOrCreateConversation(myUid, otherUid) {
  const cid = convId(myUid, otherUid);
  const convRef = doc(db, 'conversations', cid);
  const snap = await getDoc(convRef);

  if (!snap.exists()) {
    await setDoc(convRef, {
      participants: [String(myUid), String(otherUid)],
      createdAt: serverTimestamp(),
      lastMessage: null,
    });
  }
  return cid;
}

/**
 * Send an encrypted message to a conversation.
 */
export async function sendMessage(cid, myUid, text, encKey) {
  const { ciphertext, iv } = await encryptMessage(text, encKey);

  const messagesRef = collection(db, 'conversations', cid, 'messages');
  await addDoc(messagesRef, {
    ciphertext,
    iv,
    senderId: String(myUid),
    timestamp: serverTimestamp(),
    read: false,
  });

  // Update conversation's lastMessage preview (encrypted)
  const convRef = doc(db, 'conversations', cid);
  await updateDoc(convRef, {
    lastMessage: { ciphertext, iv, senderId: String(myUid), timestamp: serverTimestamp() },
    updatedAt: serverTimestamp(),
  });
}

/**
 * Subscribe to real-time messages in a conversation.
 * Decrypts each message before calling the callback.
 *
 * @param {string} cid - Conversation ID
 * @param {CryptoKey} encKey - Derived AES key
 * @param {function} callback - Called with decrypted messages array
 * @returns {function} Unsubscribe function
 */
export function subscribeMessages(cid, encKey, callback) {
  const messagesRef = collection(db, 'conversations', cid, 'messages');
  const q = query(messagesRef, orderBy('timestamp', 'asc'));

  return onSnapshot(q, async (snapshot) => {
    const decrypted = await Promise.all(
      snapshot.docs.map(async (d) => {
        const data = d.data();
        const text = await decryptMessage(data.ciphertext, data.iv, encKey);
        return {
          id: d.id,
          text,
          senderId: data.senderId,
          timestamp: data.timestamp?.toDate?.() || new Date(),
          read: data.read,
        };
      })
    );
    callback(decrypted);
  });
}

/**
 * Mark a message as read.
 */
export async function markRead(cid, msgId) {
  const msgRef = doc(db, 'conversations', cid, 'messages', msgId);
  await updateDoc(msgRef, { read: true });
}

/**
 * Subscribe to all conversations for a user.
 * Returns basic conversation metadata (not decrypted lastMessage for performance).
 *
 * @param {string|number} myUid
 * @param {function} callback - Called with conversations array
 * @returns {function} Unsubscribe function
 */
export function subscribeConversations(myUid, callback) {
  const convsRef = collection(db, 'conversations');
  const q = query(
    convsRef,
    where('participants', 'array-contains', String(myUid))
  );

  return onSnapshot(q, (snapshot) => {
    const convs = snapshot.docs.map((d) => ({
      id: d.id,
      ...d.data(),
      updatedAt: d.data().updatedAt?.toDate?.() || new Date(0),
    }));
    // Sort by most recent activity
    convs.sort((a, b) => b.updatedAt - a.updatedAt);
    callback(convs);
  });
}

/**
 * Update typing indicator for a user in a conversation.
 */
export async function setTyping(cid, myUid, isTyping) {
  const convRef = doc(db, 'conversations', cid);
  await updateDoc(convRef, {
    [`typing.${myUid}`]: isTyping,
  }).catch(() => {}); // Ignore if doc doesn't exist yet
}
