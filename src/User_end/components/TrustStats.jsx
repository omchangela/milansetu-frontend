import styles from '../pages/styles/about_page.module.css';

const stats = [
  {
    id: 1,
    number: '10+',
    label: 'YEARS OF EXCELLENCE',
    type: 'white',
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M12 8v4l3 3" />
        <circle cx="12" cy="12" r="9" />
        <path d="M3.33 16c-1.86-1.86-1.86-4.88 0-6.74" />
      </svg>
    ),
  },
  {
    id: 2,
    number: '5000+',
    label: 'VERIFIED PROFILES',
    type: 'navy',
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
        <path d="M9 12l2 2 4-4" />
      </svg>
    ),
  },
  {
    id: 3,
    number: '1000+',
    label: 'SUCCESS STORIES',
    type: 'white',
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
      </svg>
    ),
  },
];

function TrustStats() {
  return (
    <section className={styles.statsSection}>
      <div className={styles.statsContainer}>
        <div className={styles.statsGrid}>
          {stats.map((stat) => (
            <div key={stat.id} className={`${styles.statCard} ${styles['statCard' + stat.type]}`}>
              <div className={styles.statIcon}>{stat.icon}</div>
              <div className={styles.statNumber}>{stat.number}</div>
              <div className={styles.statLabel}>{stat.label}</div>
              <div className={styles.statUnderline} />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

export { TrustStats };
