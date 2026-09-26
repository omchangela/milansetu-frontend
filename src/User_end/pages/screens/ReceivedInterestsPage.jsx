import React, { useState, useEffect, useCallback } from 'react';
import styles from '../styles/received_interests_page.module.css';
import Sidebar from '../../components/Sidebar';
import TopBar from '../../components/TopBar';
import AuthenticatedImage from '../../../components/AuthenticatedImage';
import { fetchReceivedInterests, withdrawInterest } from '../../../api/auth';
import { getProfileAvatar } from '../../../utils/profileHelpers';

// Icons
const Icons = {
  Mail: () => (
    <svg viewBox="0 0 24 24" width="24" height="24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
      <polyline points="22,6 12,13 2,6" />
    </svg>
  ),
  Clock: () => (
    <svg viewBox="0 0 24 24" width="24" height="24" fill="none" stroke="currentColor" strokeWidth="2">
      <circle cx="12" cy="12" r="10" /><polyline points="12 6 12 12 16 14" />
    </svg>
  ),
  CheckCircle: () => (
    <svg viewBox="0 0 24 24" width="24" height="24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" /><polyline points="22 4 12 14.01 9 11.01" />
    </svg>
  ),
  Verified: () => (
    <svg viewBox="0 0 24 24" width="16" height="16" fill="currentColor">
      <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z" />
    </svg>
  ),
  Lightning: () => (
    <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2">
      <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2" />
    </svg>
  ),
  Lock: () => (
    <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2">
      <rect x="3" y="11" width="18" height="11" rx="2" ry="2" /><path d="M7 11V7a5 5 0 0 1 10 0v4" />
    </svg>
  ),
};

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

