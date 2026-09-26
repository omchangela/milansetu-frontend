import React, { useEffect, useMemo, useState } from 'react';
import styles from '../styles/dashboard_page.module.css';
import Sidebar from '../../components/Sidebar';
import TopBar from '../../components/TopBar';
import { useAuth } from '../../../context/AuthContext';
import { fetchProfiles, fetchSentInterestStats, sendInterest } from '../../../api/auth';
import AuthenticatedImage from '../../../components/AuthenticatedImage';
import {
  calculateProfileCompleteness,
  getMatchScore,
  getProfileAvatar,
} from '../../../utils/profileHelpers';

const PROFILE_VIEWS_KEY = 'ms_profile_views_v1';
const RECEIVED_INTERESTS_KEY = 'ms_received_interests_v1';

// Push a profile view to localStorage
function trackProfileView(match) {
  try {
    const raw = localStorage.getItem(PROFILE_VIEWS_KEY);
    const views = raw ? JSON.parse(raw) : [];
    // Avoid duplicates by removing old entry for same id
    const filtered = views.filter(v => v.viewedId !== match.id);
    filtered.unshift({
      viewedId: match.id,
      name: match.full_name || 'Member',
      avatar: match.img || getProfileAvatar(match),
      role: match.current_designation || match.education || '',
      loc: match.birth_place || '',
      timestamp: new Date().toISOString(),
    });
    localStorage.setItem(PROFILE_VIEWS_KEY, JSON.stringify(filtered.slice(0, 20)));
  } catch {}
}

// Push to received interests for the other user (localStorage simulation)
function simulateReceivedInterest(match, fromUser) {
  try {
    const raw = localStorage.getItem(RECEIVED_INTERESTS_KEY);
    const interests = raw ? JSON.parse(raw) : [];
    const exists = interests.some(i => i.senderId === (fromUser?.id || 'me') && i.receiverId === match.id);
    if (exists) return;
    interests.unshift({
      id: Date.now(),
      senderId: fromUser?.id || 'me',
      receiverId: match.id,
      name: fromUser?.full_name || fromUser?.email || 'Someone',
      age: fromUser?.age || '',
      height: fromUser?.height_cm ? `${fromUser.height_cm} cm` : '',
      role: fromUser?.current_designation || fromUser?.education || 'Professional',
      match: `${match.matchScore || 0}%`,
      premium: false,
      tags: [fromUser?.religion || 'Match'].filter(Boolean),
      message: 'I am interested in connecting with you.',
      status: 'pending',
      timestamp: new Date().toISOString(),
    });
    localStorage.setItem(RECEIVED_INTERESTS_KEY, JSON.stringify(interests));
  } catch {}
}

const Icons = {
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
  Meetings: () => (
    <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" /><circle cx="9" cy="7" r="4" />
      <path d="M23 21v-2a4 4 0 0 0-3-3.87" /><path d="M16 3.13a4 4 0 0 1 0 7.75" />
    </svg>
  ),
  ArrowRight: () => (
    <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2">
      <line x1="5" y1="12" x2="19" y2="12" /><polyline points="12 5 19 12 12 19" />
    </svg>
  ),
  Pencil: () => (
    <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M17 3a2.828 2.828 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5L17 3z" />
    </svg>
  ),
  Eye: () => (
    <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" /><circle cx="12" cy="12" r="3" />
    </svg>
  ),
  Briefcase: () => (
    <svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2">
      <rect x="2" y="7" width="20" height="14" rx="2" ry="2" />
      <path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16" />
    </svg>
  ),
};

