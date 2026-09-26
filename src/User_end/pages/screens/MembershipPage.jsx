import { useState } from 'react';
import Header from '../../components/Header';
import styles from '../styles/membership_page.module.css';

const pricingPlans = [
  {
    id: 'basic',
    name: 'Basic',
    tagline: 'ESSENTIAL DISCOVERY',
    price: '₹15,000',
    duration: '/ 3 Months',
    features: [
      { text: 'Standard Profile Visibility', active: true },
      { text: 'Send 25 Interests/mo', active: true },
      { text: 'View 10 Contact Details', active: true },
      { text: 'Matchmaker Support', active: false },
    ],
    buttonText: 'SELECT BASIC',
    btnClass: styles.basicBtn,
  },
  {
    id: 'premium',
    name: 'Premium',
    tagline: 'ENHANCED MATCHMAKING',
    price: '₹35,000',
    duration: '/ 6 Months',
    features: [
      { text: 'Priority Profile Visibility', active: true },
      { text: 'Unlimited Interests', active: true },
      { text: 'View 50 Contact Details', active: true },
      { text: 'Background Verified Badge', active: true },
      { text: 'Direct Matchmaker Call', active: true },
    ],
    buttonText: 'SELECT PREMIUM',
    btnClass: styles.premiumBtn,
    featured: true,
  },
  {
    id: 'elite',
    name: 'Elite',
    tagline: 'BESPOKE CONCIERGE',
    price: '₹75,000',
    duration: '/ Annual',
    features: [
      { text: 'Featured Global Listing', active: true },
      { text: 'Personal Relationship Manager', active: true },
      { text: 'Hand-picked Matches Only', active: true },
      { text: 'Concierge Event Invites', active: true },
    ],
    buttonText: 'SELECT ELITE',
    btnClass: styles.eliteBtn,
    dark: true,
  },
];

const faqs = [
  {
    question: 'How do I upgrade my membership?',
    answer: 'You can upgrade your plan at any time through your dashboard settings. The remaining balance of your current plan will be pro-rated against the new membership tier.',
  },
  {
    question: 'Is my payment information secure?',
    answer: 'Yes, all payments are processed through secure, SSL-encrypted gateways. We do not store your sensitive financial data on our servers.',
  },
  {
    question: 'What is the "Elite" Relationship Manager?',
    answer: 'Elite members are assigned a dedicated specialist who manually curates profiles, conducts background audits, and manages communications on your behalf.',
  },
  {
    question: 'Can I cancel my membership?',
    answer: 'Membership plans are non-refundable once activated, but you can choose to disable auto-renewal at any time from your account settings.',
  },
];