const ReceivedInterestsPage = () => {
  const [interests, setInterests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(null);

  const loadInterests = useCallback(async () => {
    setLoading(true);
    const { data } = await fetchReceivedInterests();
    setInterests(Array.isArray(data) ? data : []);
    setLoading(false);
  }, []);

  useEffect(() => {
    loadInterests();
    // Re-fetch when a new interest is sent (dispatched by MyMatchesPage)
    const onNewInterest = () => loadInterests();
    window.addEventListener('interest:sent', onNewInterest);
    return () => window.removeEventListener('interest:sent', onNewInterest);
  }, [loadInterests]);

  const handleAccept = async (id) => {
    setActionLoading(id + '_accept');
    const token = localStorage.getItem('access_token');
    await fetch('/api/milansetu/interests/received/', {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ interest_id: id, action: 'accept' }),
    }).catch(() => {});
    setInterests(prev => prev.map(i => i.id === id ? { ...i, status: 'accepted' } : i));
    setActionLoading(null);
  };

  const handleDecline = async (id) => {
    setActionLoading(id + '_decline');
    const token = localStorage.getItem('access_token');
    await fetch('/api/milansetu/interests/received/', {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ interest_id: id, action: 'decline' }),
    }).catch(() => {});
    setInterests(prev => prev.map(i => i.id === id ? { ...i, status: 'declined' } : i));
    setActionLoading(null);
  };

  const pending = interests.filter(i => i.status === 'pending').length;
  const accepted = interests.filter(i => i.status === 'accepted').length;

  return (
    <div className={styles.container}>
      <Sidebar activePage="received" />

      <div className={styles.mainLayout}>
        <TopBar searchPlaceholder="Search profiles..." />

        <div className={styles.pageBody}>
          <div className={styles.centerColumn}>
            <div className={styles.titleArea}>
              <h1 className={styles.pageTitle}>Received Interests</h1>
              <div className={styles.pageSubtitle}>
                Review and respond to members who have expressed interest in your profile.
              </div>
            </div>

            {/* Stats Row */}
            <div className={styles.statsRow}>
              <div className={styles.statCard}>
                <div className={`${styles.statIconCircle} ${styles.bgPink}`}><Icons.Mail /></div>
                <div className={styles.statNumber}>{interests.length}</div>
                <div className={styles.statLabel}>Total Received</div>
              </div>
              <div className={styles.statCard}>
                <div className={`${styles.statIconCircle} ${styles.bgGold}`}><Icons.Clock /></div>
                <div className={styles.statNumber}>{pending}</div>
                <div className={styles.statLabel}>Pending Reply</div>
              </div>
              <div className={styles.statCard}>
                <div className={`${styles.statIconCircle} ${styles.bgGreen}`}><Icons.CheckCircle /></div>
                <div className={styles.statNumber}>{accepted}</div>
                <div className={styles.statLabel}>Accepted</div>
              </div>
            </div>

            {/* Interest Cards */}
            <div className={styles.cardList}>
              {loading && (
                <div style={{ padding: '40px 20px', textAlign: 'center', color: '#999' }}>
                  Loading received interests…
                </div>
              )}
              {!loading && interests.length === 0 && (
                <div style={{ padding: '40px 20px', textAlign: 'center', color: '#999' }}>
                  <p>No interests received yet. Share your profile to get more matches!</p>
                </div>
              )}
              {!loading && interests.map((interest) => {
                const sender = interest.sender_profile;
                const name = interest.sender_name || sender?.full_name || 'Member';
                const age = sender?.age;
                const height = sender?.height_cm ? `${sender.height_cm} cm` : null;
                const role = sender?.current_designation || sender?.education || 'Professional';
                const img = getProfileAvatar(sender);
                const matchScore = interest.match_score;
                const tags = [sender?.religion, sender?.mother_tongue].filter(Boolean);

                return (
                  <div key={interest.id} className={styles.interestCard}>
                    <div className={styles.photoSection}>
                      <AuthenticatedImage
                        src={img}
                        profile={sender}
                        alt={name}
                        className={styles.matchPhoto}
                      />
                      {matchScore > 0 && (
                        <div className={styles.matchPercentPill}>{matchScore}% MATCH</div>
                      )}
                    </div>
                    <div className={styles.cardDetails}>
                      <div className={styles.cardHeaderRow}>
                        <div>
                          <div className={styles.matchName}>
                            {name}{age ? `, ${age}` : ''}
                            <span className={styles.verifiedIcon}><Icons.Verified /></span>
                          </div>
                          <div className={styles.matchSubtext}>
                            {[age ? `${age} Yrs` : null, height, role].filter(Boolean).join(' • ')}
                          </div>
                        </div>
                        <div style={{ fontSize: '12px', color: '#999' }}>
                          {getRelativeTime(interest.created_at)}
                        </div>
                      </div>

                      {tags.length > 0 && (
                        <div className={styles.tagRow}>
                          {tags.map((tag, idx) => (
                            <span key={idx} className={styles.tagPill}>{tag}</span>
                          ))}
                        </div>
                      )}

                      {interest.message && (
                        <div className={styles.messageBox}>"{interest.message}"</div>
                      )}

                      <div className={styles.actionRow}>
                        {interest.status === 'pending' && (
                          <>
                            <button
                              className={styles.acceptBtn}
                              onClick={() => handleAccept(interest.id)}
                              disabled={actionLoading === interest.id + '_accept'}
                            >
                              {actionLoading === interest.id + '_accept' ? 'Accepting…' : 'Accept Interest'}
                            </button>
                            <button
                              className={styles.declineBtn}
                              onClick={() => handleDecline(interest.id)}
                              disabled={actionLoading === interest.id + '_decline'}
                            >
                              {actionLoading === interest.id + '_decline' ? 'Declining…' : 'Decline'}
                            </button>
                          </>
                        )}
                        {interest.status === 'accepted' && (
                          <button className={styles.acceptBtn} disabled style={{ background: '#4caf50', cursor: 'default' }}>
                            ✓ Accepted
                          </button>
                        )}
                        {interest.status === 'declined' && (
                          <button className={styles.declineBtn} disabled style={{ opacity: 0.5, cursor: 'default' }}>
                            Declined
                          </button>
                        )}
                        <a
                          href={`#profile/${interest.sender_id}`}
                          className={styles.viewProfileLink}
                        >
                          View Full Profile
                        </a>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Right Sidebar */}
          <div className={styles.rightSidebar}>
            {/* Engagement Tips */}
            <div className={styles.widgetCard}>
              <div className={styles.widgetLabel}>TIPS TO GET MORE RESPONSES</div>
              <div className={styles.tipsList}>
                <div className={styles.tipRow}>
                  <div className={styles.tipIcon}><Icons.Lightning /></div>
                  <div className={styles.tipText}>Respond within 24 hours to boost your profile visibility by 2x.</div>
                </div>
                <div className={styles.tipRow}>
                  <div className={styles.tipIcon}><Icons.Lock /></div>
                  <div className={styles.tipText}>Your photos are visible only to accepted connections.</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ReceivedInterestsPage;
