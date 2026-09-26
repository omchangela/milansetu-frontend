import Header from '../../components/Header';
import AboutFooter from '../../components/AboutFooter';
import { TrustStats } from '../../components/TrustStats';
import OurJourney from '../../components/OurJourney';
import MissionVision from '../../components/MissionVision';
import LeadershipTeam from '../../components/LeadershipTeam';
import styles from '../styles/about_page.module.css';
import aboutusBg from '../../../assets/User_end_assets/aboutus_bg.png';

function AboutHero() {
  return (
    <section className={styles.hero}>
      {/* Background image */}
      <img src={aboutusBg} alt="About us background" className={styles.heroBg} aria-hidden="true" />
      
      {/* Light wash overlay */}
      <div className={styles.heroOverlay} />

      <div className={styles.heroContent}>
        <span className={styles.eyebrow}>LEGACY & EXCELLENCE</span>
        <h1 className={styles.mainHeading}>
          <span className={styles.headingMaroon}>A Legacy of Love and </span>
          <span className={styles.headingGold}>Tradition.</span>
        </h1>
        <p className={styles.description}>
          Crafting meaningful unions for the discerning elite since 2014, where timeless cultural values meet sophisticated modern matchmaking.
        </p>
      </div>
    </section>
  );
}

export default function AboutPage() {
  return (
    <div className={styles.page}>
      <Header />
      <main>
        <AboutHero />
        <TrustStats />
        <OurJourney />
        <MissionVision />
        <LeadershipTeam />
      </main>
      <AboutFooter />
    </div>
  );
}