export default function MembershipPage() {
  const [openFaq, setOpenFaq] = useState(0);

  const handleSelect = (plan) => {
    console.log(`Selected: ${plan}`);
    window.location.hash = '#find-match';
  };

  return (
    <div className={styles.page}>
      <Header />

      <main>
        {/* 1. Page Header */}
        <section className={styles.headerSection}>
          <h1 className={styles.title}>Membership Tiers</h1>
          <p className={styles.subtitle}>
            Discover a curated path to your life partner. Choose the perfect plan for a lifelong commitment and professional matrimonial service.
          </p>
        </section>

        {/* 2. Pricing Cards Row */}
        <section className={styles.pricingSection}>
          {pricingPlans.map((plan) => (
            <div
              key={plan.id}
              className={`${styles.card} ${plan.featured ? styles.premiumCard : ''} ${plan.dark ? styles.eliteCard : ''}`}
            >
              {plan.featured && <div className={styles.bestValueBadge}>BEST VALUE</div>}
              <h2 className={styles.cardLabel}>{plan.name}</h2>
              <span className={styles.cardTagline}>{plan.tagline}</span>
              
              <div className={styles.priceWrapper}>
                <span className={styles.price}>{plan.price}</span>
                <span className={styles.priceSuffix}>{plan.duration}</span>
              </div>

              <ul className={styles.featureList}>
                {plan.features.map((feature, idx) => (
                  <li
                    key={idx}
                    className={`${styles.featureItem} ${!feature.active ? styles.inactiveFeature : ''}`}
                  >
                    {feature.active ? (
                      <span className={styles.checkIcon}>✓</span>
                    ) : (
                      <span className={styles.dashIcon}>—</span>
                    )}
                    {feature.text}
                  </li>
                ))}
              </ul>

              <button
                className={`${styles.selectBtn} ${plan.btnClass}`}
                onClick={() => handleSelect(plan.name)}
              >
                {plan.buttonText}
              </button>
            </div>
          ))}
        </section>

        {/* 3. Detailed Comparison Table */}
        <section className={styles.comparisonSection}>
          <h2 className={styles.comparisonTitle}>Detailed Comparison</h2>
          <p className={styles.comparisonSubtitle}>Find the specific features tailored to your journey</p>
          
          <div className={styles.tableWrapper}>
            <table className={styles.table}>
              <thead>
                <tr>
                  <th className={`${styles.th} ${styles.thFirst}`}>Features</th>
                  <th className={styles.th}>Basic</th>
                  <th className={`${styles.th} ${styles.thPremium}`}>Premium</th>
                  <th className={`${styles.th} ${styles.thElite}`}>Elite</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td className={`${styles.td} ${styles.tdFirst}`}>Profile Visibility</td>
                  <td className={styles.td}>Standard</td>
                  <td className={`${styles.td} ${styles.textMaroon}`}>High Priority</td>
                  <td className={`${styles.td} ${styles.textElite}`}>Exclusive/Hidden</td>
                </tr>
                <tr>
                  <td className={`${styles.td} ${styles.tdFirst}`}>Interests Shared</td>
                  <td className={styles.td}>25 per month</td>
                  <td className={styles.td}>Unlimited</td>
                  <td className={styles.td}>Unlimited</td>
                </tr>
                <tr>
                  <td className={`${styles.td} ${styles.tdFirst}`}>Contact Views</td>
                  <td className={styles.td}>10 Total</td>
                  <td className={styles.td}>50 Total</td>
                  <td className={styles.td}>Unlimited</td>
                </tr>
                <tr>
                  <td className={`${styles.td} ${styles.tdFirst}`}>Matchmaker Support</td>
                  <td className={styles.td}>—</td>
                  <td className={styles.td}>Chat & Email</td>
                  <td className={`${styles.td} ${styles.textMaroon}`}>Dedicated Specialist</td>
                </tr>
                <tr>
                  <td className={`${styles.td} ${styles.tdFirst}`}>Verification</td>
                  <td className={styles.td}>Self</td>
                  <td className={styles.td}>Background Check</td>
                  <td className={styles.td}>Full Audit</td>
                </tr>
                <tr>
                  <td className={`${styles.td} ${styles.tdFirst}`}>Relationship Manager</td>
                  <td className={styles.td}>—</td>
                  <td className={styles.td}>—</td>
                  <td className={styles.td}><span className={styles.starIcon}>★</span></td>
                </tr>
              </tbody>
            </table>
          </div>
        </section>

        {/* 4. Trust Badges Row */}
        <section className={styles.trustSection}>
          <div className={styles.trustBadge}>
            <svg className={styles.trustIcon} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
              <path d="M9 12l2 2 4-4" />
            </svg>
            <div className={styles.trustText}>
              <span className={styles.trustLabel}>100% VERIFIED</span>
              <span className={styles.trustSub}>All profiles are audited</span>
            </div>
          </div>
          <div className={`${styles.trustBadge} ${styles.trustBadgeGold}`}>
            <svg className={styles.trustIcon} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
              <path d="M7 11V7a5 5 0 0 1 10 0v4" />
            </svg>
            <div className={styles.trustText}>
              <span className={styles.trustLabel}>SECURE PAYMENTS</span>
              <span className={styles.trustSub}>SSL Encrypted Transactions</span>
            </div>
          </div>
          <div className={styles.trustBadge}>
            <svg className={styles.trustIcon} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
            </svg>
            <div className={styles.trustText}>
              <span className={styles.trustLabel}>PRIVACY FIRST</span>
              <span className={styles.trustSub}>Your data remains confidential</span>
            </div>
          </div>
        </section>

        {/* 5. FAQ Section */}
        <section className={styles.faqSection}>
          <div className={styles.faqContainer}>
            <h2 className={styles.faqTitle}>Frequently Asked Questions</h2>
            <div className={styles.faqList}>
              {faqs.map((faq, index) => (
                <div
                  key={index}
                  className={`${styles.faqItem} ${openFaq === index ? styles.faqItemOpen : ''}`}
                >
                  <button
                    className={styles.faqHeader}
                    onClick={() => setOpenFaq(openFaq === index ? -1 : index)}
                  >
                    <span className={styles.faqQuestion}>{faq.question}</span>
                    <span className={styles.faqChevron}>∨</span>
                  </button>
                  <div className={styles.faqBody}>
                    <p className={styles.faqAnswer}>{faq.answer}</p>
                  </div>
                </div>
              ))}
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
              Redefining traditional matchmaking through modern prestige and exclusive connections.
            </p>
          </div>
          <div>
            <h4 className={styles.footerColHead}>Quick Links</h4>
            <ul className={styles.footerLinks}>
              <li className={styles.footerLinkItem}><a href="#membership" className={styles.footerLink}>Membership</a></li>
              <li className={styles.footerLinkItem}><a href="#success" className={styles.footerLink}>Success Stories</a></li>
              <li className={styles.footerLinkItem}><a href="#safety" className={styles.footerLink}>Safety Tips</a></li>
              <li className={styles.footerLinkItem}><a href="#faq" className={styles.footerLink}>FAQ</a></li>
            </ul>
          </div>
          <div>
            <h4 className={styles.footerColHead}>Legal</h4>
            <ul className={styles.footerLinks}>
              <li className={styles.footerLinkItem}><a href="#privacy" className={styles.footerLink}>Privacy Policy</a></li>
              <li className={styles.footerLinkItem}><a href="#terms" className={styles.footerLink}>Terms of Service</a></li>
              <li className={styles.footerLinkItem}><a href="#cookie" className={styles.footerLink}>Cookie Policy</a></li>
              <li className={styles.footerLinkItem}><a href="#grievance" className={styles.footerLink}>Grievance Redressal</a></li>
            </ul>
          </div>
          <div>
            <h4 className={styles.footerColHead}>Contact</h4>
            <div className={styles.footerContact}>
              <div className={styles.footerContactItem}>
                <span className={styles.footerIcon}>✉</span> support@heritageelite.com
              </div>
              <div className={styles.footerContactItem}>
                <span className={styles.footerIcon}>📞</span> 1-800-PRESTIGE
              </div>
              <div className={styles.footerContactItem}>
                <span className={styles.footerIcon}>🌐</span> Worldwide Support
              </div>
            </div>
          </div>
        </div>
        <div className={styles.footerBottom}>
          <p className={styles.footerCopyright}>
            © 2024 MilanSetu. All rights reserved. Designed for the discerning.
          </p>
        </div>
      </footer>
    </div>
  );
}
