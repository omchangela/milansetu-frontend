import React, { useState, useEffect, useRef, useCallback } from 'react';
import styles from '../styles/messages_page.module.css';
import Sidebar from '../../components/Sidebar';
import TopBar from '../../components/TopBar';
import AuthenticatedImage from '../../../components/AuthenticatedImage';
import { useAuth } from '../../../context/AuthContext';
import { fetchAcceptedInterests } from '../../../api/auth';
import { initFCM, onForegroundMessage } from '../../../firebase/firebaseNotifications';
import {
  getOrCreateConversation,
  sendMessage,
  subscribeMessages,
  subscribeConversations,
  setTyping,
  deriveEncryptionKey,
  convId,
} from '../../../firebase/firebaseChat';
import { getProfileAvatar } from '../../../utils/profileHelpers';

// ── Icons ─────────────────────────────────────────────────────────────────────
const Icons = {
  Send: () => (
    <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2">
      <line x1="22" y1="2" x2="11" y2="13" /><polygon points="22 2 15 22 11 13 2 9 22 2" />
    </svg>
  ),
  Search: () => (
    <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2">
      <circle cx="11" cy="11" r="8" /><line x1="21" y1="21" x2="16.65" y2="16.65" />
    </svg>
  ),
  MoreVertical: () => (
    <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2">
      <circle cx="12" cy="5" r="1" /><circle cx="12" cy="12" r="1" /><circle cx="12" cy="19" r="1" />
    </svg>
  ),
  Phone: () => (
    <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" />
    </svg>
  ),
  Video: () => (
    <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2">
      <polygon points="23 7 16 12 23 17 23 7" /><rect x="1" y="5" width="15" height="14" rx="2" ry="2" />
    </svg>
  ),
  Emoji: () => (
    <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2">
      <circle cx="12" cy="12" r="10" /><path d="M8 14s1.5 2 4 2 4-2 4-2" />
      <line x1="9" y1="9" x2="9.01" y2="9" /><line x1="15" y1="9" x2="15.01" y2="9" />
    </svg>
  ),
  Attach: () => (
    <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M21.44 11.05l-9.19 9.19a6 6 0 0 1-8.49-8.49l9.19-9.19a4 4 0 0 1 5.66 5.66l-9.2 9.19a2 2 0 0 1-2.83-2.83l8.49-8.48" />
    </svg>
  ),
  Check: () => (
    <svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2.5">
      <polyline points="20 6 9 17 4 12" />
    </svg>
  ),
  CheckCheck: () => (
    <svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2.5">
      <polyline points="17 1 21 5 7 19" /><path d="M1 12l4 4L15 5" />
    </svg>
  ),
  Lock: () => (
    <svg viewBox="0 0 24 24" width="12" height="12" fill="none" stroke="currentColor" strokeWidth="2">
      <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
      <path d="M7 11V7a5 5 0 0 1 10 0v4" />
    </svg>
  ),
};

// ── Toast notification component ──────────────────────────────────────────────
function Toast({ message, onDismiss }) {
  useEffect(() => {
    const t = setTimeout(onDismiss, 4000);
    return () => clearTimeout(t);
  }, [onDismiss]);

  return (
    <div style={{
      position: 'fixed', top: '80px', right: '24px', zIndex: 9999,
      background: 'linear-gradient(135deg, #7B1F2E, #c0392b)',
      color: '#fff', borderRadius: '14px', padding: '14px 20px',
      boxShadow: '0 8px 32px rgba(123,31,46,0.4)',
      maxWidth: '320px', animation: 'slideInRight 0.3s ease',
      display: 'flex', flexDirection: 'column', gap: '4px',
    }}>
      <div style={{ fontWeight: 700, fontSize: '14px' }}>{message.title}</div>
      <div style={{ fontSize: '13px', opacity: 0.9 }}>{message.body}</div>
    </div>
  );
}

function formatTime(ts) {
  if (!ts) return '';
  const d = ts instanceof Date ? ts : new Date(ts);
  return d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
}

function formatConvTime(ts) {
  if (!ts) return '';
  const d = ts instanceof Date ? ts : new Date(ts);
  const now = new Date();
  const diffDays = Math.floor((now - d) / 86400000);
  if (diffDays === 0) return d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  if (diffDays === 1) return 'Yesterday';
  return d.toLocaleDateString([], { day: 'numeric', month: 'short' });
}

