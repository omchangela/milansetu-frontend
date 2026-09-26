// ─────────────────────────────────────────────────────────────────────────────
// src/firebase/firebase.js
//
// Firebase app initialization.
// Fill in your config values from Firebase Console:
//   Project Settings → Your Apps → Web App → SDK setup and configuration
// ─────────────────────────────────────────────────────────────────────────────
import { initializeApp, getApps } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';
import { getMessaging, isSupported } from 'firebase/messaging';

// ── PASTE YOUR FIREBASE CONFIG HERE ──────────────────────────────────────────
const firebaseConfig = {
  apiKey:            "AIzaSyDoD1zEDacT1bg4ucrlra9dLT-DDs2pRJ4",
  authDomain:        "milansetu.firebaseapp.com",
  projectId:         "milansetu",
  storageBucket:     "milansetu.firebasestorage.app",
  messagingSenderId: "1020492452794",
  appId:             "1:1020492452794:web:3c80f1d512af279cc8c383",
  measurementId:     "G-XNNE7XBLZ6",
};

// ── VAPID Key for Web Push (FCM) ──────────────────────────────────────────────
// Firebase Console → Project Settings → Cloud Messaging → Web Push certificates → Key pair
// TODO: Replace with your actual VAPID key from Firebase Console
export const VAPID_KEY = "BMQvd5nstu5f2Xvarq9LvbuTkewfEGXxfw6pVI06pMxZC8yHKWDIS5Sk7viMQyOQlsDVXLFUjefAs-LDdr--jr8";

// ── App Encryption Secret ─────────────────────────────────────────────────────
// A strong passphrase used to derive per-conversation AES keys.
export const APP_ENCRYPTION_SECRET = "milansetu-chat-secret-2024-secure";
// ─────────────────────────────────────────────────────────────────────────────

// Singleton init
const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApps()[0];

export const db = getFirestore(app);

// Messaging only works in browsers that support Service Workers
export const getMessagingInstance = async () => {
  const supported = await isSupported();
  if (!supported) return null;
  return getMessaging(app);
};

export default app;
