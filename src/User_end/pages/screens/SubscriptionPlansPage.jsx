import React from 'react';
import styles from '../styles/subscription_plans_page.module.css';
import Sidebar from '../../components/Sidebar';
import sidebarStyles from '../styles/sidebar.module.css';
import TopBar from '../../components/TopBar';

// Icons
const Icons = {
  Search: () => (
    <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2">
      <circle cx="11" cy="11" r="8" /><line x1="21" y1="21" x2="16.65" y2="16.65" />
    </svg>
  ),
  Bell: () => (
    <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" /><path d="M13.73 21a2 2 0 0 1-3.46 0" />
    </svg>
  ),
  Check: () => (
    <svg viewBox="0 0 24 24" width="12" height="12" fill="none" stroke="currentColor" strokeWidth="3">
      <polyline points="20 6 9 17 4 12" />
    </svg>
  ),
  Cross: () => (
    <svg viewBox="0 0 24 24" width="12" height="12" fill="none" stroke="currentColor" strokeWidth="3">
      <line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" />
    </svg>
  ),
  Phone: () => (
    <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" />
    </svg>
  ),
  Shield: () => (
    <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
    </svg>
  ),
  Lock: () => (
    <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2">
      <rect x="3" y="11" width="18" height="11" rx="2" ry="2" /><path d="M7 11V7a5 5 0 0 1 10 0v4" />
    </svg>
  ),
  EyeOff: () => (
    <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24" /><line x1="1" y1="1" x2="23" y2="23" />
    </svg>
  ),
  HelpCircle: () => (
    <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2">
      <circle cx="12" cy="12" r="10" /><path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3" /><line x1="12" y1="17" x2="12.01" y2="17" />
    </svg>
  ),
  LogoutIcon: () => (
    <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" /><polyline points="16 17 21 12 16 7" /><line x1="21" y1="12" x2="9" y2="12" />
    </svg>
  )
};

