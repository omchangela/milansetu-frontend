import Header from '../../components/Header';
import styles from '../styles/success_stories_page.module.css';
import succStoryBg from '../../../assets/User_end_assets/succ_story.png';

const stories = [
  {
    id: 1,
    couple: 'Sameer & Riya',
    date: 'OCTOBER 2023',
    badge: 'VERIFIED MATCH',
    badgeClass: styles.badgeGreen,
    quote: '"Heritage Elite understood our family values perfectly. They didn\'t just find a match, they found a soulmate who shares my passion for..."',
    img: 'https://images.unsplash.com/photo-1621112904887-419379ce6824?w=600&q=80'
  },
  {
    id: 2,
    couple: 'Arjun & Meera',
    date: 'JANUARY 2024',
    badge: 'MEMBER SINCE 2021',
    badgeClass: styles.badgeTeal,
    quote: '"The bespoke consultation process was world-class. Meera is exactly the person I was looking for – intelligent, grounded, and..."',
    img: 'https://images.unsplash.com/photo-1515934751635-c81c6bc9a2d8?w=600&q=80'
  },
  {
    id: 3,
    couple: 'Kabir & Ananya',
    date: 'DECEMBER 2023',
    badge: 'GLOBAL MEMBER',
    badgeClass: styles.badgeDark,
    quote: '"Finding love across continents seemed impossible until we met through Heritage Elite\'s global network. Truly grateful for their..."',
    img: 'https://images.unsplash.com/photo-1595914041133-3d0739958ee1?w=600&q=80'
  }
];

const videos = [
  {
    id: 1,
    label: 'THE MEHTA WEDDING',
    title: 'A Royal Udaipur Affair',
    thumb: 'https://images.unsplash.com/photo-1511795409834-ef04bbd61622?w=800&q=80'
  },
  {
    id: 2,
    label: "VIKRAM & DIYA'S STORY",
    title: 'Love in the Time of Tradition',
    thumb: 'https://images.unsplash.com/photo-1519225495810-753b514e8254?w=800&q=80'
  }
];

