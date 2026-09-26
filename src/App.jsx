import { useState, useEffect, useCallback } from 'react';
import { useAuth } from './context/AuthContext';

import HomePage from './User_end/pages/screens/HomePage';
import AboutPage from './User_end/pages/screens/AboutPage';
import SuccessStoriesPage from './User_end/pages/screens/SuccessStoriesPage';
import MembershipPage from './User_end/pages/screens/MembershipPage';
import BranchesPage from './User_end/pages/screens/BranchesPage';
import ContactPage from './User_end/pages/screens/ContactPage';
import LoginPage from './User_end/pages/screens/LoginPage';
import RegisterPage from './User_end/pages/screens/RegisterPage';
import DashboardPage from './User_end/pages/screens/DashboardPage';
import MyProfilePage from './User_end/pages/screens/MyProfilePage';
import ViewProfilePage from './User_end/pages/screens/ViewProfilePage';
import MyMatchesPage from './User_end/pages/screens/MyMatchesPage';
import MessagesPage from './User_end/pages/screens/MessagesPage';
import SentInterestsPage from './User_end/pages/screens/SentInterestsPage';
import ReceivedInterestsPage from './User_end/pages/screens/ReceivedInterestsPage';
import MeetingsPage from './User_end/pages/screens/MeetingsPage';
import SubscriptionPlansPage from './User_end/pages/screens/SubscriptionPlansPage';
import NotificationsPage from './User_end/pages/screens/NotificationsPage';
import SettingsPage from './User_end/pages/screens/SettingsPage';
import LogoutPage from './User_end/pages/screens/LogoutPage';
import { initFCM, onForegroundMessage } from './firebase/firebaseNotifications';



// ── Routes that require the user to be logged in ──────────────────────────────
const PROTECTED_ROUTES = new Set([
  '#dashboard', '#profile', '#matches', '#messages',
  '#sent', '#received', '#meetings', '#subscription',
  '#notifications', '#settings', '#logout',
]);

function getPageForRoute(route, isLoggedIn) {
  if (PROTECTED_ROUTES.has(route) && !isLoggedIn) {
    window.location.hash = '#login';
    return <LoginPage />;
  }

  if (route.startsWith('#profile/')) {
    if (!isLoggedIn) {
      window.location.hash = '#login';
      return <LoginPage />;
    }
    const profileId = route.replace('#profile/', '').split('?')[0];
    return <ViewProfilePage profileId={profileId} />;
  }

  switch (route) {
    case '#about':         return <AboutPage />;
    case '#success':       return <SuccessStoriesPage />;
    case '#membership':    return <MembershipPage />;
    case '#subscription':  return <SubscriptionPlansPage />;
    case '#branches':      return <BranchesPage />;
    case '#contact':       return <ContactPage />;
    case '#login':         return <LoginPage />;
    case '#register':      return <RegisterPage />;
    case '#dashboard':     return <DashboardPage />;
    case '#profile':       return <MyProfilePage />;
    case '#matches':       return <MyMatchesPage />;
    case '#messages':      return <MessagesPage />;
    case '#sent':          return <SentInterestsPage />;
    case '#received':      return <ReceivedInterestsPage />;
    case '#meetings':      return <MeetingsPage />;
    case '#notifications': return <NotificationsPage />;
    case '#settings':      return <SettingsPage />;
    case '#logout':        return <LogoutPage />;
    default:               return <HomePage />;
  }
}

// ── Global Interest Success Toast ─────────────────────────────────────────────
function InterestSuccessToast({ toast, onDismiss }) {
  useEffect(() => {
    if (!toast) return;
    const t = setTimeout(onDismiss, 4000);
    return () => clearTimeout(t);
  }, [toast, onDismiss]);

  if (!toast) return null;

  return (
    <>
      <style>{`
        @keyframes msSlideDown {
          from { opacity: 0; transform: translateX(-50%) translateY(-24px) scale(0.95); }
          to   { opacity: 1; transform: translateX(-50%) translateY(0) scale(1); }
        }
      `}</style>
      <div
        onClick={onDismiss}
        style={{
          position: 'fixed',
          top: '24px',
          right: '24px',
          left: 'auto',
          transform: 'none',
          zIndex: 99999,
          background: 'linear-gradient(135deg, #1a7a4a, #27ae60)',
          color: '#fff',
          borderRadius: '16px',
          padding: '14px 20px',
          boxShadow: '0 8px 40px rgba(39,174,96,0.45)',
          display: 'flex',
          alignItems: 'center',
          gap: '12px',
          minWidth: '280px',
          maxWidth: '400px',
          animation: 'msSlideDown 0.35s cubic-bezier(0.34,1.56,0.64,1)',
          cursor: 'pointer',
          userSelect: 'none',
        }}
      >
        {/* Icon */}
        <div style={{
          width: '40px', height: '40px', borderRadius: '50%',
          background: 'rgba(255,255,255,0.22)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          fontSize: '20px', flexShrink: 0,
        }}>
          💌
        </div>

        {/* Text */}
        <div style={{ flex: 1 }}>
          <div style={{ fontWeight: 700, fontSize: '14px', marginBottom: '2px' }}>
            Interest Sent Successfully!
          </div>
          <div style={{ fontSize: '12px', opacity: 0.9 }}>
            Sent to <strong>{toast.name}</strong>
            {toast.matchScore > 0 ? ` · ${toast.matchScore}% match` : ''}
          </div>
        </div>

        {/* Close */}
        <div style={{ fontSize: '18px', opacity: 0.7, flexShrink: 0, lineHeight: 1 }}>
          ×
        </div>
      </div>
    </>
  );
}