// ── Firebase config check ─────────────────────────────────────────────────────
function isFirebaseConfigured() {
  try {
    // Import is already done; if the projectId is a placeholder, Firebase won't work
    const projectId = import.meta.env.VITE_FIREBASE_PROJECT_ID;
    // Also check if the config in firebase.js has been filled in
    // We'll try to detect unconfigured state via a flag
    return typeof projectId === 'string' && projectId.length > 0 && !projectId.includes('REPLACE');
  } catch {
    return false;
  }
}

// ── Main MessagesPage ─────────────────────────────────────────────────────────
const MessagesPage = () => {
  const { user, profile } = useAuth();
  const myUid = user?.id;

  const [contacts, setContacts] = useState([]);
  const [loadingContacts, setLoadingContacts] = useState(true);
  const [selectedContact, setSelectedContact] = useState(null);
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [sending, setSending] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [typingTimeout, setTypingTimeout] = useState(null);
  const [toast, setToast] = useState(null);
  const [firebaseReady, setFirebaseReady] = useState(false);
  const [encKey, setEncKey] = useState(null);
  const [currentConvId, setCurrentConvId] = useState(null);
  const [convMap, setConvMap] = useState({}); // convId → lastMessage preview

  const messagesEndRef = useRef(null);
  const inputRef = useRef(null);
  const msgUnsubRef = useRef(null);
  const convUnsubRef = useRef(null);

  // ── Load accepted contacts from backend ──────────────────────────────────
  useEffect(() => {
    if (!myUid) return;
    setLoadingContacts(true);
    fetchAcceptedInterests().then(({ data }) => {
      if (!data) { setLoadingContacts(false); return; }
      const contactList = data.map((item) => {
        const p = item.profile || {};
        return {
          id: item.other_user_id,
          name: p.full_name || item.other_user_email,
          role: p.current_designation || p.education || 'Member',
          match: `${item.match_score}%`,
          avatarUrl: p.profile_photo_url || null,
          profileData: p,
          online: false,
          status: 'accepted',
          lastMessage: 'Click to start chatting',
          lastTime: '',
          unread: 0,
        };
      });
      setContacts(contactList);
      if (contactList.length > 0 && !selectedContact) {
        setSelectedContact(contactList[0]);
      }
      setLoadingContacts(false);
    });
  }, [myUid]);

  // ── Init Firebase and FCM ────────────────────────────────────────────────
  useEffect(() => {
    if (!myUid) return;

    const checkFirebase = async () => {
      try {
        const { db } = await import('../../../firebase/firebaseChat');
        const { doc, getDoc } = await import('firebase/firestore');
        await getDoc(doc(db, '_ping', 'test'));
        setFirebaseReady(true);
        initFCM().catch(() => {});
      } catch (err) {
        const code = err?.code || '';
        // permission-denied means Firestore IS reachable — just rules block us
        // unavailable / failed-precondition = not set up yet
        if (
          code === 'permission-denied' ||
          code === 'unauthenticated' ||
          code.includes('not-found')
        ) {
          // Firestore exists and responded — treat as ready
          setFirebaseReady(true);
          initFCM().catch(() => {});
        } else {
          console.warn('[Firebase] Firestore not reachable:', code, err?.message);
          setFirebaseReady(false);
        }
      }
    };
    checkFirebase();
  }, [myUid]);

  // ── Subscribe to conversations list (for last message preview) ────────────
  useEffect(() => {
    if (!firebaseReady || !myUid) return;

    convUnsubRef.current?.();
    convUnsubRef.current = subscribeConversations(myUid, (convs) => {
      const map = {};
      convs.forEach(c => { map[c.id] = c; });
      setConvMap(map);
    });
    return () => convUnsubRef.current?.();
  }, [firebaseReady, myUid]);

  // ── Foreground FCM notifications ─────────────────────────────────────────
  useEffect(() => {
    if (!firebaseReady) return;
    let unsubFCM = null;
    onForegroundMessage(({ title, body, data }) => {
      // Don't show toast if we're already in the relevant chat
      const isCurrentChat = data?.sender_id && String(data.sender_id) === String(selectedContact?.id);
      if (!isCurrentChat) {
        setToast({ title, body });
      }
    }).then(unsub => { unsubFCM = unsub; });
    return () => { if (typeof unsubFCM === 'function') unsubFCM(); };
  }, [firebaseReady, selectedContact]);

  // ── Open a conversation with a contact ────────────────────────────────────
  useEffect(() => {
    if (!selectedContact || !myUid || !firebaseReady) return;

    // Clean up previous listener
    msgUnsubRef.current?.();
    setMessages([]);

    const openConv = async () => {
      const cid = await getOrCreateConversation(myUid, selectedContact.id);
      setCurrentConvId(cid);

      const key = await deriveEncryptionKey(myUid, selectedContact.id);
      setEncKey(key);

      msgUnsubRef.current = subscribeMessages(cid, key, (msgs) => {
        setMessages(msgs);
        setTimeout(() => messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' }), 50);
      });
    };
    openConv();

    return () => msgUnsubRef.current?.();
  }, [selectedContact, myUid, firebaseReady]);

  // ── Scroll to bottom when messages update ────────────────────────────────
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // ── Send message ──────────────────────────────────────────────────────────
  const handleSend = useCallback(async (e) => {
    e?.preventDefault();
    const text = input.trim();
    if (!text || !selectedContact || sending) return;

    setInput('');
    setSending(true);

    if (firebaseReady && currentConvId && encKey) {
      try {
        await sendMessage(currentConvId, myUid, text, encKey);
      } catch (err) {
        console.error('[Chat] Send failed:', err);
        // Fallback: store in localStorage
        const key = `ms_chat_fallback_${myUid}_${selectedContact.id}`;
        const prev = JSON.parse(localStorage.getItem(key) || '[]');
        prev.push({ id: Date.now(), text, senderId: myUid, timestamp: new Date(), read: false });
        localStorage.setItem(key, JSON.stringify(prev));
      }
    } else {
      // Firebase not configured — use localStorage fallback
      const key = `ms_chat_fallback_${myUid}_${selectedContact.id}`;
      const prev = JSON.parse(localStorage.getItem(key) || '[]');
      const newMsg = { id: Date.now(), text, senderId: myUid, timestamp: new Date().toISOString(), read: false };
      prev.push(newMsg);
      localStorage.setItem(key, JSON.stringify(prev));
      setMessages(p => [...p, { ...newMsg, timestamp: new Date() }]);
    }

    setSending(false);
    inputRef.current?.focus();
  }, [input, selectedContact, sending, firebaseReady, currentConvId, encKey, myUid]);

  // ── Typing indicator ──────────────────────────────────────────────────────
  const handleInputChange = (e) => {
    setInput(e.target.value);
    if (!firebaseReady || !currentConvId || !myUid) return;
    clearTimeout(typingTimeout);
    setTyping(currentConvId, myUid, true).catch(() => {});
    setTypingTimeout(setTimeout(() => {
      setTyping(currentConvId, myUid, false).catch(() => {});
    }, 2000));
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  // ── Fallback localStorage messages (when Firebase not configured) ─────────
  useEffect(() => {
    if (firebaseReady || !selectedContact || !myUid) return;
    const key = `ms_chat_fallback_${myUid}_${selectedContact.id}`;
    const raw = localStorage.getItem(key);
    if (raw) {
      const msgs = JSON.parse(raw).map(m => ({ ...m, timestamp: new Date(m.timestamp) }));
      setMessages(msgs);
    } else {
      setMessages([]);
    }
  }, [selectedContact, myUid, firebaseReady]);

  const filteredContacts = contacts.filter(c =>
    c.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const getLastMsgPreview = (contact) => {
    const cid = convId(myUid, contact.id);
    const conv = convMap[cid];
    if (conv?.lastMessage) return '🔒 Encrypted message';
    return contact.lastMessage || 'Click to start chatting';
  };

  const getLastMsgTime = (contact) => {
    const cid = convId(myUid, contact.id);
    const conv = convMap[cid];
    return conv?.updatedAt ? formatConvTime(conv.updatedAt) : contact.lastTime || '';
  };

  return (
    <div className={styles.container}>
      <Sidebar activePage="messages" />

      <main className={styles.mainContent}>
        <TopBar searchPlaceholder="Search connections..." />

        {/* FCM Toast */}
        {toast && <Toast message={toast} onDismiss={() => setToast(null)} />}

        <div className={styles.messagesLayout}>
          {/* Left: Conversations List */}
          <aside className={styles.contactsPanel}>
            <div className={styles.contactsHeader}>
              <h2 className={styles.contactsTitle}>Messages</h2>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                {firebaseReady && (
                  <span style={{
                    display: 'flex', alignItems: 'center', gap: '4px',
                    fontSize: '11px', color: '#4caf50', fontWeight: 600,
                  }}>
                    <Icons.Lock /> E2E Encrypted
                  </span>
                )}
                <span className={styles.contactsCount}>{contacts.length} chats</span>
              </div>
            </div>

            <div className={styles.searchBar}>
              <Icons.Search />
              <input
                type="text"
                placeholder="Search conversations..."
                className={styles.searchInput}
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>

            <div className={styles.contactList}>
              {loadingContacts ? (
                <div className={styles.emptyContacts}>
                  <p style={{ color: '#999' }}>Loading contacts…</p>
                </div>
              ) : filteredContacts.length === 0 ? (
                <div className={styles.emptyContacts}>
                  <p>No conversations found.</p>
                  <p>
                    Accept interest requests to start chatting.{' '}
                    <span
                      style={{ color: '#7B1F2E', cursor: 'pointer', fontWeight: 600 }}
                      onClick={() => { window.location.hash = '#received'; }}
                    >
                      View Requests →
                    </span>
                  </p>
                </div>
              ) : (
                filteredContacts.map((contact) => (
                  <div
                    key={contact.id}
                    className={`${styles.contactItem} ${selectedContact?.id === contact.id ? styles.contactActive : ''}`}
                    onClick={() => setSelectedContact(contact)}
                  >
                    <div className={styles.avatarWrapper}>
                      <AuthenticatedImage
                        src={contact.avatarUrl}
                        profile={contact.profileData}
                        alt={contact.name}
                        className={styles.contactAvatar}
                      />
                      {contact.online && <span className={styles.onlineDot}></span>}
                    </div>
                    <div className={styles.contactInfo}>
                      <div className={styles.contactTopRow}>
                        <span className={styles.contactName}>{contact.name}</span>
                        <span className={styles.contactTime}>{getLastMsgTime(contact)}</span>
                      </div>
                      <div className={styles.contactBottomRow}>
                        <span className={styles.lastMessage}>{getLastMsgPreview(contact)}</span>
                        <span style={{
                          fontSize: '10px', color: '#7B1F2E', fontWeight: 600,
                          background: '#fdf0f2', padding: '2px 6px', borderRadius: '6px',
                        }}>
                          {contact.match}
                        </span>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          </aside>

          {/* Right: Chat Window */}
          <section className={styles.chatPanel}>
            {selectedContact ? (
              <>
                {/* Chat Header */}
                <div className={styles.chatHeader}>
                  <div className={styles.chatHeaderLeft}>
                    <div className={styles.chatAvatarWrapper}>
                      <AuthenticatedImage
                        src={selectedContact.avatarUrl}
                        profile={selectedContact.profileData}
                        alt={selectedContact.name}
                        className={styles.chatAvatar}
                      />
                      {selectedContact.online && <span className={styles.chatOnlineDot}></span>}
                    </div>
                    <div className={styles.chatHeaderInfo}>
                      <div className={styles.chatContactName}>{selectedContact.name}</div>
                      <div className={styles.chatContactSub}>
                        <span className={styles.offlineLabel}>{selectedContact.role}</span>
                        <span className={styles.matchBadge}>✦ {selectedContact.match} Match</span>
                        {firebaseReady && (
                          <span style={{
                            display: 'inline-flex', alignItems: 'center', gap: '3px',
                            fontSize: '11px', color: '#4caf50', fontWeight: 600,
                          }}>
                            <Icons.Lock /> End-to-end encrypted
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                  <div className={styles.chatHeaderActions}>
                    <button className={styles.headerActionBtn} title="Voice call"><Icons.Phone /></button>
                    <button className={styles.headerActionBtn} title="Video call"><Icons.Video /></button>
                    <button className={styles.headerActionBtn}><Icons.MoreVertical /></button>
                  </div>
                </div>

                {/* Firestore not reachable banner */}
                {!firebaseReady && (
                  <div style={{
                    background: '#fff8e6', border: '1px solid #f0c040',
                    padding: '10px 20px', fontSize: '13px', color: '#7a5500',
                    display: 'flex', alignItems: 'center', gap: '8px',
                    flexWrap: 'wrap',
                  }}>
                    ⚠️ <strong>Firestore not reachable.</strong>
                    Go to{' '}
                    <a
                      href="https://console.firebase.google.com/project/milansetu/firestore/rules"
                      target="_blank"
                      rel="noreferrer"
                      style={{ color: '#7B1F2E', fontWeight: 700, textDecoration: 'underline' }}
                    >
                      Firebase Console → Firestore Rules
                    </a>
                    {' '}and change the rule to:{' '}
                    <code style={{ background: '#ffe', padding: '2px 6px', borderRadius: '4px', fontSize: '12px' }}>
                      allow read, write: if true;
                    </code>
                    {' '}(dev mode — no Firebase Auth needed)
                  </div>
                )}

                {/* Messages Area */}
                <div className={styles.messagesArea}>
                  {firebaseReady && (
                    <div style={{
                      textAlign: 'center', padding: '12px 0 4px',
                      fontSize: '11px', color: '#aaa',
                      display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px',
                    }}>
                      <Icons.Lock /> Messages are end-to-end encrypted with AES-256-GCM
                    </div>
                  )}

                  <div className={styles.dateDivider}>Today</div>

                  {messages.length === 0 && (
                    <div style={{ textAlign: 'center', padding: '40px 20px', color: '#bbb' }}>
                      <div style={{ fontSize: '40px', marginBottom: '12px' }}>💬</div>
                      <p style={{ fontWeight: 600, color: '#999' }}>Start the conversation!</p>
                      <p style={{ fontSize: '13px' }}>Say hi to {selectedContact.name}</p>
                    </div>
                  )}

                  {messages.map((msg) => {
                    const isMe = String(msg.senderId) === String(myUid);
                    return (
                      <div
                        key={msg.id}
                        className={`${styles.messageRow} ${isMe ? styles.messageRowMe : styles.messageRowThem}`}
                      >
                        {!isMe && (
                          <AuthenticatedImage
                            src={selectedContact.avatarUrl}
                            profile={selectedContact.profileData}
                            alt=""
                            className={styles.msgAvatar}
                          />
                        )}
                        <div className={`${styles.bubble} ${isMe ? styles.bubbleMe : styles.bubbleThem}`}>
                          <p className={styles.bubbleText}>{msg.text}</p>
                          <div className={styles.bubbleMeta}>
                            <span className={styles.msgTime}>{formatTime(msg.timestamp)}</span>
                            {isMe && (
                              <span className={msg.read ? styles.readIcon : styles.sentIcon}>
                                {msg.read ? <Icons.CheckCheck /> : <Icons.Check />}
                              </span>
                            )}
                          </div>
                        </div>
                      </div>
                    );
                  })}
                  <div ref={messagesEndRef} />
                </div>

                {/* Input Area */}
                <form className={styles.inputArea} onSubmit={handleSend}>
                  <button type="button" className={styles.inputActionBtn} title="Emoji"><Icons.Emoji /></button>
                  <button type="button" className={styles.inputActionBtn} title="Attach file"><Icons.Attach /></button>
                  <input
                    ref={inputRef}
                    type="text"
                    className={styles.messageInput}
                    placeholder={`Message ${selectedContact.name}…`}
                    value={input}
                    onChange={handleInputChange}
                    onKeyDown={handleKeyDown}
                    disabled={sending}
                  />
                  <button
                    type="submit"
                    className={`${styles.sendBtn} ${input.trim() ? styles.sendBtnActive : ''}`}
                    disabled={!input.trim() || sending}
                  >
                    <Icons.Send />
                  </button>
                </form>
              </>
            ) : (
              <div className={styles.emptyChat}>
                <div style={{ fontSize: '56px', marginBottom: '16px' }}>💌</div>
                <h3>No conversations yet</h3>
                <p>Accept interest requests to unlock encrypted chat with your matches.</p>
                <button
                  style={{
                    marginTop: '16px', padding: '12px 24px',
                    background: 'linear-gradient(135deg, #7B1F2E, #c0392b)',
                    color: '#fff', border: 'none', borderRadius: '12px',
                    cursor: 'pointer', fontWeight: 600, fontSize: '14px',
                  }}
                  onClick={() => { window.location.hash = '#received'; }}
                >
                  View Interest Requests →
                </button>
              </div>
            )}
          </section>
        </div>
      </main>
    </div>
  );
};

export default MessagesPage;
