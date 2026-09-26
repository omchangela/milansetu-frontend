import React, { useState } from 'react';
import styles from '../styles/settings_page.module.css';
import Sidebar from '../../components/Sidebar';
import sidebarStyles from '../styles/sidebar.module.css';
import TopBar from '../../components/TopBar';

// Icons
const Icons = {
  Search: () => (
    <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2">
      <circle cx="11" cy="11" r="8" /><line x1="21" y1="21" x2="16.65" y2="16.65" />
    </svg>
  ),
  Bell: () => (
    <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" /><path d="M13.73 21a2 2 0 0 1-3.46 0" />
    </svg>
  ),
  Calendar: () => (
    <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2">
      <rect x="3" y="4" width="18" height="18" rx="2" ry="2" /><line x1="16" y1="2" x2="16" y2="6" /><line x1="8" y1="2" x2="8" y2="6" /><line x1="3" y1="10" x2="21" y2="10" />
    </svg>
  ),
  Eye: () => (
    <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" /><circle cx="12" cy="12" r="3" />
    </svg>
  ),
  User: () => (
    <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" /><circle cx="12" cy="7" r="4" />
    </svg>
  ),
  Shield: () => (
    <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
    </svg>
  ),
  Sliders: () => (
    <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2">
      <line x1="4" y1="21" x2="4" y2="14" /><line x1="4" y1="10" x2="4" y2="3" />
      <line x1="12" y1="21" x2="12" y2="12" /><line x1="12" y1="8" x2="12" y2="3" />
      <line x1="20" y1="21" x2="20" y2="16" /><line x1="20" y1="12" x2="20" y2="3" />
      <line x1="2" y1="14" x2="6" y2="14" /><line x1="10" y1="12" x2="14" y2="12" /><line x1="18" y1="16" x2="22" y2="16" />
    </svg>
  ),
  Settings: () => (
    <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2">
      <circle cx="12" cy="12" r="3" />
      <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z" />
    </svg>
  ),
  CreditCard: () => (
    <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2">
      <rect x="1" y="4" width="22" height="16" rx="2" ry="2" /><line x1="1" y1="10" x2="23" y2="10" />
    </svg>
  ),
  Globe: () => (
    <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2">
      <circle cx="12" cy="12" r="10" /><line x1="2" y1="12" x2="22" y2="12" /><path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" />
    </svg>
  ),
  CheckCircle: () => (
    <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" /><polyline points="22 4 12 14.01 9 11.01" />
    </svg>
  ),
  Lock: () => (
    <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2">
      <rect x="3" y="11" width="18" height="11" rx="2" ry="2" /><path d="M7 11V7a5 5 0 0 1 10 0v4" />
    </svg>
  ),
  Phone: () => (
    <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" />
    </svg>
  ),
  Mail: () => (
    <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
      <polyline points="22,6 12,13 2,6" />
    </svg>
  ),
  Camera: () => (
    <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z" />
      <circle cx="12" cy="13" r="4" />
    </svg>
  ),
  Check: () => (
    <svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" strokeWidth="3">
      <polyline points="20 6 9 17 4 12" />
    </svg>
  ),
  LogoutIcon: () => (
    <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" /><polyline points="16 17 21 12 16 7" /><line x1="21" y1="12" x2="9" y2="12" />
    </svg>
  ),
  Trash: () => (
    <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2">
      <polyline points="3 6 5 6 21 6" /><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
    </svg>
  ),
  HelpCircle: () => (
    <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2">
      <circle cx="12" cy="12" r="10" /><path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3" /><line x1="12" y1="17" x2="12.01" y2="17" />
    </svg>
  )
};

