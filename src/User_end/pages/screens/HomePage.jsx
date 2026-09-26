import { useState } from 'react';
import Header from '../../components/Header';
import Footer from '../../components/Footer';
import HowItWorks from '../../components/HowItWorks';
import WhyChooseUs from '../../components/WhyChooseUs';
import SuccessStories from '../../components/SuccessStories';
import MembershipPlans from '../../components/MembershipPlans';
import BranchNetwork from '../../components/BranchNetwork';
import MobileAppShowcase from '../../components/MobileAppShowcase';
import styles from '../styles/home_page.module.css';
import cp from '../styles/curated_profiles.module.css';
import heroBg from '../../../assets/User_end_assets/hero_bg.png';
import AuthenticatedImage from '../../../components/AuthenticatedImage';
const slides = [0, 1, 2, 3];
 
/* ─── Curated Profiles data ──────────────────────────────── */
const profiles = [
  { id: 1, name: 'Priya S.', age: 27, profession: 'Fashion Designer', city: 'Mumbai', match: '98%' },
  { id: 2, name: 'Arjun M.', age: 31, profession: 'Tech Lead', city: 'Bangalore', match: '95%' },
  { id: 3, name: 'Ananya K.', age: 25, profession: 'Architect', city: 'Delhi', match: '92%' },
  { id: 4, name: 'Rohan V.', age: 29, profession: 'Surgeon', city: 'Chennai', match: '89%' },
];

function HeroSection() {
  const [activeSlide, setActiveSlide] = useState(0);
  const [form, setForm] = useState({
    lookingFor: 'Bride',
    ageRange: '21 - 25',
    religion: 'Hindu',
    community: 'All Communities',
  });

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });
  const handleSearch = (e) => { e.preventDefault(); console.log('Searching:', form); };

  const chevronSvg = (
    <svg className={styles.chevron} viewBox="0 0 20 20" fill="currentColor" width="16" height="16" aria-hidden="true">
      <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
    </svg>
  );

  return (
    <section className={styles.hero} id="home">
      {/* Background image */}
      <img src={heroBg} alt="Couple in traditional wedding attire" className={styles.heroBg} aria-hidden="true" />

      {/* Gradient overlay */}
      <div className={styles.heroOverlay} aria-hidden="true" />

      {/* Main content: badge + headline + search */}
      <div className={styles.heroContent}>
        <div className={styles.heroTop}>
          <div className={styles.heroBadge}>ESTABLISHED 1998</div>
          <h1 className={styles.heroHeadline}>
            Find Your Perfect<br />
            <em className={styles.heroHeadlineEm}>Life Partner</em>
          </h1>
        </div>

        {/* Search Widget */}
        <form className={styles.searchBox} onSubmit={handleSearch} aria-label="Partner search">
          <div className={styles.searchFields}>

            <div className={styles.searchField}>
              <label htmlFor="lookingFor" className={styles.searchLabel}>LOOKING FOR</label>
              <div className={styles.selectWrap}>
                <select id="lookingFor" name="lookingFor" className={styles.select} value={form.lookingFor} onChange={handleChange}>
                  <option>Bride</option>
                  <option>Groom</option>
                </select>
                {chevronSvg}
              </div>
            </div>

            <div className={styles.fieldDivider} aria-hidden="true" />

            <div className={styles.searchField}>
              <label htmlFor="ageRange" className={styles.searchLabel}>AGE RANGE</label>
              <div className={styles.selectWrap}>
                <select id="ageRange" name="ageRange" className={styles.select} value={form.ageRange} onChange={handleChange}>
                  <option>18 - 20</option>
                  <option>21 - 25</option>
                  <option>26 - 30</option>
                  <option>31 - 35</option>
                  <option>36 - 40</option>
                  <option>40+</option>
                </select>
                {chevronSvg}
              </div>
            </div>

            <div className={styles.fieldDivider} aria-hidden="true" />

            <div className={styles.searchField}>
              <label htmlFor="religion" className={styles.searchLabel}>RELIGION</label>
              <div className={styles.selectWrap}>
                <select id="religion" name="religion" className={styles.select} value={form.religion} onChange={handleChange}>
                  <option>Hindu</option>
                  <option>Muslim</option>
                  <option>Christian</option>
                  <option>Sikh</option>
                  <option>Jain</option>
                  <option>Buddhist</option>
                  <option>Other</option>
                </select>
                {chevronSvg}
              </div>
            </div>

            <div className={styles.fieldDivider} aria-hidden="true" />

            <div className={styles.searchField}>
              <label htmlFor="community" className={styles.searchLabel}>COMMUNITY</label>
              <div className={styles.selectWrap}>
                <select id="community" name="community" className={styles.select} value={form.community} onChange={handleChange}>
                  <option>All Communities</option>
                  <option>Brahmin</option>
                  <option>Kshatriya</option>
                  <option>Vaishya</option>
                  <option>Maratha</option>
                  <option>Rajput</option>
                  <option>Other</option>
                </select>
                {chevronSvg}
              </div>
            </div>

          </div>

          <button type="submit" className={styles.searchBtn} aria-label="Search for matches">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" width="18" height="18" aria-hidden="true">
              <circle cx="11" cy="11" r="8" />
              <line x1="21" y1="21" x2="16.65" y2="16.65" />
            </svg>
            Search
          </button>
        </form>

        {/* Stats — positioned under the search box */}
        <ul className={styles.stats}>
          <li className={styles.stat}>
            <span className={styles.statNum}>5000+</span>
            <span className={styles.statLabel}>VERIFIED<br />PROFILES</span>
          </li>
          <li className={styles.statSep} aria-hidden="true">|</li>
          <li className={styles.stat}>
            <span className={styles.statNum}>2k+</span>
            <span className={styles.statLabel}>SUCCESS<br />STORIES</span>
          </li>
          <li className={styles.statSep} aria-hidden="true">|</li>
          <li className={styles.stat}>
            <span className={styles.statNum}>100%</span>
            <span className={styles.statLabel}>PRIVACY<br />ASSURED</span>
          </li>
        </ul>
      </div>

      {/* Slide Dots */}
      <div className={styles.dots} role="tablist" aria-label="Slide indicators">
        {slides.map((i) => (
          <button
            key={i}
            role="tab"
            aria-selected={activeSlide === i}
            aria-label={`Slide ${i + 1}`}
            className={[styles.dot, activeSlide === i ? styles.dotActive : ''].filter(Boolean).join(' ')}
            onClick={() => setActiveSlide(i)}
          />
        ))}
      </div>
    </section>
  );
}