// ── Global FCM Notification Toast ──────────────────────────────────────────────
function FCMNotificationToast({ toast, onDismiss }) {
  useEffect(() => {
    if (!toast) return;
    const t = setTimeout(onDismiss, 5000);
    return () => clearTimeout(t);
  }, [toast, onDismiss]);

  if (!toast) return null;

  return (
    <>
      <style>{`
        @keyframes fcmSlideIn {
          from { opacity: 0; transform: translateY(-40px) scale(0.95); }
          to   { opacity: 1; transform: translateY(0) scale(1); }
        }
      `}</style>
      <div
        onClick={() => {
          if (toast.url) window.location.hash = toast.url;
          onDismiss();
        }}
        style={{
          position: 'fixed',
          top: '24px',
          right: '24px',
          zIndex: 999999,
          background: 'rgba(255, 255, 255, 0.95)',
          backdropFilter: 'blur(10px)',
          border: '1px solid rgba(123, 31, 46, 0.15)',
          color: '#333',
          borderRadius: '16px',
          padding: '16px 20px',
          boxShadow: '0 12px 32px rgba(123, 31, 46, 0.15)',
          display: 'flex',
          alignItems: 'start',
          gap: '12px',
          width: '320px',
          animation: 'fcmSlideIn 0.3s cubic-bezier(0.34,1.56,0.64,1)',
          cursor: 'pointer',
        }}
      >
        <div style={{
          width: '36px', height: '36px', borderRadius: '10px',
          background: '#7B1F2E', color: '#fff',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          fontSize: '18px', flexShrink: 0,
        }}>
          🔔
        </div>
        <div style={{ flex: 1 }}>
          <div style={{ fontWeight: 700, fontSize: '13px', color: '#7B1F2E', marginBottom: '2px' }}>
            {toast.title}
          </div>
          <div style={{ fontSize: '12px', color: '#666', lineHeight: '1.4' }}>
            {toast.body}
          </div>
        </div>
        <div style={{ fontSize: '16px', color: '#999', flexShrink: 0 }}>×</div>
      </div>
    </>
  );
}

// ── App ───────────────────────────────────────────────────────────────────────
export default function App() {
  const [route, setRoute] = useState(window.location.hash || '#home');
  const { user, loading } = useAuth();
  const [interestToast, setInterestToast] = useState(null);
  const [fcmToast, setFcmToast] = useState(null);

  // Hash-based routing
  useEffect(() => {
    const handleHashChange = () => {
      setRoute(window.location.hash || '#home');
      window.scrollTo(0, 0);
    };
    window.addEventListener('hashchange', handleHashChange);
    return () => window.removeEventListener('hashchange', handleHashChange);
  }, []);

  // Global listener — any page dispatches interest:sent, we show the toast
  useEffect(() => {
    const handleInterestSent = (e) => {
      const { name, matchScore } = e.detail || {};
      setInterestToast({ name: name || 'this member', matchScore: matchScore || 0 });
    };
    window.addEventListener('interest:sent', handleInterestSent);
    return () => window.removeEventListener('interest:sent', handleInterestSent);
  }, []);

  const dismissToast = useCallback(() => setInterestToast(null), []);
  const dismissFcmToast = useCallback(() => setFcmToast(null), []);

  // Global FCM Token Registration on User Login
  useEffect(() => {
    if (user) {
      initFCM().catch(err => console.warn('[FCM] Global init failed:', err));
    }
  }, [user]);

  // Global FCM Foreground Notification Listener
  useEffect(() => {
    let unsubFCM = null;
    if (user) {
      onForegroundMessage(({ title, body, data }) => {
        // Only show global toast if we are NOT on the messages page
        // (the messages page has its own chat toast and chat thread handler)
        if (window.location.hash !== '#messages') {
          setFcmToast({ title, body, url: data?.url });
        }
      }).then(unsub => { unsubFCM = unsub; });
    }
    return () => { if (typeof unsubFCM === 'function') unsubFCM(); };
  }, [user]);


  if (loading) return null;

  return (
    <>
      {getPageForRoute(route, !!user)}
      <InterestSuccessToast toast={interestToast} onDismiss={dismissToast} />
      <FCMNotificationToast toast={fcmToast} onDismiss={dismissFcmToast} />
    </>
  );
}