const SubscriptionPlansPage = () => {
  return (
    <div className={styles.container}>
      <Sidebar activePage="subscription" />

      <div className={styles.mainLayout}>
        {/* Top Navbar */}
        <TopBar searchPlaceholder="Search plans..." />

        {/* Content Body */}
        <div className={styles.pageBody}>
          
          <div className={styles.heroSection}>
            <h1 className={styles.pageTitle}>Choose Your Path to Eternal Elegance</h1>
            <p className={styles.pageSubtitle}>
              Unlock exclusive privileges, personalized matchmaking, and enhanced privacy with our premium membership tiers designed for discerning individuals.
            </p>
          </div>

          {/* Pricing Cards */}
          <div className={styles.pricingRow}>
            
            {/* Gold Card */}
            <div className={styles.pricingCard}>
              <div className={styles.planLabel}>PREMIUM ESSENTIAL</div>
              <div className={styles.planName}>Gold</div>
              <div className={styles.priceBlock}>
                <span className={styles.priceValue}>₹9,999</span>
                <span className={styles.pricePeriod}> / 3 months</span>
              </div>
              
              <div className={styles.featureList}>
                <div className={styles.featureItem}>
                  <div className={styles.checkIconCircle}><Icons.Check /></div>
                  <span>Send unlimited interests</span>
                </div>
                <div className={styles.featureItem}>
                  <div className={styles.checkIconCircle}><Icons.Check /></div>
                  <span>View contact details (up to 50)</span>
                </div>
                <div className={styles.featureItem}>
                  <div className={styles.checkIconCircle}><Icons.Check /></div>
                  <span>Standout profile badge</span>
                </div>
                <div className={`${styles.featureItem} ${styles.featureDisabled}`}>
                  <div className={styles.crossIconCircle}><Icons.Cross /></div>
                  <span>Personal manager</span>
                </div>
              </div>
              
              <a href="#payment" className={`${styles.actionBtn} ${styles.btnGoldOutlined}`}>Select Gold</a>
            </div>

            {/* Diamond Card */}
            <div className={`${styles.pricingCard} ${styles.diamondCard}`}>
              <div className={styles.popularBadge}>MOST POPULAR</div>
              <div className={styles.planLabel}>THE ELITE CHOICE</div>
              <div className={styles.planName}>Diamond</div>
              <div className={styles.priceBlock}>
                <span className={styles.priceValue}>₹19,999</span>
                <span className={styles.pricePeriod}> / 6 months</span>
              </div>
              
              <div className={styles.featureList}>
                <div className={`${styles.featureItem} ${styles.featureBold}`}>
                  <div className={styles.checkIconCircle}><Icons.Check /></div>
                  <span>Top search placement</span>
                </div>
                <div className={styles.featureItem}>
                  <div className={styles.checkIconCircle}><Icons.Check /></div>
                  <span>View contact details (up to 150)</span>
                </div>
                <div className={styles.featureItem}>
                  <div className={styles.checkIconCircle}><Icons.Check /></div>
                  <span>Profile highlighting</span>
                </div>
                <div className={styles.featureItem}>
                  <div className={styles.checkIconCircle}><Icons.Check /></div>
                  <span>Dedicated Relationship Manager</span>
                </div>
              </div>
              
              <a href="#payment" className={`${styles.actionBtn} ${styles.btnDiamondFilled}`}>Begin Diamond Journey</a>
            </div>

            {/* Platinum Card */}
            <div className={styles.pricingCard}>
              <div className={styles.planLabel}>ULTIMATE CONCIERGE</div>
              <div className={styles.planName}>Platinum</div>
              <div className={styles.priceBlock}>
                <span className={styles.priceValue}>₹34,999</span>
                <span className={styles.pricePeriod}> / 12 months</span>
              </div>
              
              <div className={styles.featureList}>
                <div className={styles.featureItem}>
                  <div className={styles.checkIconCircle}><Icons.Check /></div>
                  <span>Unlimited everything</span>
                </div>
                <div className={styles.featureItem}>
                  <div className={styles.checkIconCircle}><Icons.Check /></div>
                  <span>Exclusive offline events</span>
                </div>
                <div className={styles.featureItem}>
                  <div className={styles.checkIconCircle}><Icons.Check /></div>
                  <span>Astro-matchmaking included</span>
                </div>
                <div className={`${styles.featureItem} ${styles.featureBold}`}>
                  <div className={styles.checkIconCircle}><Icons.Check /></div>
                  <span>Handpicked introductions</span>
                </div>
                <div className={`${styles.featureItem} ${styles.featureBold}`}>
                  <div className={styles.checkIconCircle}><Icons.Check /></div>
                  <span>100% Privacy Control</span>
                </div>
              </div>
              
              <a href="#payment" className={`${styles.actionBtn} ${styles.btnPlatinumOutlined}`}>Experience Platinum</a>
            </div>

          </div>

          {/* Comparison Table Section */}
          <div className={styles.comparisonSection}>
            <div className={styles.sectionHeading}>
              <h2 className={styles.sectionTitle}>The ShubhMilan Difference</h2>
              <div className={styles.pageSubtitle}>Compare plans to find the perfect fit for your matrimonial journey.</div>
            </div>

            <div className={styles.comparisonTable}>
              <div className={styles.tableHeaderRow}>
                <div className={styles.headerCell}>Features</div>
                <div className={styles.headerCell}>Gold</div>
                <div className={`${styles.headerCell} ${styles.diamondHeader}`}>Diamond</div>
                <div className={styles.headerCell}>Platinum</div>
              </div>

              {/* VISIBILITY */}
              <div className={styles.dividerRow}>Visibility</div>
              
              <div className={styles.dataRow}>
                <div className={styles.dataCell}>Profile Ranking</div>
                <div className={styles.dataCell}>Standard</div>
                <div className={`${styles.dataCell} ${styles.diamondHighlight} ${styles.textBold}`}>Elevated</div>
                <div className={`${styles.dataCell} ${styles.textBold}`}>Top Priority</div>
              </div>
              
              <div className={styles.dataRow}>
                <div className={styles.dataCell}>Search Visibility</div>
                <div className={styles.dataCell}>Normal</div>
                <div className={`${styles.dataCell} ${styles.diamondHighlight} ${styles.textBold}`}>Highlighted</div>
                <div className={`${styles.dataCell} ${styles.textBold}`}>Exclusive</div>
              </div>

              {/* COMMUNICATION */}
              <div className={styles.dividerRow}>Communication</div>
              
              <div className={styles.dataRow}>
                <div className={styles.dataCell}>Monthly Contacts</div>
                <div className={styles.dataCell}>50</div>
                <div className={`${styles.dataCell} ${styles.diamondHighlight} ${styles.textBold}`}>150</div>
                <div className={`${styles.dataCell} ${styles.textBold}`}>Unlimited</div>
              </div>

              <div className={styles.dataRow}>
                <div className={styles.dataCell}>Personalized Intro</div>
                <div className={styles.dataCell}><Icons.Cross /></div>
                <div className={`${styles.dataCell} ${styles.diamondHighlight}`}><span style={{color: '#C9971F'}}><Icons.Check /></span></div>
                <div className={styles.dataCell}><span style={{color: '#C9971F'}}><Icons.Check /></span></div>
              </div>

              {/* SERVICE */}
              <div className={styles.dividerRow}>Service</div>
              
              <div className={styles.dataRow}>
                <div className={styles.dataCell}>Support Level</div>
                <div className={styles.dataCell}>Email Support</div>
                <div className={`${styles.dataCell} ${styles.diamondHighlight} ${styles.textBold}`}>Dedicated Manager</div>
                <div className={`${styles.dataCell} ${styles.textBold}`}>24/7 Concierge</div>
              </div>

              <div className={styles.dataRow}>
                <div className={styles.dataCell}>Astro-Matchmaking</div>
                <div className={styles.dataCell}><Icons.Cross /></div>
                <div className={`${styles.dataCell} ${styles.diamondHighlight}`}><Icons.Cross /></div>
                <div className={styles.dataCell}><span style={{color: '#C9971F'}}><Icons.Check /></span></div>
              </div>
            </div>
          </div>

          {/* Footer Block */}
          <div className={styles.footerBlock}>
            <div className={styles.trustSection}>
              <h3 className={styles.trustHeading}>Secured & Trustworthy</h3>
              <p className={styles.trustDesc}>
                Your privacy and security are our highest priority. All premium memberships include advanced profile protection and bank-grade encryption for all transactions.
              </p>
              <div className={styles.trustBadges}>
                <div className={styles.badgeItem}>
                  <span className={styles.badgeIcon}><Icons.Shield /></span> PCI Compliant
                </div>
                <div className={styles.badgeItem}>
                  <span className={styles.badgeIcon}><Icons.Lock /></span> SSL Secure
                </div>
                <div className={styles.badgeItem}>
                  <span className={styles.badgeIcon}><Icons.EyeOff /></span> Privacy Guaranteed
                </div>
              </div>
            </div>

            <div className={styles.adviceCard}>
              <h3 className={styles.adviceHeading}>Need Personalized Advice?</h3>
              <p className={styles.adviceDesc}>
                Not sure which tier fits your requirements? Our matchmaking consultants are available to guide you.
              </p>
              <button className={styles.consultBtn}>
                <Icons.Phone /> Talk to a Consultant
              </button>
              <span className={styles.availText}>Available Mon-Sat, 9AM to 7PM</span>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
};

export default SubscriptionPlansPage;
