import React, { useEffect, useMemo, useState } from 'react';
import styles from '../styles/sent_interests_page.module.css';
import Sidebar from '../../components/Sidebar';
import TopBar from '../../components/TopBar';
import {
  deleteInterest,
  fetchSentInterests,
  fetchSentInterestStats,
  withdrawInterest,
} from '../../../api/auth';
import {
  formatRelativeTime,
  getProfileAvatar,
  STATUS_LABELS,
} from '../../../utils/profileHelpers';

const Icons = {
  Clock: () => (
    <svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2">
      <circle cx="12" cy="12" r="10" /><polyline points="12 6 12 12 16 14" />
    </svg>
  ),
  Sparkle: () => (
    <svg viewBox="0 0 24 24" width="12" height="12" fill="currentColor">
      <path d="M12 2L14.5 9L21.5 11.5L14.5 14L12 21L9.5 14L2.5 11.5L9.5 9L12 2Z" />
    </svg>
  ),
  Check: () => (
    <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="3">
      <polyline points="20 6 9 17 4 12" />
    </svg>
  ),
  Trash: () => (
    <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2">
      <polyline points="3 6 5 6 21 6" /><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
    </svg>
  ),
};

const STATUS_CLASS = {
  pending: styles.statusPending,
  accepted: styles.statusAccepted,
  declined: styles.statusDeclined,
  withdrawn: styles.statusDeclined,
};

const DOT_CLASS = {
  pending: styles.dotPending,
  accepted: styles.dotAccepted,
  declined: styles.dotDeclined,
  withdrawn: styles.dotDeclined,
};

function InterestCard({ interest, onWithdraw, onDelete }) {
  const receiver = interest.receiver;
  const name = receiver?.full_name || 'Member';
  const img = getProfileAvatar(receiver);
  const status = interest.status;

  return (
    <div className={styles.card}>
      <div className={styles.cardPhoto}>
        <img src={img} alt={name} className={styles.photoImg} />
        {interest.match_score > 0 && (
          <div className={styles.matchOverlay}>
            <Icons.Sparkle /> ✦ {interest.match_score}% MATCH
          </div>
        )}
      </div>
      <div className={styles.cardContent}>
        <div className={styles.cardHeader}>
          <h3 className={styles.name}>
            {name}{receiver?.age ? `, ${receiver.age}` : ''}
          </h3>
          <div className={`${styles.statusPill} ${STATUS_CLASS[status] || ''}`}>
            <div className={`${styles.statusDot} ${DOT_CLASS[status] || ''}`}></div>
            ● {STATUS_LABELS[status] || status.toUpperCase()}
          </div>
        </div>
        <p className={styles.subtitle}>
          {receiver?.current_designation || receiver?.education || 'Professional'}
          {receiver?.birth_place ? ` • ${receiver.birth_place}` : ''}
        </p>
        <div className={styles.timestampRow}>
          <Icons.Clock /> Sent {formatRelativeTime(interest.created_at)}
        </div>
        {interest.message && (
          <div className={styles.quoteBox}>{interest.message}</div>
        )}
        {interest.response_message && status === 'declined' && (
          <div className={styles.quoteBox}>{interest.response_message}</div>
        )}
        <div className={styles.cardActions}>
          {status === 'accepted' && (
            <a href="#messages" className={styles.filledBtn}>Message Now</a>
          )}
          {status === 'pending' && (
            <>
              <button className={styles.outlineBtn} onClick={() => onWithdraw(interest.id)}>
                Withdraw
              </button>
              <button
                className={styles.outlineBtn}
                onClick={() => { window.location.hash = `#profile/${receiver?.id}`; }}
              >
                View Profile
              </button>
            </>
          )}
          {(status === 'declined' || status === 'withdrawn') && (
            <>
              <button className={styles.archivedBtn} disabled>Closed</button>
              <button className={styles.deleteBtn} onClick={() => onDelete(interest.id)}>
                <Icons.Trash />
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
}

const SentInterestsPage = () => {
  const [interests, setInterests] = useState([]);
  const [stats, setStats] = useState({ total: 0, accepted: 0, response_rate: 0 });
  const [loading, setLoading] = useState(true);

  const loadData = async () => {
    setLoading(true);
    const [listRes, statsRes] = await Promise.all([
      fetchSentInterests(),
      fetchSentInterestStats(),
    ]);
    setInterests(Array.isArray(listRes.data) ? listRes.data : []);
    if (statsRes.data) setStats(statsRes.data);
    setLoading(false);
  };

  useEffect(() => {
    loadData();
  }, []);

  const { recent, older } = useMemo(() => {
    const weekAgo = Date.now() - 7 * 24 * 60 * 60 * 1000;
    const recentList = [];
    const olderList = [];
    interests.forEach((item) => {
      const created = new Date(item.created_at).getTime();
      if (created >= weekAgo) recentList.push(item);
      else olderList.push(item);
    });
    return { recent: recentList, older: olderList };
  }, [interests]);

  const handleWithdraw = async (id) => {
    await withdrawInterest(id);
    loadData();
  };

  const handleDelete = async (id) => {
    await deleteInterest(id);
    loadData();
  };

  return (
    <div className={styles.container}>
      <Sidebar activePage="sent" />

      <main className={styles.mainContent}>
        <TopBar searchPlaceholder="Search interests..." />

        <div className={styles.pageBody}>
          <div className={styles.headerRow}>
            <div>
              <h1 className={styles.pageTitle}>Sent Interests</h1>
              <div className={styles.journeyPill}>
                <div className={styles.dotIcon}></div>
                Active Journey: {stats.total} Interest{stats.total === 1 ? '' : 's'}
              </div>
            </div>
            <div className={styles.statsBox}>
              <div className={styles.statItem}>
                <span className={styles.statLabel}>RESPONSE RATE</span>
                <span className={styles.statValue}>{stats.response_rate}%</span>
              </div>
              <div className={styles.statItem}>
                <span className={styles.statLabel}>TOTAL ACCEPTED</span>
                <span className={styles.statValue}>
                  {stats.accepted} <span className={styles.checkBadge}><Icons.Check /></span>
                </span>
              </div>
            </div>
          </div>

          <div className={styles.contentArea}>
            <div className={styles.timeline}></div>

            {loading && <p>Loading sent interests…</p>}
            {!loading && interests.length === 0 && (
              <p>No interests sent yet. Explore matches on your dashboard to connect.</p>
            )}

            {recent.length > 0 && (
              <>
                <div className={styles.sectionHeader}>
                  <div className={styles.marker}></div>
                  <h2 className={styles.sectionTitle}>Recent Connections</h2>
                </div>
                <div className={styles.cardList}>
                  {recent.map((interest) => (
                    <InterestCard
                      key={interest.id}
                      interest={interest}
                      onWithdraw={handleWithdraw}
                      onDelete={handleDelete}
                    />
                  ))}
                </div>
              </>
            )}

            {older.length > 0 && (
              <>
                <div className={styles.sectionHeader}>
                  <div className={`${styles.marker} ${styles.markerOutline}`}></div>
                  <h2 className={styles.sectionTitle}>Earlier</h2>
                </div>
                <div className={styles.cardList}>
                  {older.map((interest) => (
                    <InterestCard
                      key={interest.id}
                      interest={interest}
                      onWithdraw={handleWithdraw}
                      onDelete={handleDelete}
                    />
                  ))}
                </div>
              </>
            )}
          </div>
        </div>
      </main>
    </div>
  );
};

export default SentInterestsPage;
