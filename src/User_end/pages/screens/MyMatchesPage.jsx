import React, { useState, useEffect, useMemo, useRef } from 'react';
import styles from '../styles/my_matches_page.module.css';
import Sidebar from '../../components/Sidebar';
import TopBar from '../../components/TopBar';
import AuthenticatedImage from '../../../components/AuthenticatedImage';
import { useAuth } from '../../../context/AuthContext';
import { fetchProfiles, fetchSentInterestStats, sendInterest } from '../../../api/auth';
import { getMatchScore, getProfileAvatar } from '../../../utils/profileHelpers';

const PROFILE_VIEWS_KEY = 'ms_profile_views_v1';
const RECEIVED_INTERESTS_KEY = 'ms_received_interests_v1';

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

function trackProfileView(match) {
  try {
    const raw = localStorage.getItem(PROFILE_VIEWS_KEY);
    const views = raw ? JSON.parse(raw) : [];
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

// Icons
const Icons = {
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
  Search: () => (
    <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2">
      <circle cx="11" cy="11" r="8" /><line x1="21" y1="21" x2="16.65" y2="16.65" />
    </svg>
  ),
  Heart: () => (
    <svg viewBox="0 0 24 24" width="24" height="24" fill="currentColor">
      <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
    </svg>
  ),
  Sparkle: () => (
    <svg viewBox="0 0 24 24" width="16" height="16" fill="currentColor">
      <path d="M12 2L14.5 9L21.5 11.5L14.5 14L12 21L9.5 14L2.5 11.5L9.5 9L12 2Z" />
    </svg>
  ),
  Target: () => (
    <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2">
      <circle cx="12" cy="12" r="10" /><circle cx="12" cy="12" r="6" /><circle cx="12" cy="12" r="2" />
    </svg>
  ),
  Check: () => (
    <svg viewBox="0 0 24 24" width="12" height="12" fill="none" stroke="currentColor" strokeWidth="3">
      <polyline points="20 6 9 17 4 12" />
    </svg>
  ),
  ChevronDown: () => (
    <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2">
      <polyline points="6 9 12 15 18 9" />
    </svg>
  ),
  Sliders: () => (
    <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2">
      <line x1="4" y1="21" x2="4" y2="14" /><line x1="4" y1="10" x2="4" y2="3" />
      <line x1="12" y1="21" x2="12" y2="12" /><line x1="12" y1="8" x2="12" y2="3" />
      <line x1="20" y1="21" x2="20" y2="16" /><line x1="20" y1="12" x2="20" y2="3" />
      <line x1="2" y1="14" x2="6" y2="14" /><line x1="10" y1="12" x2="14" y2="12" />
      <line x1="18" y1="16" x2="22" y2="16" />
    </svg>
  ),
  Eye: () => (
    <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" /><circle cx="12" cy="12" r="3" />
    </svg>
  ),
  ChevronLeft: () => (
    <svg viewBox="0 0 24 24" width="24" height="24" fill="none" stroke="currentColor" strokeWidth="2.5">
      <polyline points="15 18 9 12 15 6" />
    </svg>
  ),
  ChevronRight: () => (
    <svg viewBox="0 0 24 24" width="24" height="24" fill="none" stroke="currentColor" strokeWidth="2.5">
      <polyline points="9 18 15 12 9 6" />
    </svg>
  ),
};

// ── Send Interest Confirmation Popup ─────────────────────────────────────────
function InterestConfirmPopup({ match, onConfirm, onCancel }) {
  return (
    <div style={{
      position: 'fixed', inset: 0, zIndex: 1000,
      background: 'rgba(0,0,0,0.55)', display: 'flex',
      alignItems: 'center', justifyContent: 'center',
      backdropFilter: 'blur(4px)',
    }} onClick={onCancel}>
      <div style={{
        background: '#fff', borderRadius: '20px', padding: '36px 28px',
        maxWidth: '420px', width: '90%', boxShadow: '0 24px 70px rgba(0,0,0,0.3)',
        textAlign: 'center', animation: 'popIn 0.25s ease',
      }} onClick={e => e.stopPropagation()}>
        <div style={{
          width: '72px', height: '72px', borderRadius: '50%',
          background: 'linear-gradient(135deg, #7B1F2E, #c0392b)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          margin: '0 auto 18px', fontSize: '32px',
        }}>💌</div>
        <h3 style={{ margin: '0 0 8px', fontSize: '22px', color: '#1a1a1a', fontWeight: 700 }}>
          Send Interest?
        </h3>
        <p style={{ color: '#666', fontSize: '14px', marginBottom: '8px' }}>
          You are about to send an interest request to
        </p>
        <p style={{ color: '#7B1F2E', fontWeight: 700, fontSize: '18px', marginBottom: '4px' }}>
          {match.full_name || 'this member'}
        </p>
        {match.matchScore > 0 && (
          <p style={{ color: '#888', fontSize: '13px', marginBottom: '24px' }}>
            ✨ {match.matchScore}% Compatibility Match
          </p>
        )}
        <div style={{ display: 'flex', gap: '12px', justifyContent: 'center' }}>
          <button
            onClick={onCancel}
            style={{
              padding: '11px 26px', borderRadius: '12px',
              border: '1.5px solid #ddd', background: '#fff',
              color: '#555', fontSize: '14px', cursor: 'pointer', fontWeight: 600,
              transition: 'border-color 0.2s',
            }}
          >Cancel</button>
          <button
            onClick={onConfirm}
            style={{
              padding: '11px 26px', borderRadius: '12px',
              border: 'none', background: 'linear-gradient(135deg, #7B1F2E, #c0392b)',
              color: '#fff', fontSize: '14px', cursor: 'pointer',
              fontWeight: 700, boxShadow: '0 4px 18px rgba(123,31,46,0.4)',
              transition: 'transform 0.15s',
            }}
          >✓ Confirm & Send</button>
        </div>
      </div>
    </div>
  );
}

const MyMatchesPage = () => {
  const { user, profile, idealPartner } = useAuth();
  const [activeTab, setActiveTab] = useState('Highly Recommended');
  const [matches, setMatches] = useState([]);
  const [loading, setLoading] = useState(true);
  const [sentStats, setSentStats] = useState({});
  const [sendingId, setSendingId] = useState(null);
  const [interestSent, setInterestSent] = useState({});
  const [confirmMatch, setConfirmMatch] = useState(null);
  const [featuredIndex, setFeaturedIndex] = useState(0);
  const [recentViews, setRecentViews] = useState([]);

  // Swipe state
  const [swipeX, setSwipeX] = useState(0);
  const [swiping, setSwiping] = useState(false);
  const [swipeStart, setSwipeStart] = useState(null);
  const [swipeDirection, setSwipeDirection] = useState(null); // 'left'|'right'|null
  const swipeRef = useRef(null);

  // Load matches from API
  useEffect(() => {
    let active = true;
    setLoading(true);
    fetchProfiles().then(({ data }) => {
      if (!active) return;
      const profiles = Array.isArray(data) ? data : [];
      const scored = profiles.map(p => ({
        ...p,
        matchScore: p.match_score || getMatchScore(p, idealPartner, profile),
        img: getProfileAvatar(p),
      })).sort((a, b) => b.matchScore - a.matchScore);
      setMatches(scored);
      setLoading(false);
    });
    fetchSentInterestStats().then(({ data }) => {
      if (!active || !data) return;
      setSentStats(data);
    });
    return () => { active = false; };
  }, []);

  // Load recent views from localStorage
  useEffect(() => {
    const loadViews = () => {
      try {
        const raw = localStorage.getItem(PROFILE_VIEWS_KEY);
        setRecentViews(raw ? JSON.parse(raw) : []);
      } catch { setRecentViews([]); }
    };
    loadViews();
    // Refresh when storage changes (e.g., from dashboard tab)
    window.addEventListener('storage', loadViews);
    return () => window.removeEventListener('storage', loadViews);
  }, []);

  const topPicks = useMemo(() => matches.slice(0, 10), [matches]);
  const featuredMatch = topPicks[featuredIndex] || null;

  const handleViewProfile = (match) => {
    trackProfileView(match);
    setRecentViews(prev => {
      const filtered = prev.filter(v => v.viewedId !== match.id);
      const entry = {
        viewedId: match.id,
        name: match.full_name || 'Member',
        avatar: match.img,
        role: match.current_designation || match.education || '',
        loc: match.birth_place || '',
        timestamp: new Date().toISOString(),
      };
      return [entry, ...filtered].slice(0, 20);
    });
    window.location.hash = `#profile/${match.id}`;
  };

  const handleConfirmInterest = async () => {
    if (!confirmMatch) return;
    const match = confirmMatch;
    setConfirmMatch(null);
    setSendingId(match.id);
    const { error } = await sendInterest(match.id);
    if (!error) {
      // Fire global event — App.jsx shows the success toast on every page
      window.dispatchEvent(new CustomEvent('interest:sent', {
        detail: {
          matchId: match.id,
          name: match.full_name || 'this member',
          matchScore: match.matchScore || 0,
        },
      }));
      const { data } = await fetchSentInterestStats();
      if (data) setSentStats(data);
      setInterestSent(prev => ({ ...prev, [match.id]: true }));
    }
    setSendingId(null);
  };

  // ── Swipe handlers ────────────────────────────────────────────────────────
  const SWIPE_THRESHOLD = 80;

  const onSwipeStart = (clientX) => {
    setSwiping(true);
    setSwipeStart(clientX);
    setSwipeX(0);
    setSwipeDirection(null);
  };

  const onSwipeMove = (clientX) => {
    if (!swiping) return;
    const dx = clientX - swipeStart;
    setSwipeX(dx);
    if (dx > 30) setSwipeDirection('right');
    else if (dx < -30) setSwipeDirection('left');
    else setSwipeDirection(null);
  };

  const onSwipeEnd = () => {
    if (!swiping) return;
    setSwiping(false);
    if (swipeX > SWIPE_THRESHOLD && featuredMatch) {
      // Swipe right → Send Interest
      setConfirmMatch(featuredMatch);
    } else if (swipeX < -SWIPE_THRESHOLD) {
      // Swipe left → next profile
      setFeaturedIndex(i => (i + 1) % Math.max(1, topPicks.length));
    }
    setSwipeX(0);
    setSwipeDirection(null);
  };

  // Mouse events
  const handleMouseDown = (e) => onSwipeStart(e.clientX);
  const handleMouseMove = (e) => { if (swiping) onSwipeMove(e.clientX); };
  const handleMouseUp = () => onSwipeEnd();

  // Touch events
  const handleTouchStart = (e) => onSwipeStart(e.touches[0].clientX);
  const handleTouchMove = (e) => onSwipeMove(e.touches[0].clientX);
  const handleTouchEnd = () => onSwipeEnd();

  return (
    <div className={styles.container}>
      <Sidebar activePage="matches" />

      <main className={styles.mainContent}>
        <TopBar searchPlaceholder="Search matches..." />

        <div className={styles.pageBody}>
          {/* Page Header */}
          <section className={styles.pageHeader}>
            <div className={styles.headerIcon}>
              <Icons.Heart />
            </div>
            <div className={styles.headerText}>
              <h1 className={styles.pageTitle}>My Matches</h1>
              <p className={styles.pageSubtext}>
                Discover curated profiles selected by our elite matchmaking algorithm based on your lifestyle, values, and professional trajectory.
              </p>
            </div>
          </section>

          {/* Featured Match — Swipeable */}
          {loading ? (
            <section className={styles.featuredCard} style={{ padding: '40px', textAlign: 'center', color: '#999' }}>
              <p>Loading matches…</p>
            </section>
          ) : featuredMatch ? (
            <section
              ref={swipeRef}
              className={styles.featuredCard}
              style={{
                transform: swiping ? `translateX(${swipeX * 0.4}px) rotate(${swipeX * 0.02}deg)` : 'none',
                transition: swiping ? 'none' : 'transform 0.35s cubic-bezier(0.25, 0.46, 0.45, 0.94)',
                cursor: swiping ? 'grabbing' : 'grab',
                userSelect: 'none',
                position: 'relative',
                overflow: 'hidden',
              }}
              onMouseDown={handleMouseDown}
              onMouseMove={handleMouseMove}
              onMouseUp={handleMouseUp}
              onMouseLeave={handleMouseUp}
              onTouchStart={handleTouchStart}
              onTouchMove={handleTouchMove}
              onTouchEnd={handleTouchEnd}
            >
              {/* Swipe direction overlay */}
              {swipeDirection === 'right' && (
                <div style={{
                  position: 'absolute', inset: 0, zIndex: 10,
                  background: 'rgba(34, 197, 94, 0.25)',
                  display: 'flex', alignItems: 'center', justifyContent: 'flex-start',
                  paddingLeft: '24px', pointerEvents: 'none',
                  borderRadius: 'inherit',
                }}>
                  <span style={{
                    fontSize: '32px', fontWeight: 800, color: '#16a34a',
                    border: '3px solid #16a34a', borderRadius: '12px',
                    padding: '4px 14px', background: 'rgba(255,255,255,0.85)',
                  }}>💌 INTEREST</span>
                </div>
              )}
              {swipeDirection === 'left' && (
                <div style={{
                  position: 'absolute', inset: 0, zIndex: 10,
                  background: 'rgba(239, 68, 68, 0.25)',
                  display: 'flex', alignItems: 'center', justifyContent: 'flex-end',
                  paddingRight: '24px', pointerEvents: 'none',
                  borderRadius: 'inherit',
                }}>
                  <span style={{
                    fontSize: '32px', fontWeight: 800, color: '#dc2626',
                    border: '3px solid #dc2626', borderRadius: '12px',
                    padding: '4px 14px', background: 'rgba(255,255,255,0.85)',
                  }}>SKIP ⏭</span>
                </div>
              )}

              <AuthenticatedImage
                src={featuredMatch.img}
                profile={featuredMatch}
                alt={featuredMatch.full_name || ''}
                className={styles.featuredPhoto}
              />
              <div className={styles.featuredContent}>
                <div className={styles.compatibilityBadge}>
                  <span className={styles.scoreValue}>{featuredMatch.matchScore}%</span>
                  <span className={styles.scoreLabel}>COMPATIBILITY SCORE</span>
                </div>
                <div className={styles.perfectMatchBadge}>
                  <Icons.Sparkle /> Perfect Match
                </div>
                <h2 className={styles.featuredName}>
                  {featuredMatch.full_name || 'Member'}{featuredMatch.age ? `, ${featuredMatch.age}` : ''}
                </h2>
                <p className={styles.featuredSub}>
                  {featuredMatch.current_designation || featuredMatch.education || 'Professional'}
                  {featuredMatch.current_company ? ` at ${featuredMatch.current_company}` : ''}
                  {featuredMatch.birth_place ? ` • ${featuredMatch.birth_place}` : ''}
                </p>

                <div className={styles.chipRow}>
                  <div className={styles.infoChip}>
                    <div className={styles.chipLabel}>VALUES</div>
                    <div className={styles.chipValue}>{featuredMatch.family_values || 'Traditional'}</div>
                  </div>
                  <div className={styles.infoChip}>
                    <div className={styles.chipLabel}>LOCATION</div>
                    <div className={styles.chipValue}>{featuredMatch.birth_place || 'India'}</div>
                  </div>
                </div>

                {/* Swipe hint */}
                <div style={{
                  display: 'flex', alignItems: 'center', gap: '12px',
                  margin: '10px 0 6px', opacity: 0.7, fontSize: '12px', color: '#ccc',
                }}>
                  <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                    <Icons.ChevronLeft /> Skip
                  </span>
                  <span style={{ flex: 1, textAlign: 'center' }}>← Swipe →</span>
                  <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                    Interest <Icons.ChevronRight />
                  </span>
                </div>

                <div className={styles.featuredActions}>
                  <button
                    className={styles.outlineBtn}
                    onClick={() => handleViewProfile(featuredMatch)}
                  >
                    View Full Profile
                  </button>
                  <button
                    className={styles.filledBtn}
                    onClick={() => setConfirmMatch(featuredMatch)}
                    disabled={interestSent[featuredMatch.id] || sendingId === featuredMatch.id}
                  >
                    {interestSent[featuredMatch.id] ? '✓ Sent' : 'Send Interest'}
                  </button>
                </div>
              </div>

              {/* Navigation arrows */}
              {topPicks.length > 1 && (
                <>
                  <button
                    onClick={() => setFeaturedIndex(i => (i - 1 + topPicks.length) % topPicks.length)}
                    style={{
                      position: 'absolute', left: '12px', top: '50%',
                      transform: 'translateY(-50%)', zIndex: 20,
                      background: 'rgba(255,255,255,0.2)', border: 'none',
                      borderRadius: '50%', width: '40px', height: '40px',
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                      cursor: 'pointer', backdropFilter: 'blur(4px)', color: '#fff',
                    }}
                  ><Icons.ChevronLeft /></button>
                  <button
                    onClick={() => setFeaturedIndex(i => (i + 1) % topPicks.length)}
                    style={{
                      position: 'absolute', right: '12px', top: '50%',
                      transform: 'translateY(-50%)', zIndex: 20,
                      background: 'rgba(255,255,255,0.2)', border: 'none',
                      borderRadius: '50%', width: '40px', height: '40px',
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                      cursor: 'pointer', backdropFilter: 'blur(4px)', color: '#fff',
                    }}
                  ><Icons.ChevronRight /></button>
                </>
              )}
            </section>
          ) : (
            <section className={styles.featuredCard} style={{ padding: '40px', textAlign: 'center', color: '#999' }}>
              <p>No featured matches available yet. Browse profiles to get started!</p>
            </section>
          )}

          {/* Grid Layout */}
          <div className={styles.contentGrid}>
            <div className={styles.mainColumn}>
              {/* Filter Bar */}
              <div className={styles.filterBar}>
                <div className={styles.tabs}>
                  {['Highly Recommended', 'New Matches', 'Online Now'].map(tab => (
                    <div
                      key={tab}
                      className={`${styles.tab} ${activeTab === tab ? styles.activeTab : ''}`}
                      onClick={() => setActiveTab(tab)}
                    >
                      {tab}
                    </div>
                  ))}
                </div>
                <div className={styles.filtersRow}>
                  <div className={styles.filterDropdown}>
                    <span>Religion</span> <Icons.ChevronDown />
                  </div>
                  <div className={styles.filterDropdown}>
                    <span>Community</span> <Icons.ChevronDown />
                  </div>
                  <div className={styles.filterDropdown}>
                    <span>Location</span> <Icons.ChevronDown />
                  </div>
                  <div className={styles.moreFilters}><Icons.Sliders /> More Filters</div>
                </div>
              </div>

              {/* Match Count */}
              <div className={styles.matchCount}>
                Showing <strong>{matches.length}</strong> matches for <strong>{activeTab}</strong>
              </div>

              {/* Match Grid */}
              <div className={styles.matchGrid}>
                {loading ? (
                  <div style={{ gridColumn: '1 / -1', padding: '40px 20px', textAlign: 'center', color: '#888' }}>
                    <p>Loading matches…</p>
                  </div>
                ) : matches.length === 0 ? (
                  <div style={{ gridColumn: '1 / -1', padding: '40px 20px', textAlign: 'center', color: '#888' }}>
                    <p>No matches available yet. Check back soon!</p>
                  </div>
                ) : (
                  matches.map((match) => (
                    <div key={match.id} className={styles.matchCard}>
                      <div className={styles.cardImageWrapper}>
                        <AuthenticatedImage
                          src={match.img}
                          profile={match}
                          alt={match.full_name || 'Member'}
                          className={styles.cardImage}
                        />
                        <div className={styles.imageGradient}></div>
                        <div className={styles.verifiedBadge}>
                          <span className={styles.checkIcon}><Icons.Check /></span> VERIFIED
                        </div>
                        <div className={styles.matchPercentBadge}>{match.matchScore}%</div>
                        <div className={styles.imageOverlayActions}>
                          <button
                            className={styles.overlayBtn}
                            title="Send Interest"
                            onClick={() => setConfirmMatch(match)}
                          >♡</button>
                          <button
                            className={styles.overlayBtn}
                            title="View Profile"
                            onClick={() => handleViewProfile(match)}
                          ><Icons.Eye /></button>
                        </div>
                      </div>
                      <div className={styles.cardBody}>
                        <div className={styles.cardTopRow}>
                          <h3 className={styles.matchNameAge}>
                            {match.full_name || 'Member'}{match.age ? `, ${match.age}` : ''}
                          </h3>
                        </div>
                        <p className={styles.matchSubtitle}>
                          <span className={styles.roleIcon}>💼</span>{' '}
                          {match.current_designation || match.education || 'Professional'}
                          {match.birth_place ? ` • ${match.birth_place}` : ''}
                        </p>
                        <div className={styles.tagRow}>
                          {[match.religion, match.family_values, match.industry].filter(Boolean).slice(0, 2).map(tag => (
                            <span key={tag} className={styles.tag}>{tag}</span>
                          ))}
                        </div>
                        <div className={styles.cardActions}>
                          <button
                            className={styles.smallOutlineBtn}
                            onClick={() => handleViewProfile(match)}
                          >View Profile</button>
                          <button
                            className={styles.smallFilledBtn}
                            onClick={() => setConfirmMatch(match)}
                            disabled={interestSent[match.id] || sendingId === match.id}
                          >
                            {interestSent[match.id] ? '✓ Sent' : 'Send Interest'}
                          </button>
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>

            <aside className={styles.sidebarCards}>
              {/* Matching Intelligence */}
              <div className={styles.card}>
                <div className={styles.cardHeader}>
                  <h3 className={styles.cardTitle}>Matching Intelligence</h3>
                  <div className={styles.cardIcon}><Icons.Target /></div>
                </div>
                <div className={styles.metricsList}>
                  {[
                    { label: 'Lifestyle Compatibility', value: sentStats.response_rate ? `${Math.min(100, sentStats.response_rate + 62)}%` : '92%' },
                    { label: 'Values & Ethics', value: '88%' },
                    { label: 'Career Trajectory', value: '95%' }
                  ].map(metric => (
                    <div key={metric.label} className={styles.metricItem}>
                      <div className={styles.metricLabelRow}>
                        <span className={styles.metricLabel}>{metric.label}</span>
                        <span className={styles.metricValue}>{metric.value}</span>
                      </div>
                      <div className={styles.progressBar}>
                        <div className={styles.progressFill} style={{ width: metric.value }}></div>
                      </div>
                    </div>
                  ))}
                </div>
                <div className={styles.highlightPanel}>
                  <div className={styles.aPlusBadge}>A+</div>
                  <p className={styles.panelText}>Your match quality is in the top 5% of all users this month.</p>
                </div>
              </div>

              {/* Recent Views */}
              <div className={styles.card}>
                <div className={styles.cardHeader}>
                  <h3 className={styles.cardTitle}>RECENT VIEWS</h3>
                </div>
                <div className={styles.recentViewsList}>
                  {recentViews.length === 0 ? (
                    <div style={{ padding: '20px', textAlign: 'center', color: '#999' }}>
                      <p>No recent views yet.<br />Browse profiles to see them here.</p>
                    </div>
                  ) : (
                    recentViews.slice(0, 5).map((view, i) => (
                      <div
                        key={i}
                        className={styles.recentItem}
                        style={{ cursor: 'pointer' }}
                        onClick={() => { window.location.hash = `#profile/${view.viewedId}`; }}
                      >
                        <AuthenticatedImage
                          src={view.avatar}
                          alt={view.name}
                          className={styles.recentAvatar}
                        />
                        <div className={styles.recentInfo}>
                          <div className={styles.recentName}>{view.name}</div>
                          <div className={styles.recentAction}>Viewed your profile</div>
                        </div>
                        <div className={styles.recentTime}>{getRelativeTime(view.timestamp)}</div>
                      </div>
                    ))
                  )}
                </div>
                <div className={styles.decorativeIcons}>
                  <div className={styles.sparkleIcon}><Icons.Sparkle /></div>
                  <div className={styles.floatingHeart}><Icons.Heart /></div>
                </div>
              </div>
            </aside>
          </div>
        </div>
      </main>

      {/* Send Interest Confirmation Popup */}
      {confirmMatch && (
        <InterestConfirmPopup
          match={confirmMatch}
          onConfirm={handleConfirmInterest}
          onCancel={() => setConfirmMatch(null)}
        />
      )}
    </div>
  );
};
export default MyMatchesPage;
