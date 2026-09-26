import styles from '../pages/styles/about_page.module.css';

export default function MissionVision() {
  return (
    <section className={styles.mvSection}>
      <div className={styles.mvContainer}>
        
        {/* Mission Card */}
        <div className={styles.mvCard}>
          <div className={`${styles.mvIconCircle} ${styles.missionIconBg}`}>
            <svg viewBox="0 0 24 24" fill="none" stroke="#FFFFFF" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M12 3l1.912 5.886h6.192l-5.01 3.638 1.912 5.886-5.006-3.638-5.006 3.638 1.912-5.886-5.01-3.638h6.192z" />
            </svg>
          </div>
          <h3 className={styles.mvTitle}>Our Mission</h3>
          <p className={styles.mvBody}>
            To facilitate meaningful unions that honor cultural heritage, ensuring every match is rooted in mutual respect, shared ambition, and deep-seated familial values.
          </p>
        </div>

        {/* Vision Card */}
        <div className={styles.mvCard}>
          <div className={`${styles.mvIconCircle} ${styles.visionIconBg}`}>
            <svg viewBox="0 0 24 24" fill="none" stroke="#1A1A2E" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
              <circle cx="12" cy="12" r="3" />
            </svg>
          </div>
          <h3 className={styles.mvTitle}>Our Vision</h3>
          <p className={styles.mvBody}>
            To be the most trusted name in premium Indian matchmaking globally, setting the standard for exclusivity, discretion, and marital success in the modern era.
          </p>
        </div>

      </div>
    </section>
  );
}
