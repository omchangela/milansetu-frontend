import React, { useState } from 'react';
import styles from '../styles/notifications_page.module.css';
import Sidebar from '../../components/Sidebar';
import TopBar from '../../components/TopBar';
import { fetchReceivedInterests } from '../../../api/auth';


// dynamic avatars
import AuthenticatedImage from '../../../components/AuthenticatedImage';

// Icons
const Icons = {
  Search: () => (
    <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2">
      <circle cx="11" cy="11" r="8" /><line x1="21" y1="21" x2="16.65" y2="16.65" />
    </svg>
  ),
  Heart: () => (
    <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l8.84-8.84 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
    </svg>
  ),
  HeartSolid: () => (
    <svg viewBox="0 0 24 24" width="20" height="20" fill="currentColor">
      <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
    </svg>
  ),
  Calendar: () => (
    <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2">
      <rect x="3" y="4" width="18" height="18" rx="2" ry="2" /><line x1="16" y1="2" x2="16" y2="6" /><line x1="8" y1="2" x2="8" y2="6" /><line x1="3" y1="10" x2="21" y2="10" />
    </svg>
  ),
  Video: () => (
    <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2">
      <polygon points="23 7 16 12 23 17 23 7" /><rect x="1" y="5" width="15" height="14" rx="2" ry="2" />
    </svg>
  ),
  Sparkle: () => (
    <svg viewBox="0 0 24 24" width="20" height="20" fill="currentColor">
      <path d="M12 2L14.5 9L21.5 11.5L14.5 14L12 21L9.5 14L2.5 11.5L9.5 9L12 2Z" />
    </svg>
  ),
  ShieldCheck: () => (
    <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" /><polyline points="9 12 11 14 15 10" />
    </svg>
  ),
  Crown: () => (
    <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2">
      <polygon points="12 2 15 8 22 9 17 14 18 21 12 17 6 21 7 14 2 9 9 8 12 2" />
    </svg>
  ),
  Logout: () => (
    <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" /><polyline points="16 17 21 12 16 7" /><line x1="21" y1="12" x2="9" y2="12" />
    </svg>
  ),
  ArrowRight: () => (
    <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2">
      <line x1="5" y1="12" x2="19" y2="12" /><polyline points="12 5 19 12 12 19" />
    </svg>
  )
};

const REC_INTERESTS_KEY = 'ms_received_interests_v1';

function getRelativeTime(iso) {
  if (!iso) return '';
  const diff = Date.now() - new Date(iso).getTime();
  const mins = Math.floor(diff / 60000);
  if (mins < 1) return 'Just now';
  if (mins < 60) return `${mins}m ago`;
  const hrs = Math.floor(mins / 60);
  if (hrs < 24) return `${hrs}h ago`;
  return `${Math.floor(hrs / 24)}d ago`;
}

const NotificationsPage = () => {
  const [activeFilter, setActiveFilter] = useState('All');
  const [receivedInterests, setReceivedInterests] = useState([]);
  const [loading, setLoading] = useState(true);

  // Load received interests from backend
  React.useEffect(() => {
    const load = async () => {
      setLoading(true);
      const { data } = await fetchReceivedInterests();
      if (Array.isArray(data)) {
        // Map the backend data to match notification cards layout
        const mapped = data.map(item => {
          const sender = item.sender_profile || {};
          return {
            id: item.id,
            senderId: item.sender_id,
            name: item.sender_name || sender.full_name || 'Member',
            age: sender.age || '',
            role: sender.current_designation || sender.education || 'Professional',
            match: item.match_score ? `${item.match_score}%` : '0%',
            created_at: item.created_at,
            message: item.message,
            status: item.status,
          };
        });
        setReceivedInterests(mapped);
      } else {
        setReceivedInterests([]);
      }
      setLoading(false);
    };

    load();
    window.addEventListener('interest:sent', load);
    return () => {
      window.removeEventListener('interest:sent', load);
    };
  }, []);


  const showInterests = activeFilter === 'All' || activeFilter === 'Interests';

  return (
    <div className={styles.container}>
      <Sidebar 
        activePage="notifications" 
      />

      <div className={styles.mainLayout}>
        {/* Top Navbar */}
        <TopBar searchPlaceholder="Search notifications..." />

        {/* Content Body */}
        <div className={styles.pageBody}>
          
          {/* Center Column: Feed */}
          <div className={styles.centerColumn}>
            <div className={styles.titleArea}>
              <h1 className={styles.pageTitle}>Your Matrimonial Feed</h1>
              <div className={styles.pageSubtitle}>Stay updated with your latest matches, interests, and profile activities.</div>
            </div>

            {/* Filter Pills */}
            <div className={styles.filterRow}>
              {['All', 'Interests', 'Meetings', 'Profile Updates'].map(filter => (
                <button 
                  key={filter}
                  className={`${styles.filterPill} ${activeFilter === filter ? styles.filterActive : styles.filterInactive}`}
                  onClick={() => setActiveFilter(filter)}
                >
                  {filter}
                </button>
              ))}
            </div>

            {/* Feed List */}
            <div className={styles.feedList}>
              
            {loading && (
              <div style={{ padding: '40px 20px', textAlign: 'center', color: '#999' }}>
                Loading notifications…
              </div>
            )}

            {!loading && showInterests && receivedInterests.length > 0 && receivedInterests.map((interest) => (
              <div key={interest.id} className={styles.notifCard} style={{ borderLeft: '3px solid #c0392b' }}>
                <div className={`${styles.iconCircle} ${styles.bgPink}`}><Icons.HeartSolid /></div>
                <div className={styles.notifContent}>
                  <div className={styles.notifHeaderRow}>
                    <div className={styles.notifTitle}>
                      {interest.name} sent you an Interest Request
                    </div>
                    <div className={styles.timestamp}>{getRelativeTime(interest.created_at)}</div>
                  </div>
                  <div className={styles.notifDesc}>
                    {interest.name}{interest.age ? ` (${interest.age} Yrs` : ''}{interest.role ? `, ${interest.role})` : ')'}  matches your preferences by {interest.match}. They would like to connect.
                  </div>
                  <div className={styles.actionRow}>
                    <button className={styles.btnPrimary} onClick={() => { window.location.hash = '#received'; }}>View Request</button>
                    <button className={styles.btnOutline} onClick={() => { window.location.hash = '#matches'; }}>Browse Profiles</button>
                  </div>
                </div>
              </div>
            ))}

            {!loading && receivedInterests.length === 0 && showInterests && (
              <div style={{ padding: '40px 20px', textAlign: 'center', color: '#999' }}>
                No interest notifications yet.
              </div>
            )}


            </div>
          </div>

          {/* Right Sidebar */}
          <div className={styles.rightSidebar}>
            
            {/* Security Status Card */}
            <div className={styles.securityCard}>
              <div className={styles.secLabelRow}>
                <Icons.ShieldCheck />
                <span className={styles.secLabel}>SECURITY STATUS</span>
              </div>
              <h2 className={styles.secScoreHeading}>Profile Trust Score</h2>
              
              <div className={styles.progressBarTrack}>
                <div className={styles.progressBarFill}></div>
              </div>
              
              <p className={styles.secQuote}>
                "A higher trust score leads to 3x more accepted interests."
              </p>
              
              <button className={styles.secBtn}>Complete Verification</button>
            </div>

          </div>

        </div>
      </div>
    </div>
  );
};

export default NotificationsPage;