const SettingsPage = () => {
  const [activeSubNav, setActiveSubNav] = useState('Privacy & Visibility');
  const [profileVis, setProfileVis] = useState('Everyone');
  const [photoPrivacy, setPhotoPrivacy] = useState('Show to all');
  const [toggles, setToggles] = useState({
    phone: true,
    email: false,
    onlineStatus: true
  });
  const [matchPrefs, setMatchPrefs] = useState({
    verified: true,
    photos: false
  });

  return (
    <div className={styles.container}>
      <Sidebar 
        activePage="settings" 
      />

      <div className={styles.mainLayout}>
        {/* Top Navbar */}
        <TopBar searchPlaceholder="Search settings..." />

        {/* Content Body */}
        <div className={styles.pageBody}>
          
          <div className={styles.titleArea}>
            <h1 className={styles.pageTitle}>Account Settings & Privacy</h1>
            <div className={styles.pageSubtitle}>Manage your preferences, security, and profile visibility.</div>
          </div>

          <div className={styles.settingsGrid}>
            
            {/* Left Sub-nav */}
            <div className={styles.subNavPanel}>
              {[
                { id: 'Account Info', icon: <Icons.User /> },
                { id: 'Privacy & Visibility', icon: <Icons.Eye /> },
                { id: 'Security', icon: <Icons.Shield /> },
                { id: 'Matchmaking Preferences', icon: <Icons.Sliders /> },
                { id: 'Notifications', icon: <Icons.Bell /> },
                { id: 'Membership', icon: <Icons.CreditCard /> }
              ].map(item => (
                <div 
                  key={item.id}
                  className={`${styles.subNavItem} ${activeSubNav === item.id ? styles.subNavActive : styles.subNavInactive}`}
                  onClick={() => setActiveSubNav(item.id)}
                >
                  {item.icon} {item.id}
                </div>
              ))}
            </div>

            {/* Right Content Stack */}
            <div className={styles.contentStack}>
              
              {/* Card 1: Privacy & Visibility */}
              <div className={styles.settingCard}>
                <div className={styles.cardHeaderRow}>
                  <div className={`${styles.iconCircle} ${styles.bgPink}`}><Icons.Eye /></div>
                  <h2 className={styles.cardTitle}>Privacy & Visibility</h2>
                </div>

                <div className={styles.settingRow}>
                  <div className={styles.rowText}>
                    <div className={styles.rowTitle}>Profile Visibility</div>
                    <div className={styles.rowDesc}>Control who can discover your profile in search results.</div>
                  </div>
                  <div className={styles.segmentedControl}>
                    <button 
                      className={`${styles.segmentBtn} ${profileVis === 'Everyone' ? styles.segmentActive : ''}`}
                      onClick={() => setProfileVis('Everyone')}
                    >
                      Everyone
                    </button>
                    <button 
                      className={`${styles.segmentBtn} ${profileVis === 'Only Premium Members' ? styles.segmentActive : ''}`}
                      onClick={() => setProfileVis('Only Premium Members')}
                    >
                      Only Premium Members
                    </button>
                  </div>
                </div>

                <div className={styles.settingRow} style={{flexDirection: 'column', alignItems: 'stretch', borderBottom: 'none'}}>
                  <span className={`${styles.settingSubLabel} ${styles.darkLabel}`}>Photo Privacy</span>
                  <div className={styles.radioCardRow}>
                    
                    <div 
                      className={`${styles.radioCard} ${photoPrivacy === 'Show to all' ? styles.radioSelected : ''}`}
                      onClick={() => setPhotoPrivacy('Show to all')}
                    >
                      <div className={`${styles.radioIndicator} ${photoPrivacy === 'Show to all' ? styles.indicatorFilled : ''}`}></div>
                      <div className={styles.radioIcon}><Icons.Globe /></div>
                      <div className={styles.radioTitle}>Show to all</div>
                      <div className={styles.radioDesc}>Anyone on MilanSetu can view your photos.</div>
                    </div>
                    
                    <div 
                      className={`${styles.radioCard} ${photoPrivacy === 'Accepted interests only' ? styles.radioSelected : ''}`}
                      onClick={() => setPhotoPrivacy('Accepted interests only')}
                    >
                      <div className={`${styles.radioIndicator} ${photoPrivacy === 'Accepted interests only' ? styles.indicatorFilled : ''}`}></div>
                      <div className={styles.radioIcon}><Icons.CheckCircle /></div>
                      <div className={styles.radioTitle}>Accepted interests only</div>
                      <div className={styles.radioDesc}>Only members you approve can view.</div>
                    </div>

                  </div>
                </div>

                <div className={styles.toggleRowSplit}>
                  <div className={styles.toggleItem}>
                    <div className={styles.toggleInfo}>
                      <Icons.Phone /> Hide Phone Number
                    </div>
                    <div 
                      className={`${styles.switch} ${toggles.phone ? styles.switchOn : ''}`}
                      onClick={() => setToggles({...toggles, phone: !toggles.phone})}
                    >
                      <div className={styles.switchKnob}></div>
                    </div>
                  </div>
                  
                  <div className={styles.toggleItem}>
                    <div className={styles.toggleInfo}>
                      <Icons.Mail /> Hide Email
                    </div>
                    <div 
                      className={`${styles.switch} ${toggles.email ? styles.switchOn : ''}`}
                      onClick={() => setToggles({...toggles, email: !toggles.email})}
                    >
                      <div className={styles.switchKnob}></div>
                    </div>
                  </div>
                </div>

                <div className={styles.toggleItem}>
                  <div className={styles.toggleInfo}>
                    <Icons.Globe /> Show online status
                  </div>
                  <div 
                    className={`${styles.switch} ${toggles.onlineStatus ? styles.switchOn : ''}`}
                    onClick={() => setToggles({...toggles, onlineStatus: !toggles.onlineStatus})}
                  >
                    <div className={styles.switchKnob}></div>
                  </div>
                </div>

              </div>

              {/* Card 2: Matchmaking Preferences */}
              <div className={styles.settingCard}>
                <div className={styles.cardHeaderRow}>
                  <div className={`${styles.iconCircle} ${styles.bgGold}`}><Icons.Sliders /></div>
                  <h2 className={styles.cardTitle}>Matchmaking Preferences</h2>
                </div>

                <span className={`${styles.settingSubLabel} ${styles.goldLabel}`}>Who can contact me</span>
                
                <div className={styles.checkboxCardRow}>
                  <div 
                    className={styles.checkboxCard}
                    onClick={() => setMatchPrefs({...matchPrefs, verified: !matchPrefs.verified})}
                  >
                    <div className={`${styles.checkboxSquare} ${matchPrefs.verified ? styles.checkboxChecked : ''}`}>
                      {matchPrefs.verified && <Icons.Check />}
                    </div>
                    <div style={{display: 'flex', alignItems: 'center', gap: '8px', fontSize: '14px', fontWeight: '600'}}>
                      <Icons.Shield /> Verified Profiles only
                    </div>
                  </div>
                  
                  <div 
                    className={styles.checkboxCard}
                    onClick={() => setMatchPrefs({...matchPrefs, photos: !matchPrefs.photos})}
                  >
                    <div className={`${styles.checkboxSquare} ${matchPrefs.photos ? styles.checkboxChecked : ''}`}>
                      {matchPrefs.photos && <Icons.Check />}
                    </div>
                    <div style={{display: 'flex', alignItems: 'center', gap: '8px', fontSize: '14px', fontWeight: '600'}}>
                      <Icons.Camera /> Profiles with photos only
                    </div>
                  </div>
                </div>
              </div>

              {/* Card 3: Account Controls */}
              <div className={styles.settingCard}>
                <div className={styles.topAccent}></div>
                <div className={styles.cardHeaderRow}>
                  <div className={`${styles.iconCircle} ${styles.bgPink}`}><Icons.Settings /></div>
                  <h2 className={styles.cardTitle}>Account Controls</h2>
                </div>

                <div className={styles.accountActionRow}>
                  <button className={styles.btnPrimary}>
                    <Icons.Lock /> Change Password
                  </button>
                  
                  <div className={styles.rightGroup}>
                    <button className={styles.btnGrayOutline}>
                      Deactivate Account
                    </button>
                    <button className={styles.btnRedOutline}>
                      <Icons.Trash /> Delete Profile
                    </button>
                  </div>
                </div>
              </div>

              {/* Footer */}
              <div className={styles.footerText}>
                <span>ShubhMilan Premium — Excellence in Matrimony</span>
                <div className={styles.footerIcons}>
                  <Icons.HelpCircle />
                  <Icons.Mail />
                </div>
              </div>

            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SettingsPage;
