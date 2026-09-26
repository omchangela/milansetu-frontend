import styles from '../pages/styles/about_page.module.css';

export default function OurJourney() {
  return (
    <section className={styles.journeySection}>
      <div className={styles.journeyContainer}>
        
        {/* Left Column: Content */}
        <div className={styles.journeyLeft}>
          <div className={styles.accentBorder} />
          <div className={styles.journeyContent}>
            <span className={styles.journeyEyebrow}>OUR JOURNEY</span>
            <h2 className={styles.journeyHeading}>
              Established in 2014, Heritage Elite combines traditional values with modern matchmaking.
            </h2>
            <p className={styles.journeyParagraph}>
              Our foundation was built on a simple yet profound realization: that for the global Indian community, marriage is more than just a union between two individuals—it is the weaving together of families, traditions, and futures.
            </p>
            <p className={styles.journeyParagraph}>
              Over the past decade, we have refined a methodology that respects the nuances of caste, community, and culture while leveraging data-driven insights and human intuition to ensure compatibility at the deepest levels.
            </p>
          </div>
        </div>

        {/* Right Column: Image */}
        <div className={styles.journeyRight}>
          <div className={styles.journeyImageWrapper}>
            <img 
              src="https://images.unsplash.com/photo-1595152772835-219674b2a8a6?w=800&q=80" 
              alt="Indian couple in traditional wedding attire" 
              className={styles.journeyImage}
            />
            {/* Floating Quote Card */}
            <div className={styles.quoteCard}>
              <p className={styles.quoteText}>"Values First"</p>
              <p className={styles.quoteSublabel}>Our Founding Philosophy</p>
            </div>
          </div>
        </div>

      </div>
    </section>
  );
}
