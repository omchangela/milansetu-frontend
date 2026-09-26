import styles from '../pages/styles/mobile_app_showcase.module.css';

export default function MobileAppShowcase() {
  return (
    <section className={styles.section}>
      <div className={styles.container}>
        
        {/* Left Column: Content */}
        <div className={styles.leftColumn}>
          <h2 className={styles.heading}>
            Matchmaking<br />on the Go
          </h2>
          <p className={styles.description}>
            Experience the full power of Heritage Elite's matchmaking platform on your mobile device. Instant notifications, private chats, and seamless profile browsing.
          </p>
          
          <div className={styles.buttonStack}>
            {/* App Store Button */}
            <a href="#app-store" className={styles.appButton}>
              <svg className={styles.appIcon} viewBox="0 0 24 24" fill="currentColor">
                <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.1 2.48-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.31-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.81-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M13 3.5c.73-.83 1.21-1.99 1.07-3.14-1 .04-2.21.67-2.93 1.48-.65.71-1.21 1.91-1.06 3.01 1.12.09 2.19-.52 2.92-1.35z"/>
              </svg>
              <div className={styles.appTextStack}>
                <span className={styles.appSubtext}>DOWNLOAD ON THE</span>
                <span className={styles.appMaintext}>App Store</span>
              </div>
            </a>

            {/* Google Play Button */}
            <a href="#google-play" className={styles.appButton} style={{ width: '280px' }}>
              <svg className={styles.appIcon} viewBox="0 0 24 24" fill="currentColor">
                <path d="M3,20.5V3.5C3,2.91 3.34,2.39 3.84,2.15L13.69,12L3.84,21.85C3.34,21.61 3,21.09 3,20.5M16.81,15.12L18.66,16.19C19.21,16.5 19.5,17.07 19.5,17.65C19.5,18.23 19.21,18.8 18.66,19.11L15.19,21.11L14.4,12.71L16.81,15.12M4.6,2.09L13.69,11.19L15.19,2.89L18.66,4.89C19.21,5.2 19.5,5.77 19.5,6.35C19.5,6.93 19.21,7.5 18.66,7.81L16.81,8.88L4.6,2.09M14.4,11.29L15.19,3.89L4.6,21.91L14.4,11.29Z"/>
              </svg>
              <div className={styles.appTextStack}>
                <span className={styles.appSubtext}>GET IT ON</span>
                <span className={styles.appMaintext}>Google Play</span>
              </div>
            </a>
          </div>
        </div>

        {/* Right Column: Image Mockup */}
        <div className={styles.rightColumn}>
          <div className={styles.frame}>
            <div className={styles.phoneMockup}>
              <div className={styles.phoneScreen}>
                <div className={styles.mockupUI}>
                  <div className={styles.mockupProfile}></div>
                  <div className={styles.mockupName}>Priya Sharma</div>
                  <div className={styles.mockupMatch}>98% Match</div>
                  <div className={styles.mockupActions}>
                    <div className={styles.mockupDecline}></div>
                    <div className={styles.mockupConnect}></div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

      </div>
    </section>
  );
}
