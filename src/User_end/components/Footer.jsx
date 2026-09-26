import styles from '../pages/styles/footer.module.css';

export default function Footer() {
  return (
    <footer className={styles.footer}>
      <div className={styles.container}>
        
        {/* Left Side: Brand & Copyright */}
        <div className={styles.leftSide}>
          <div className={styles.logo}>MilanSetu</div>
          <p className={styles.copyright}>
            © 2024 Vows of Elegance. Refined Indian Matchmaking. All rights reserved.
          </p>
        </div>

        {/* Center Side: Navigation & Safety */}
        <div className={styles.centerSide}>
          <nav className={styles.nav}>
            <a href="#contact" className={styles.navLink}>CONTACT</a>
            <a href="#terms" className={styles.navLink}>TERMS OF SERVICE</a>
            <a href="#privacy" className={styles.navLink}>PRIVACY POLICY</a>
            <a href="#cookie" className={styles.navLink}>COOKIE POLICY</a>
          </nav>
          <a href="#safety" className={styles.safetyLink}>SAFETY TIPS</a>
        </div>

        {/* Right Side: Social Icons */}
        <div className={styles.rightSide}>
          <a href="#website" aria-label="Website" className={styles.socialIcon}>
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="12" cy="12" r="10" />
              <line x1="2" y1="12" x2="22" y2="12" />
              <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" />
            </svg>
          </a>
          <a href="mailto:info@milansetu.com" aria-label="Email" className={styles.socialIcon}>
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
              <polyline points="22,6 12,13 2,6" />
            </svg>
          </a>
          <a href="#share" aria-label="Share" className={styles.socialIcon}>
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="18" cy="5" r="3" />
              <circle cx="6" cy="12" r="3" />
              <circle cx="18" cy="19" r="3" />
              <line x1="8.59" y1="13.51" x2="15.42" y2="17.49" />
              <line x1="15.41" y1="6.51" x2="8.59" y2="10.49" />
            </svg>
          </a>
        </div>

      </div>
    </footer>
  );
}