const DashboardPage = () => {
  const { user, profile, idealPartner } = useAuth();
  const [matches, setMatches] = useState([]);
  const [sentStats, setSentStats] = useState({ total: 0, accepted: 0, pending: 0, response_rate: 0 });
  const [loadingMatches, setLoadingMatches] = useState(true);
  const [sendingId, setSendingId] = useState(null);
  // Confirmation popup state
  const [confirmMatch, setConfirmMatch] = useState(null); // match object to confirm interest
  const [interestSent, setInterestSent] = useState({}); // map of id -> true after sent

  const displayName = profile?.full_name || user?.email || 'User';
  const profileCompleteness = calculateProfileCompleteness(profile);
  const progressOffset = 282.7 - (282.7 * profileCompleteness) / 100;

  useEffect(() => {
    let active = true;
    setLoadingMatches(true);

    fetchProfiles().then(({ data }) => {
      if (!active) return;
      setMatches(Array.isArray(data) ? data : []);
      setLoadingMatches(false);
    });

    fetchSentInterestStats().then(({ data }) => {
      if (!active || !data) return;
      setSentStats(data);
    });

    return () => { active = false; };
  }, []);

  const topPicks = useMemo(() => {
    return [...matches]
      .map((match) => ({
        ...match,
        matchScore: getMatchScore(match, idealPartner, profile),
        img: getProfileAvatar(match),
      }))
      .sort((a, b) => b.matchScore - a.matchScore)
      .slice(0, 3);
  }, [matches, profile, idealPartner]);

  const analyticsWeeks = useMemo(() => {
    if (topPicks.length === 0) {
      return [
        { label: 'Week 1', h1: 20, h2: 15, h3: 10 },
        { label: 'Week 2', h1: 25, h2: 18, h3: 12 },
        { label: 'Week 3', h1: 30, h2: 22, h3: 15 },
        { label: 'Week 4', h1: 35, h2: 25, h3: 18 },
      ];
    }

    return topPicks.map((pick, index) => ({
      label: `Match ${index + 1}`,
      h1: pick.matchScore,
      h2: Math.max(20, pick.matchScore - 15),
      h3: Math.max(10, pick.matchScore - 30),
    }));
  }, [topPicks]);

  const viewProfile = (match) => {
    trackProfileView(match);
    window.location.hash = `#profile/${match.id}`;
  };

  const openConfirm = (match) => setConfirmMatch(match);
  const closeConfirm = () => setConfirmMatch(null);

  const handleSendInterest = async () => {
    if (!confirmMatch) return;
    const match = confirmMatch;
    closeConfirm();
    setSendingId(match.id);
    const { error } = await sendInterest(match.id);
    if (!error) {
      // Fire global event — App.jsx shows the success toast on every page
      window.dispatchEvent(new CustomEvent('interest:sent', {
        detail: {
          matchId: match.id,
          name: match.full_name || 'this member',
          matchScore: match.matchScore || match.match_score || 0,
        },
      }));
      const { data } = await fetchSentInterestStats();
      if (data) setSentStats(data);
      setInterestSent(prev => ({ ...prev, [match.id]: true }));
    }
    setSendingId(null);
  };

  return (
    <div className={styles.dashboardContainer}>
      <Sidebar activePage="dashboard" />

      <main className={styles.mainContent}>
        <TopBar searchPlaceholder="Search connections..." userName={displayName} />

        <div className={styles.dashboardBody}>
          <section className={styles.heroBanner}>
            <h1 className={styles.heroHeading}>Welcome back, {displayName.split(' ')[0]}!</h1>
            <p className={styles.heroSubtext}>
              {matches.length > 0
                ? `We've found ${matches.length} potential partner${matches.length === 1 ? '' : 's'} that align with your lifestyle and values.`
                : 'Complete your profile to start receiving curated matches tailored to your preferences.'}
            </p>
            <button className={styles.heroCta} onClick={() => { window.location.hash = '#matches'; }}>
              Explore Matches <Icons.ArrowRight />
            </button>
          </section>

          <div className={styles.statsRow}>
            <div className={styles.statCard}>
              <span className={styles.statLabel}>Total Matches</span>
              <span className={styles.statValue}>{matches.length}</span>
              <div className={styles.statIconContainer}><Icons.Profile /></div>
            </div>
            <div className={styles.statCard}>
              <span className={styles.statLabel}>Sent Interests</span>
              <span className={styles.statValue}>{sentStats.total}</span>
              <div className={styles.statIconContainer}><Icons.Sent /></div>
            </div>
            <div className={styles.statCard}>
              <span className={styles.statLabel}>Received</span>
              <span className={styles.statValue}>{sentStats.accepted}</span>
              <div className={styles.statIconContainer}><Icons.Matches /></div>
            </div>
            <div className={styles.statCard}>
              <span className={styles.statLabel}>Pending</span>
              <span className={styles.statValue}>{sentStats.pending}</span>
              <div className={styles.statIconContainer}><Icons.Meetings /></div>
            </div>
          </div>

          <div className={styles.analyticsSection}>
            <div className={styles.analyticsCard}>
              <div className={styles.cardHeader}>
                <div>
                  <h3 className={styles.cardTitle}>Match Success Analytics</h3>
                  <p className={styles.cardSubtitle}>
                    {topPicks.length > 0
                      ? 'Compatibility scores for your top matches'
                      : 'Add partner preferences to unlock match insights'}
                  </p>
                </div>
              </div>
              <div className={styles.chartContainer}>
                {analyticsWeeks.map((week) => (
                  <div key={week.label} className={styles.barWrapper}>
                    <div className={styles.bar}>
                      <div className={`${styles.barSegment} ${styles.segment1}`} style={{ height: `${week.h3}%` }}></div>
                      <div className={`${styles.barSegment} ${styles.segment2}`} style={{ height: `${week.h2}%` }}></div>
                      <div className={`${styles.barSegment} ${styles.segment3}`} style={{ height: `${week.h1}%` }}></div>
                    </div>
                    <span className={styles.barLabel}>{week.label}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className={styles.strengthCard}>
              <h3 className={styles.cardTitle}>Profile Strength</h3>
              <div className={styles.progressContainer}>
                <svg className={styles.progressRing} viewBox="0 0 100 100">
                  <circle cx="50" cy="50" r="45" fill="transparent" stroke="#f2f2f2" strokeWidth="8" />
                  <circle
                    cx="50"
                    cy="50"
                    r="45"
                    fill="transparent"
                    stroke="#B8860B"
                    strokeWidth="8"
                    strokeDasharray="282.7"
                    strokeDashoffset={progressOffset}
                    strokeLinecap="round"
                  />
                </svg>
                <div className={styles.progressText}>
                  <span className={styles.percentValue}>{profileCompleteness}%</span>
                  <span className={styles.percentLabel}>Complete</span>
                </div>
              </div>
              <p className={styles.strengthDesc}>
                {profileCompleteness < 100
                  ? 'Add your professional and partner preference details to reach 100% and unlock high-quality matches.'
                  : 'Your profile is fully complete. You are ready for premium matchmaking.'}
              </p>
              <button className={styles.completeProfileBtn} onClick={() => { window.location.hash = '#profile'; }}>
                <Icons.Pencil /> Complete Profile
              </button>
            </div>
          </div>

          <section className={styles.topPicksSection}>
            <div className={styles.topPicksHeader}>
              <h2 className={styles.sectionTitle}>Top Picks for You</h2>
              <a href="#matches" className={styles.viewAllLink}>View All ›</a>
            </div>

            {loadingMatches && (
              <p className={styles.heroSubtext}>Loading matches…</p>
            )}

            {!loadingMatches && topPicks.length === 0 && (
              <p className={styles.heroSubtext}>
                No matches available yet. As more members join, curated profiles will appear here.
              </p>
            )}

            <div className={styles.profileGrid}>
              {topPicks.map((match) => (
                <div key={match.id} className={styles.profileCard}>
                  <div className={styles.imageSection}>
                    <AuthenticatedImage
                      src={match.img}
                      profile={match}
                      alt={match.full_name || 'Member'}
                      className={styles.profilePhoto}
                    />
                    <div className={styles.imageOverlay}></div>
                    <div className={styles.matchBadge}>
                      <span className={styles.starIcon}>★</span> {match.matchScore}% Match
                    </div>
                    <div className={styles.verifiedTag}>VERIFIED</div>
                  </div>
                  <div className={styles.cardDetails}>
                    <div className={styles.profileNameAge}>
                      {match.full_name || 'Member'}{match.age ? `, ${match.age}` : ''}
                    </div>
                    <div className={styles.profileLocation}>
                      <Icons.Briefcase />
                      {match.current_designation || match.education || 'Professional'}
                      {match.birth_place ? ` • ${match.birth_place}` : ''}
                    </div>
                    <div className={styles.actionRow}>
                      <button
                        className={styles.sendInterestBtn}
                        onClick={() => openConfirm(match)}
                        disabled={sendingId === match.id || interestSent[match.id]}
                      >
                        {interestSent[match.id] ? '✓ Sent' : sendingId === match.id ? 'Sending…' : 'Send Interest'}
                      </button>
                      <button
                        className={styles.viewBtn}
                        onClick={() => viewProfile(match)}
                        title="View profile"
                      >
                        <Icons.Eye />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* Send Interest Confirmation Popup */}
          {confirmMatch && (
            <div style={{
              position: 'fixed', inset: 0, zIndex: 1000,
              background: 'rgba(0,0,0,0.55)', display: 'flex',
              alignItems: 'center', justifyContent: 'center',
              backdropFilter: 'blur(4px)',
            }} onClick={closeConfirm}>
              <div style={{
                background: '#fff', borderRadius: '18px', padding: '32px 28px',
                maxWidth: '400px', width: '90%', boxShadow: '0 20px 60px rgba(0,0,0,0.25)',
                textAlign: 'center',
              }} onClick={e => e.stopPropagation()}>
                <div style={{
                  width: '64px', height: '64px', borderRadius: '50%',
                  background: 'linear-gradient(135deg, #7B1F2E, #c0392b)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  margin: '0 auto 16px', fontSize: '28px',
                }}>💌</div>
                <h3 style={{ margin: '0 0 8px', fontSize: '20px', color: '#1a1a1a' }}>
                  Send Interest?
                </h3>
                <p style={{ color: '#666', fontSize: '14px', marginBottom: '8px' }}>
                  You are about to send an interest request to
                </p>
                <p style={{ color: '#7B1F2E', fontWeight: 700, fontSize: '16px', marginBottom: '4px' }}>
                  {confirmMatch.full_name || 'this member'}
                </p>
                <p style={{ color: '#888', fontSize: '13px', marginBottom: '24px' }}>
                  {confirmMatch.matchScore}% Match
                </p>
                <div style={{ display: 'flex', gap: '12px', justifyContent: 'center' }}>
                  <button
                    onClick={closeConfirm}
                    style={{
                      padding: '10px 24px', borderRadius: '10px',
                      border: '1.5px solid #ddd', background: '#fff',
                      color: '#555', fontSize: '14px', cursor: 'pointer',
                      fontWeight: 600,
                    }}
                  >Cancel</button>
                  <button
                    onClick={handleSendInterest}
                    style={{
                      padding: '10px 24px', borderRadius: '10px',
                      border: 'none', background: 'linear-gradient(135deg, #7B1F2E, #c0392b)',
                      color: '#fff', fontSize: '14px', cursor: 'pointer',
                      fontWeight: 600, boxShadow: '0 4px 15px rgba(123,31,46,0.35)',
                    }}
                  >✓ Confirm &amp; Send</button>
                </div>
              </div>
            </div>
          )}

          <footer className={styles.dashboardFooter}>
            <span>© 2024 ShubhMilan Matrimonial Services. All rights reserved.</span>
            <div className={styles.divider}></div>
            <span>Premium Executive Dashboard v4.2</span>
          </footer>
        </div>
      </main>
    </div>
  );
};

export default DashboardPage;
