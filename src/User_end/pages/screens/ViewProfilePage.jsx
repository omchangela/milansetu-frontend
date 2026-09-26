import React, { useEffect, useState } from 'react';
import styles from '../styles/my_profile_page.module.css';
import Sidebar from '../../components/Sidebar';
import TopBar from '../../components/TopBar';
import { fetchProfileById } from '../../../api/auth';
import { getIdealPartnerPreferences, getProfileAvatar } from '../../../utils/profileHelpers';

const Icons = {
  Pin: () => (
    <svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" /><circle cx="12" cy="10" r="3" />
    </svg>
  ),
  SearchSmall: () => (
    <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2">
      <circle cx="11" cy="11" r="8" /><line x1="21" y1="21" x2="16.65" y2="16.65" />
    </svg>
  ),
  Star: () => (
    <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2">
      <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
    </svg>
  ),
  Users: () => (
    <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" /><circle cx="9" cy="7" r="4" />
      <path d="M23 21v-2a4 4 0 0 0-3-3.87" /><path d="M16 3.13a4 4 0 0 1 0 7.75" />
    </svg>
  ),
  Profile: () => (
    <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" /><circle cx="12" cy="7" r="4" />
    </svg>
  ),
  Dashboard: () => (
    <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2">
      <rect x="3" y="3" width="7" height="7" /><rect x="14" y="3" width="7" height="7" />
      <rect x="14" y="14" width="7" height="7" /><rect x="3" y="14" width="7" height="7" />
    </svg>
  ),
  Briefcase: () => (
    <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2">
      <rect x="2" y="7" width="20" height="14" rx="2" ry="2" />
      <path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16" />
    </svg>
  ),
  Graduation: () => (
    <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M22 10L12 5L2 10L12 15L22 10Z" /><path d="M6 12V17L12 20L18 17V12" />
    </svg>
  ),
  Moon: () => (
    <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" />
    </svg>
  ),
  ArrowLeft: () => (
    <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2">
      <line x1="19" y1="12" x2="5" y2="12" /><polyline points="12 19 5 12 12 5" />
    </svg>
  ),
};

