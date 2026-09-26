import React, { useEffect } from 'react';
import styles from '../styles/logout_page.module.css';
import Sidebar from '../../components/Sidebar';
import TopBar from '../../components/TopBar';
import { useAuth } from '../../../context/AuthContext';

const Icons = {
  LogoutCycle: () => (
    <svg viewBox="0 0 24 24" width="28" height="28" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
      <polyline points="16 17 21 12 16 7" />
      <line x1="21" y1="12" x2="9" y2="12" />
    </svg>
  ),
  CheckSmall: () => (
    <svg viewBox="0 0 24 24" width="10" height="10" fill="none" stroke="currentColor" strokeWidth="4">
      <polyline points="20 6 9 17 4 12" />
    </svg>
  ),
  ArrowRight: () => (
    <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2">
      <line x1="5" y1="12" x2="19" y2="12" />
      <polyline points="12 5 19 12 12 19" />
    </svg>
  ),
  ShieldSolid: () => (
    <svg viewBox="0 0 24 24" width="18" height="18" fill="currentColor" stroke="currentColor" strokeWidth="1">
      <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
    </svg>
  ),
};

const LogoutPage = () => {
  const { logout, user } = useAuth();
  // Capture name before logout clears it
  const displayName = user?.email || 'User';

  useEffect(() => {
    logout(); // Clear tokens + user state on mount
  }, [logout]);

  return (
    <div className={styles.container}>
      <Sidebar activePage="logout" />

      <div className={styles.mainLayout}>
        <div className={styles.overlay}></div>

        <TopBar searchPlaceholder="Search profiles..." />

        <div className={styles.modalContainer}>
          <div className={styles.logoutCard}>
            <div className={styles.cardBrand}>MilanSetu</div>

            <div className={styles.iconWrapper}>
              <div className={styles.logoutCircle}>
                <Icons.LogoutCycle />
              </div>
              <div className={styles.checkBadge}>
                <Icons.CheckSmall />
              </div>
            </div>

            <h1 className={styles.headingText}>
              Farewell for now,<br />
              <span className={styles.headingName}>{displayName}</span>
            </h1>

            <p className={styles.subtext}>
              You have been securely logged out. We look forward to welcoming you back to your journey soon.
            </p>

            <button
              className={styles.primaryBtn}
              onClick={() => { window.location.hash = '#login'; }}
            >
              RETURN TO LOGIN <Icons.ArrowRight />
            </button>

            <a href="#home" className={styles.secondaryLink}>
              Back to Homepage
            </a>

            <div className={styles.safetyBanner}>
              <div className={styles.shieldIcon}><Icons.ShieldSolid /></div>
              <div className={styles.safetyText}>
                <span className={styles.safetyBold}>Safety Tip:</span>{' '}
                Always ensure you log out when using public devices to protect your elite matchmaking profile and maintain your personal security.
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LogoutPage;
