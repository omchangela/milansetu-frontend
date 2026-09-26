import { useState } from 'react';
import Header from '../../components/Header';
import styles from '../styles/branches_page.module.css';

// Hero & map
import branchesBg from '../../../assets/User_end_assets/branches_sec.png';
import mapImg from '../../../assets/User_end_assets/Map representation.png';

// Branch city icons
import iconMumbai   from '../../../assets/User_end_assets/Icon (2).png';
import iconDelhi    from '../../../assets/User_end_assets/Icon (3).png';
import iconBangalore from '../../../assets/User_end_assets/Icon (4).png';
import iconHyderabad from '../../../assets/User_end_assets/Icon (5).png';
import iconPune     from '../../../assets/User_end_assets/Icon (6).png';
import iconAhmedabad from '../../../assets/User_end_assets/Icon (7).png';

// Info row icons
import iconPerson   from '../../../assets/User_end_assets/Icon (8).png';
import iconAddress  from '../../../assets/User_end_assets/Icon (9).png';
import iconPhone    from '../../../assets/User_end_assets/Icon (10).png';

const indiaBranches = [
  {
    city: 'Mumbai',
    headOffice: true,
    area: 'MARINE DRIVE CORPORATE CENTER',
    manager: 'Mrs. Ananya Kulkarni',
    address: 'Level 12, Heritage Towers, Netaji Subhash Chandra Bose Rd, Mumbai 400020',
    phone: '+91 22 4500 8888',
    mapLink: 'https://maps.google.com/?q=Heritage+Towers+Marine+Drive+Mumbai',
    icon: iconMumbai,
  },
  {
    city: 'Delhi',
    area: 'SOUTH EXTENSION II',
    manager: 'Mr. Vikramaditya Singh',
    address: 'Elite Chambers, Block E, South Extension Part II, New Delhi 110049',
    phone: '+91 11 2625 9900',
    mapLink: 'https://maps.google.com/?q=South+Extension+II+New+Delhi',
    icon: iconDelhi,
  },
  {
    city: 'Bangalore',
    area: 'KORAMANGALA 4TH BLOCK',
    manager: 'Ms. Preeti Reddy',
    address: '100 Feet Road, Koramangala 4th Block, Bengaluru 560034',
    phone: '+91 80 4125 7777',
    mapLink: 'https://maps.google.com/?q=Koramangala+4th+Block+Bangalore',
    icon: iconBangalore,
  },
  {
    city: 'Hyderabad',
    area: 'BANJARA HILLS RD NO. 12',
    manager: 'Mr. Sridhar Rao',
    address: 'Royal Plaza, Banjara Hills Rd Number 12, Hyderabad 500034',
    phone: '+91 40 2333 4455',
    mapLink: 'https://maps.google.com/?q=Banjara+Hills+Hyderabad',
    icon: iconHyderabad,
  },
  {
    city: 'Pune',
    area: 'KOREGAON PARK',
    manager: 'Mrs. Smita Deshpande',
    address: 'Lane 7, Ashoka Plaza, Koregaon Park, Pune 411001',
    phone: '+91 20 6677 8899',
    mapLink: 'https://maps.google.com/?q=Koregaon+Park+Pune',
    icon: iconPune,
  },
  {
    city: 'Ahmedabad',
    area: 'SATELLITE ROAD',
    manager: 'Mr. Parthiv Shah',
    address: 'Iscon Emporio, Satellite Road, Ahmedabad 380015',
    phone: '+91 79 4000 5566',
    mapLink: 'https://maps.google.com/?q=Satellite+Road+Ahmedabad',
    icon: iconAhmedabad,
  }
];

const globalCenters = [
  {
    city: 'London',
    district: 'MAYFAIR DISTRICT',
    desc: 'Specialized support for professionals in the UK and Europe.'
  },
  {
    city: 'Dubai',
    district: 'BUSINESS BAY',
    desc: 'Dedicated concierge services for the Middle East region.'
  },
  {
    city: 'San Francisco',
    district: 'FINANCIAL DISTRICT',
    desc: 'Modern matchmaking for the tech and diaspora community in the US.'
  }
];