export default function SuccessStoriesPage() {
  return (
    <div className={styles.page}>
      <Header />
      
      <main>
        {/* 1. Hero Section */}
        <section className={styles.hero}>
          {/* Background image */}
          <img src={succStoryBg} alt="Couple in traditional wedding attire" className={styles.heroBg} aria-hidden="true" />
          
          {/* Gradient overlay */}
          <div className={styles.heroOverlay} aria-hidden="true" />

          <div className={styles.heroContent}>
            <span className={styles.estBadge}>EST. 1992</span>
            <h1 className={styles.heroHeading}>A Legacy of Love & Premium Union</h1>
            <p className={styles.heroSubtext}>
              Celebrating the beautiful journeys of our most distinguished members. 
              Discover how heritage and modern compatibility create lifelong partnerships.
            </p>
            <div className={styles.heroBtns}>
              <button className={styles.btnFilled}>READ STORIES</button>
              <button className={styles.btnOutlined}>WATCH VIDEOS</button>
            </div>
          </div>
        </section>

        {/* 1.5 Featured Story Section (Sneha & Sai) */}
        <section className={styles.featuredSection}>
          <div className={styles.featuredContainer}>
            <h2 className={styles.mainQuote}>
              "Our journey began with a single match and ended in a lifetime of love."
            </h2>
            <div className={styles.featuredFlex}>
              <div className={styles.featuredImageSide}>
                <img 
                  src="https://images.unsplash.com/photo-1621112904887-419379ce6824?w=800&q=80" 
                  alt="Sneha & Sai" 
                  className={styles.featuredImg}
                />
              </div>
              <div className={styles.featuredContentSide}>
                <span className={styles.featuredTag}>SNEHA & SAI'S STORY</span>
                <blockquote className={styles.featuredTestimonial}>
                  "Heritage Elite provided the privacy and exclusivity we were looking for. 
                  The matchmaking process was so personalized that we felt like we already 
                  knew each other before our first meeting. It wasn't just about finding 
                  a partner; it was about finding the right soul for the family."
                </blockquote>
                <div className={styles.featuredDivider}></div>
                <span className={styles.featuredMarried}>Married Oct 2023</span>
              </div>
            </div>
          </div>
        </section>

        {/* 2. Discover Journeys Section */}
        <section className={styles.discoverSection}>
          <div>
            <h2 className={styles.discoverTitle}>Discover Journeys</h2>
            <p className={styles.discoverSubtitle}>Filter by community or wedding year</p>
          </div>
          <div className={styles.filters}>
            <div className={styles.searchInputWrap}>
              <span className={styles.searchIcon}>🔍</span>
              <input type="text" placeholder="COMMUNITY" className={styles.searchInput} />
            </div>
            <select className={styles.selectInput}>
              <option>ALL YEARS</option>
              <option>2024</option>
              <option>2023</option>
              <option>2022</option>
            </select>
          </div>
        </section>

        {/* 3. Story Cards Grid */}
        <section className={styles.storyGridSection}>
          <div className={styles.storyGrid}>
            {stories.map(story => (
              <article key={story.id} className={styles.storyCard}>
                <div className={styles.cardImageWrap}>
                  <img src={story.img} alt={story.couple} className={styles.cardImage} />
                  <span className={`${styles.cardBadge} ${story.badgeClass}`}>
                    {story.badge}
                  </span>
                </div>
                <div className={styles.cardContent}>
                  <div className={styles.cardTopRow}>
                    <h3 className={styles.coupleName}>{story.couple}</h3>
                    <span className={styles.heartIcon}>♡</span>
                  </div>
                  <p className={styles.weddingDate}>{story.date}</p>
                  <p className={styles.quoteSnippet}>{story.quote}</p>
                  <a href="#story" className={styles.readMoreLink}>READ FULL STORY →</a>
                </div>
              </article>
            ))}
          </div>
        </section>

        {/* 4. Love in Motion Video Section */}
        <section className={styles.videoSection}>
          <h2 className={styles.videoTitle}>Love in Motion</h2>
          <p className={styles.videoSubtitle}>
            Cinematic glimpses into the weddings and testimonials of our most beloved couples.
          </p>
          <div className={styles.videoGrid}>
            {videos.map(video => (
              <div key={video.id} className={styles.videoCard}>
                <img src={video.thumb} alt={video.title} className={styles.videoThumb} />
                <div className={styles.playBtn}>▶</div>
                <div className={styles.videoOverlayText}>
                  <span className={styles.videoLabel}>{video.label}</span>
                  <p className={styles.videoName}>{video.title}</p>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* 5. Begin Your Own Story CTA Section */}
        <section className={styles.ctaSection}>
          <h2 className={styles.ctaHeading}>Begin Your Own Story</h2>
          <p className={styles.ctaSubtext}>
            Every great legacy starts with a single step. Let us guide you towards 
            a partnership that honors your heritage and reflects your future.
          </p>
          <div className={styles.ctaBtns}>
            <a href="#register" className={styles.ctaBtnFilled}>FIND YOUR MATCH</a>
            <a href="#consult" className={styles.ctaBtnOutlined}>BOOK A CONSULTATION</a>
          </div>
          <div className={styles.trustBadges}>
            <div className={styles.trustBadge}>
              <span>✅</span> 
              <div>
                <strong>VERIFIED PROFILES</strong>
                <p style={{ margin: 0, fontWeight: 400, opacity: 0.8 }}>Manual phone and identity verification for every single member.</p>
              </div>
            </div>
            <div className={styles.trustBadge}>
              <span>📈</span> 
              <div>
                <strong>SUCCESS RATE</strong>
                <p style={{ margin: 0, fontWeight: 400, opacity: 0.8 }}>Over 85% of our elite members find their partner within 6 months.</p>
              </div>
            </div>
          </div>
        </section>
      </main>

      {/* 6. Footer */}
      <footer className={styles.footer}>
        <div className={styles.footerGrid}>
          <div>
            <div className={styles.footerBrand}>MilanSetu</div>
            <p className={styles.footerBrandText}>
              Curating exceptional unions for the world's most discerning individuals since 1992.
            </p>
          </div>
          <div>
            <h4 className={styles.footerColHead}>Quick Links</h4>
            <ul className={styles.footerLinks}>
              <li className={styles.footerLinkItem}><a href="#success" className={styles.footerLink}>Success Stories</a></li>
              <li className={styles.footerLinkItem}><a href="#membership" className={styles.footerLink}>Membership Plans</a></li>
              <li className={styles.footerLinkItem}><a href="#branches" className={styles.footerLink}>Global Branches</a></li>
              <li className={styles.footerLinkItem}><a href="#faq" className={styles.footerLink}>FAQ</a></li>
            </ul>
          </div>
          <div>
            <h4 className={styles.footerColHead}>Support</h4>
            <ul className={styles.footerLinks}>
              <li className={styles.footerLinkItem}><a href="#safety" className={styles.footerLink}>Safety Tips</a></li>
              <li className={styles.footerLinkItem}><a href="#grievance" className={styles.footerLink}>Grievance Redressal</a></li>
              <li className={styles.footerLinkItem}><a href="#contact" className={styles.footerLink}>Contact Us</a></li>
            </ul>
          </div>
          <div>
            <h4 className={styles.footerColHead}>Legal</h4>
            <ul className={styles.footerLinks}>
              <li className={styles.footerLinkItem}><a href="#privacy" className={styles.footerLink}>Privacy Policy</a></li>
              <li className={styles.footerLinkItem}><a href="#terms" className={styles.footerLink}>Terms of Service</a></li>
              <li className={styles.footerLinkItem}><a href="#cookie" className={styles.footerLink}>Cookie Policy</a></li>
            </ul>
          </div>
        </div>
        <div className={styles.footerBottom}>
          <p className={styles.footerCopyright}>
            © 2024 Heritage Elite Matrimony. All rights reserved. Designed for the discerning.
          </p>
        </div>
      </footer>
    </div>
  );
}