const ViewProfilePage = ({ profileId }) => {
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    let active = true;
    setLoading(true);
    setError('');

    fetchProfileById(profileId).then(({ data, error: err }) => {
      if (!active) return;
      if (err) {
        setError(err);
        setProfile(null);
      } else {
        setProfile(data);
      }
      setLoading(false);
    });

    return () => { active = false; };
  }, [profileId]);

  const displayName = profile?.full_name || 'Member Profile';
  const designation = profile?.current_designation || '';
  const avatar = getProfileAvatar(profile);
  const birthDate = profile?.date_of_birth
    ? new Date(profile.date_of_birth).toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' })
    : '—';

  return (
    <div className={styles.dashboardContainer}>
      <Sidebar activePage="matches" />

      <main className={styles.mainContent}>
        <TopBar searchPlaceholder="Search connections..." userName={displayName} avatarSrc={avatar} />

        <div className={styles.profileBody}>
          {loading && <div className={styles.apiError}>Loading profile…</div>}
          {error && <div className={styles.apiError}>{error}</div>}

          {!loading && !error && profile && (
            <>
              <section className={styles.profileHeaderCard}>
                <div className={styles.bannerStrip}></div>
                <div className={styles.headerContent}>
                  <div className={styles.profileInfoWrapper}>
                    <div className={styles.photoContainer}>
                      <img src={avatar} alt={displayName} className={styles.profilePhoto} />
                      <div className={styles.verifiedBadge}>✓</div>
                    </div>
                    <div>
                      <div className={styles.nameBadgeRow}>
                        <h1 className={styles.profileName}>{displayName}</h1>
                        <span className={styles.memberBadge}>Verified Member</span>
                      </div>
                      <div className={styles.metaLine}>
                        <Icons.Pin />
                        {profile?.birth_place || 'India'}
                        {designation ? ` • ${designation}` : ''}
                      </div>
                    </div>
                  </div>
                  <div className={styles.headerActions}>
                    <button className={styles.editBtn} onClick={() => { window.location.hash = '#dashboard'; }}>
                      <Icons.ArrowLeft /> Back to Dashboard
                    </button>
                  </div>
                </div>
              </section>

              <div className={styles.infoGrid}>
                <div className={styles.infoCard}>
                  <div className={styles.cardHeader}>
                    <div className={styles.iconCircle}><Icons.SearchSmall /></div>
                    <h2 className={styles.cardTitle}>Personal Details</h2>
                  </div>
                  <div className={styles.fieldGrid}>
                    {[
                      { label: 'Full Name', value: profile?.full_name || '—' },
                      { label: 'Age', value: profile?.age ? `${profile.age} Years` : '—' },
                      { label: 'Height', value: profile?.height_cm ? `${profile.height_cm} cm` : '—' },
                      { label: 'Religion', value: profile?.religion || '—' },
                      { label: 'Mother Tongue', value: profile?.mother_tongue || '—' },
                      { label: 'Marital Status', value: profile?.marital_status || '—' },
                    ].map((f) => (
                      <div key={f.label} className={styles.field}>
                        <span className={styles.fieldLabel}>{f.label}</span>
                        <div className={styles.fieldValue}>{f.value}</div>
                      </div>
                    ))}
                  </div>
                </div>

                <div className={`${styles.infoCard} ${styles.darkCard}`}>
                  <div className={styles.cardHeader}>
                    <div className={styles.iconCircle} style={{ backgroundColor: 'rgba(255,255,255,0.1)', color: 'white' }}>
                      <Icons.Star />
                    </div>
                    <h2 className={styles.cardTitle}>Ideal Partner</h2>
                  </div>
                  <div>
                    {getIdealPartnerPreferences(profile?.ideal_partner).map((p) => (
                      <div key={p.label} className={styles.prefRow}>
                        <span className={styles.prefLabel}>{p.label}</span>
                        <span className={styles.prefValue}>{p.value}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className={styles.infoCard}>
                  <div className={styles.cardHeader}>
                    <div className={styles.iconCircle}><Icons.Users /></div>
                    <h2 className={styles.cardTitle}>Family Information</h2>
                  </div>
                  <div className={styles.subBoxGrid}>
                    <div className={styles.subBox}>
                      <span className={styles.subBoxLabel}>PARENTS</span>
                      <div className={styles.subField}>
                        <Icons.Briefcase />
                        <div className={styles.subFieldInfo}>
                          <span className={styles.subFieldLabel}>Father's Occupation</span>
                          <span className={styles.subFieldValue}>{profile?.father_occupation || '—'}</span>
                        </div>
                      </div>
                      <div className={styles.subField}>
                        <Icons.Profile />
                        <div className={styles.subFieldInfo}>
                          <span className={styles.subFieldLabel}>Mother's Occupation</span>
                          <span className={styles.subFieldValue}>{profile?.mother_occupation || '—'}</span>
                        </div>
                      </div>
                    </div>
                    <div className={styles.subBox}>
                      <span className={styles.subBoxLabel}>BACKGROUND</span>
                      <div className={styles.subField}>
                        <Icons.Users />
                        <div className={styles.subFieldInfo}>
                          <span className={styles.subFieldLabel}>Siblings</span>
                          <span className={styles.subFieldValue}>
                            {profile?.siblings_count != null
                              ? `${profile.siblings_count}${profile.siblings_details ? ` — ${profile.siblings_details}` : ''}`
                              : '—'}
                          </span>
                        </div>
                      </div>
                      <div className={styles.subField}>
                        <Icons.Dashboard />
                        <div className={styles.subFieldInfo}>
                          <span className={styles.subFieldLabel}>Family Values</span>
                          <span className={styles.subFieldValue}>{profile?.family_values || '—'}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                <div className={`${styles.infoCard} ${styles.careerCard}`}>
                  <div className={styles.cardHeader}>
                    <div className={`${styles.iconCircle} ${styles.goldCircle}`}><Icons.Graduation /></div>
                    <h2 className={styles.cardTitle}>Career</h2>
                  </div>
                  <div className={styles.careerItem}>
                    <span className={styles.careerTitle}>{profile?.education || '—'}</span>
                    <span className={styles.careerSubtitle}>{profile?.industry || ''}</span>
                  </div>
                  <div className={styles.careerItem}>
                    <span className={styles.careerTitle}>{profile?.current_company || '—'}</span>
                    <span className={styles.careerSubtitle}>{profile?.current_designation || ''}</span>
                  </div>
                </div>

                <div className={`${styles.infoCard} ${styles.fullWidth}`}>
                  <div className={styles.cardHeaderFull}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                      <div className={styles.iconCircle}><Icons.Moon /></div>
                      <h2 className={styles.cardTitle}>Horoscope & Kundali</h2>
                    </div>
                  </div>
                  <div className={styles.dataRow}>
                    {[
                      { label: 'BIRTH DATE', value: birthDate },
                      { label: 'BIRTH TIME', value: profile?.time_of_birth || '—' },
                      { label: 'BIRTH PLACE', value: profile?.birth_place || '—' },
                      { label: 'ZODIAC SIGN', value: profile?.zodiac_sign || '—' },
                    ].map((d) => (
                      <div key={d.label} className={styles.dataItem}>
                        <span className={styles.fieldLabel}>{d.label}</span>
                        <span className={styles.subFieldValue} style={{ fontSize: '15px' }}>{d.value}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </>
          )}
        </div>
      </main>
    </div>
  );
};

export default ViewProfilePage;