/* ─── Curated Profiles Section ───────────────────────────── */
function CuratedProfiles() {
  return (
    <section className={cp.section}>
      <div className={cp.sectionHeader}>
        <h2 className={cp.sectionTitle}>
          Curated <span className={cp.sectionTitleAccent}>Profiles</span>
        </h2>
        <a href="#profiles" className={cp.viewAll}>
          View All Profiles &rarr;
        </a>
      </div>
      <p className={cp.sectionSubtitle}>Discover elite matches hand-picked for your lifestyle.</p>

      <div className={cp.grid}>
        {profiles.map((p) => (
          <div key={p.id} className={cp.card}>
              <div className={cp.imageWrap}>
              <AuthenticatedImage alt={p.name} className={cp.profileImg} />
              <span className={cp.verifiedBadge}>
                <svg className={cp.verifiedTick} viewBox="0 0 12 12" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M10 3L4.5 8.5L2 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
                Verified
              </span>
            </div>
            <div className={cp.cardBody}>
              <div className={cp.cardTop}>
                <span className={cp.profileName}>{p.name}</span>
                <span className={cp.matchScore}>{p.match} Match</span>
              </div>
              <p className={cp.profileDetails}>
                {p.age} Yrs &bull; {p.profession} &bull; {p.city}
              </p>
              <button type="button" className={cp.viewProfileBtn}>
                View Profile
              </button>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}

export default function HomePage() {
  return (
    <div className={styles.page}>
      <Header />
      <main>
        <HeroSection />
        <CuratedProfiles />
        <HowItWorks />
        <WhyChooseUs />
        <SuccessStories />
        <MembershipPlans />
        <BranchNetwork />
        <MobileAppShowcase />
        {/* More sections will go here */}
      </main>
      <Footer />
    </div>
  );
}
