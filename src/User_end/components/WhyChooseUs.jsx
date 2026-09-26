import styles from '../pages/styles/why_choose_us.module.css';

export default function WhyChooseUs() {
  return (
    <section className={styles.section}>
      <div className={styles.container}>
        <div className={styles.bentoGrid}>
          
          {/* Card 1: Privacy (Span 8) */}
          <div className={`${styles.card} ${styles.privacyCard}`}>
            <div className={styles.iconBoxBurgundy}>
              <svg viewBox="0 0 24 24" fill="none" stroke="#7A1E3A" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
                <path d="M7 11V7a5 5 0 0 1 10 0v4" />
              </svg>
            </div>
            <div className={styles.content}>
              <h3 className={styles.cardTitle}>Unrivaled Privacy Controls</h3>
              <p className={styles.cardDescription}>
                Control who sees your photos and details with granular privacy settings. We prioritize your discretion above all else.
              </p>
            </div>
          </div>

          {/* Card 2: Highlight (Span 4) */}
          <div className={`${styles.card} ${styles.highlightCard}`}>
            {/* This card is styled with a solid Burgundy background per specs */}
            <div className={styles.highlightContent}>
                <div className={styles.highlightLogo}>
                    {/* Placeholder for a logo or visual element */}
                    <svg viewBox="0 0 24 24" fill="none" stroke="#FFFFFF" strokeWidth="1.5">
                        <path d="M12 2L2 7L12 12L22 7L12 2Z" />
                        <path d="M2 17L12 22L22 17" />
                        <path d="M2 12L12 17L22 12" />
                    </svg>
                </div>
            </div>
          </div>

          {/* Card 3: Concierge (Span 4) */}
          <div className={`${styles.card} ${styles.conciergeCard}`}>
            <div className={styles.iconBoxGold}>
              <svg viewBox="0 0 24 24" fill="none" stroke="#FFFFFF" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
                <circle cx="9" cy="7" r="4" />
              </svg>
            </div>
            <div className={styles.content}>
              <h3 className={styles.cardTitle}>Dedicated Concierge</h3>
              <p className={styles.cardDescriptionSmall}>
                Premium members receive 1-on-1 assistance from experienced matchmakers.
              </p>
            </div>
          </div>

          {/* Card 4: Stats (Span 8) */}
          <div className={`${styles.card} ${styles.statsCard}`}>
            <div className={styles.statsGrid}>
              <div className={styles.statItem}>
                <h4 className={styles.statTitle}>Verified Profiles</h4>
                <p className={styles.statDesc}>Manual phone and identity verification for every single member.</p>
              </div>
              <div className={styles.statItem}>
                <h4 className={styles.statTitle}>Success Rate</h4>
                <p className={styles.statDesc}>Over 85% of our elite members find their partner within 6 months.</p>
              </div>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
}