export default function BranchesPage() {
  const [email, setEmail] = useState('');
  const [newsletterStatus, setNewsletterStatus] = useState('idle');

  const handleNewsletter = (e) => {
    e.preventDefault();
    if (!email) { setNewsletterStatus('error'); return; }
    setNewsletterStatus('success');
  };

  return (
    <div className={styles.page}>
      <Header />

      <main>
        {/* 1. Hero Section */}
        <section className={styles.hero}>
          <img src={branchesBg} alt="Branches hero" className={styles.heroBg} aria-hidden="true" />
          <div className={styles.heroOverlay} aria-hidden="true" />
          <div className={styles.heroContent}>
            <h1 className={styles.heroHeading}>Our Presence Across India.</h1>
            <p className={styles.heroSubtext}>
              Bridging distances for eternal unions. From the financial heart of Mumbai 
              to the historic lanes of Delhi, our elite consultants await you.
            </p>
            <div className={styles.heroLine}></div>
          </div>
        </section>

        {/* 2. India Branch Cards Grid */}
        <section className={styles.gridSection}>
          <div className={styles.grid}>
            {indiaBranches.map((branch, idx) => (
              <div key={idx} className={styles.card}>
                {branch.headOffice && <div className={styles.headOfficeBadge}>HEAD OFFICE</div>}
                <div className={styles.cardIcon}>
                  <img src={branch.icon} alt={branch.city} className={styles.cardIconImg} />
                </div>
                <h2 className={styles.cityName}>{branch.city}</h2>
                <span className={styles.areaLabel}>{branch.area}</span>
                <div className={styles.divider}></div>

                <div className={styles.infoRow}>
                  <img src={iconPerson} alt="manager" className={styles.infoIconImg} />
                  <div className={styles.infoContent}>
                    <span className={styles.infoLabel}>Branch Manager</span>
                    <span className={styles.infoValue}>{branch.manager}</span>
                  </div>
                </div>

                <div className={styles.infoRow}>
                  <img src={iconAddress} alt="address" className={styles.infoIconImg} />
                  <div className={styles.infoContent}>
                    <span className={styles.addressValue}>{branch.address}</span>
                  </div>
                </div>

                <div className={styles.infoRow}>
                  <img src={iconPhone} alt="phone" className={styles.infoIconImg} />
                  <div className={styles.infoContent}>
                    <a href={`tel:${branch.phone.replace(/\s/g, '')}`} className={styles.phoneValue}>
                      {branch.phone}
                    </a>
                  </div>
                </div>

                <a href={branch.mapLink} target="_blank" rel="noopener noreferrer" className={styles.directionsLink}>
                  GET DIRECTIONS →
                </a>
              </div>
            ))}
          </div>
        </section>

        {/* 3. Split Section */}
        <section className={styles.splitSection}>
          <div className={styles.mapSide}>
            <img src={mapImg} alt="Map representation" className={styles.mapImg} />
          </div>
          <div className={styles.contentSide}>
            <h2 className={styles.splitHeading}>Meticulous Service, Global Reach.</h2>
            <p className={styles.splitBody}>
              Each branch is designed to provide the ultimate privacy and professional consultation. 
              Our physical spaces reflect the luxury and attention to detail we bring to your search 
              for a life partner.
            </p>
            <div className={styles.featureRow}>
              <img src={iconPerson} alt="" className={styles.featureIconImg} />
              <span className={styles.featureLabel}>PRIVATE CONCIERGE ROOMS</span>
            </div>
            <div className={styles.featureRow}>
              <img src={iconAddress} alt="" className={styles.featureIconImg} />
              <span className={styles.featureLabel}>ELITE MATCHMAKING EXPERTS</span>
            </div>
            <div className={styles.featureRow}>
              <img src={iconPhone} alt="" className={styles.featureIconImg} />
              <span className={styles.featureLabel}>CONFIDENTIAL PROFILES</span>
            </div>
          </div>
        </section>

        {/* 4. Global Support Centers Section */}
        <section className={styles.globalSection}>
          <h2 className={styles.globalTitle}>Global Support Centers</h2>
          <p className={styles.globalSubtitle}>
            Providing world-class assistance to our Non-Resident Indian (NRI) clientele across the globe.
          </p>
          <div className={styles.globalGrid}>
            {globalCenters.map((center, idx) => (
              <div key={idx} className={styles.globalCard}>
                <div className={styles.globalIcon}>🏛️</div>
                <h3 className={styles.globalCity}>{center.city}</h3>
                <span className={styles.globalDistrict}>{center.district}</span>
                <p className={styles.globalDesc}>{center.desc}</p>
              </div>
            ))}
          </div>
        </section>
      </main>

      {/* 5. Footer */}
      <footer className={styles.footer}>
        <div className={styles.footerGrid}>
          <div>
            <div className={styles.footerBrand}>MilanSetu</div>
            <p className={styles.footerBrandText}>
              Exquisite matchmaking for those who believe that a life partnership is the ultimate legacy.
            </p>
            <div className={styles.footerSocials}>
              <span className={styles.footerSocialIcon}>🌐</span>
              <span className={styles.footerSocialIcon}>✉</span>
              <span className={styles.footerSocialIcon}>📞</span>
            </div>
          </div>
          <div>
            <h4 className={styles.footerColHead}>Quick Links</h4>
            <ul className={styles.footerLinks}>
              <li className={styles.footerLinkItem}><a href="#privacy" className={styles.footerLink}>Privacy Policy</a></li>
              <li className={styles.footerLinkItem}><a href="#terms" className={styles.footerLink}>Terms of Service</a></li>
              <li className={styles.footerLinkItem}><a href="#cookie" className={styles.footerLink}>Cookie Policy</a></li>
            </ul>
          </div>
          <div>
            <h4 className={styles.footerColHead}>Resources</h4>
            <ul className={styles.footerLinks}>
              <li className={styles.footerLinkItem}><a href="#grievance" className={styles.footerLink}>Grievance Redressal</a></li>
              <li className={styles.footerLinkItem}><a href="#safety" className={styles.footerLink}>Safety Tips</a></li>
              <li className={styles.footerLinkItem}><a href="#faq" className={styles.footerLink}>FAQ</a></li>
            </ul>
          </div>
          <div>
            <h4 className={styles.footerColHead}>NEWSLETTER</h4>
            <p className={styles.newsletterText}>Subscribe for elite relationship insights.</p>
            {newsletterStatus === 'success' ? (
              <p className={styles.successMsg}>Thank you for subscribing!</p>
            ) : (
              <form onSubmit={handleNewsletter}>
                <div className={styles.newsletterRow}>
                  <input 
                    type="email" 
                    placeholder="Email Address" 
                    className={styles.newsletterInput}
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                  />
                  <button type="submit" className={styles.newsletterBtn}>Join</button>
                </div>
                {newsletterStatus === 'error' && <p className={styles.errorMsg}>Please enter your email</p>}
              </form>
            )}
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
