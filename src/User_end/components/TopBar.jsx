import React from 'react';
import styles from '../pages/styles/top_bar.module.css';
import AuthenticatedImage from '../../components/AuthenticatedImage';
import { useAuth } from '../../context/AuthContext';

const Icons = {
  Search: () => (
    <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2">
      <circle cx="11" cy="11" r="8" /><line x1="21" y1="21" x2="16.65" y2="16.65" />
    </svg>
  ),
  Bell: () => (
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
};

/**
 * Shared TopBar component used across all authenticated pages.
 * Props:
 *   searchPlaceholder - string, optional
 *   avatarSrc - img src, optional (falls back to profile photo from context)
 */
const TopBar = ({
  searchPlaceholder = 'Search...',
  avatarSrc = null,
}) => {
  const { profile, user, account } = useAuth();

  const displayName = profile?.full_name || user?.email?.split('@')[0] || 'Member';
  const membershipTier = account?.user_type
    ? account.user_type.charAt(0).toUpperCase() + account.user_type.slice(1) + ' Member'
    : user?.user_type
      ? user.user_type.charAt(0).toUpperCase() + user.user_type.slice(1) + ' Member'
      : 'Member';

  const photoSrc = avatarSrc || (profile?.profile_photo_url ?? null);

  return (
    <header className={styles.topBar}>
      <div className={styles.searchContainer}>
        <span className={styles.searchIcon}><Icons.Search /></span>
        <input
          type="text"
          placeholder={searchPlaceholder}
          className={styles.searchInput}
        />
      </div>

      <div className={styles.topBarActions}>
        <a href="#notifications" className={styles.iconBtn} title="Notifications">
          <Icons.Bell />
          <span className={styles.notifDot}></span>
        </a>
        <a href="#settings" className={styles.iconBtn} title="Settings">
          <Icons.Settings />
        </a>
        <div className={styles.userBlock}>
          <div className={styles.userInfo}>
            <span className={styles.userName}>{displayName}</span>
            <span className={styles.userRole}>{membershipTier}</span>
          </div>
          {photoSrc?.startsWith?.('/api/') ? (
            <AuthenticatedImage src={photoSrc} alt={displayName} className={styles.avatar} />
          ) : photoSrc ? (
            <img src={photoSrc} alt={displayName} className={styles.avatar} />
          ) : (
            <div className={styles.avatarPlaceholder} aria-label={displayName} />
          )}
        </div>
      </div>
    </header>
  );
};

export default TopBar;
