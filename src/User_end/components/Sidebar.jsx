import React from 'react';
import styles from '../pages/styles/sidebar.module.css';
// static profile image removed in favor of dynamic avatars

const Icons = {
  Dashboard: () => (
    <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2">
      <rect x="3" y="3" width="7" height="7" /><rect x="14" y="3" width="7" height="7" />
      <rect x="14" y="14" width="7" height="7" /><rect x="3" y="14" width="7" height="7" />
    </svg>
  ),
  Messages: () => (
    <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
    </svg>
  ),
  Profile: () => (
    <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" /><circle cx="12" cy="7" r="4" />
    </svg>
  ),
  Matches: () => (
    <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l8.84-8.84 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
    </svg>
  ),
  Sent: () => (
    <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2">
      <line x1="22" y1="2" x2="11" y2="13" /><polygon points="22 2 15 22 11 13 2 9 22 2" />
    </svg>
  ),
  Received: () => (
    <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2">
      <polyline points="17 10 12 15 7 10" /><line x1="12" y1="15" x2="12" y2="3" />
      <path d="M20 21H4" />
    </svg>
  ),
  Meetings: () => (
    <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" /><circle cx="9" cy="7" r="4" />
      <path d="M23 21v-2a4 4 0 0 0-3-3.87" /><path d="M16 3.13a4 4 0 0 1 0 7.75" />
    </svg>
  ),
  Subscription: () => (
    <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M20 12V8H4v4" /><path d="M2 20h20" /><path d="M7 8V5a1 1 0 0 1 1-1h8a1 1 0 0 1 1 1v3" />
      <path d="M12 12a3 3 0 1 0 0 6 3 3 0 0 0 0-6z" />
    </svg>
  ),
  Notifications: () => (
    <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" /><path d="M13.73 21a2 2 0 0 1-3.46 0" />
    </svg>
  ),
  Settings: () => (
    <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2">
      <circle cx="12" cy="12" r="3" />
      <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z" />
    </svg>
  ),
  Logout: () => (
    <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" /><polyline points="16 17 21 12 16 7" /><line x1="21" y1="12" x2="9" y2="12" />
    </svg>
  )
};

const navItems = [
  { id: 'dashboard', label: 'Dashboard', icon: <Icons.Dashboard />, href: '#dashboard' },
  { id: 'profile', label: 'My Profile', icon: <Icons.Profile />, href: '#profile' },
  { id: 'matches', label: 'My Matches', icon: <Icons.Matches />, href: '#matches' },
  { id: 'messages', label: 'Messages', icon: <Icons.Messages />, href: '#messages' },
  { id: 'sent', label: 'Sent Interests', icon: <Icons.Sent />, href: '#sent' },
  { id: 'received', label: 'Received Interests', icon: <Icons.Received />, href: '#received' },
  { id: 'meetings', label: 'Meetings', icon: <Icons.Meetings />, href: '#meetings' },
  { id: 'subscription', label: 'Subscription Plans', icon: <Icons.Subscription />, href: '#subscription' },
  { id: 'notifications', label: 'Notifications', icon: <Icons.Notifications />, href: '#notifications' },
  { id: 'settings', label: 'Settings', icon: <Icons.Settings />, href: '#settings' },
  { id: 'logout', label: 'Logout', icon: <Icons.Logout />, href: '#logout' }
];

const Sidebar = ({ activePage, topContent, bottomContent }) => {
  return (
    <aside className={styles.sidebar}>
      {topContent || (
        <div className={styles.logoBlock}>
          <div className={styles.logoText}>MilanSetu</div>
          <div className={styles.logoTagline}>PREMIUM MATRIMONY</div>
        </div>
      )}

      <nav className={styles.navList}>
        {navItems.map((item) => (
          <a
            key={item.id}
            href={item.href}
            className={`${styles.navItem} ${activePage === item.id ? styles.activeNavItem : ''}`}
          >
            <span className={styles.navIcon}>{item.icon}</span>
            {item.label}
          </a>
        ))}
      </nav>

      <div className={styles.sidebarBottom}>
        {bottomContent || (
          <div className={styles.tierCard}>
            <div className={styles.tierLabel}>Current Plan</div>
            <div className={styles.tierName}>Gold Membership</div>
            <button className={styles.upgradeBtn}>Upgrade to Premium</button>
          </div>
        )}
      </div>
    </aside>
  );
};

export default Sidebar;
