import styles from '../pages/styles/membership_plans.module.css';

const plans = [
  {
    id: 'basic',
    name: 'Basic',
    subtitle: 'INTRODUCTION PACK',
    price: '₹5,000',
    duration: '/3mo',
    features: [
      '10 Express Interests',
      'Search filters access',
      'View 5 Contact Details',
    ],
    buttonText: 'SELECT PLAN',
    type: 'basic',
  },
  {
    id: 'premium',
    name: 'Premium',
    subtitle: 'ELITE EXPERIENCE',
    price: '₹12,500',
    duration: '/6mo',
    badge: 'MOST POPULAR',
    features: [
      'Unlimited Interests',
      'Profile Spotlight',
      'View 50 Contact Details',
      'Message Directly',
    ],
    buttonText: 'SELECT PLAN',
    type: 'premium',
  },
  {
    id: 'elite',
    name: 'Elite',
    subtitle: 'CONCIERGE ASSISTED',
    price: '₹45,000',
    duration: '/yr',
    features: [
      'Personal Relationship Mgr',
      'Exclusive Offline Matches',
      'Background Verifications',
      '1-on-1 Meeting Support',
    ],
    buttonText: 'SELECT PLAN',
    type: 'elite',
  },
];

export default function MembershipPlans() {
  return (
    <section className={styles.section} id="membership">
      <div className={styles.container}>
        <h2 className={styles.title}>
          Membership <span className={styles.titleAccent}>Tiers</span>
        </h2>

        <div className={styles.grid}>
          {plans.map((plan) => (
            <div key={plan.id} className={`${styles.cardWrapper} ${styles[plan.type + 'Wrapper']}`}>
              {plan.type === 'premium' && <div className={styles.shadowCard}></div>}
              <div className={`${styles.card} ${styles[plan.type + 'Card']}`}>
                {plan.badge && <div className={styles.badge}>{plan.badge}</div>}
                
                <div className={styles.cardHeader}>
                  <h3 className={styles.planName}>{plan.name}</h3>
                  <span className={styles.planSubtitle}>{plan.subtitle}</span>
                </div>

                <div className={styles.priceBlock}>
                  <span className={styles.price}>{plan.price}</span>
                  <span className={styles.duration}>{plan.duration}</span>
                </div>

                <ul className={styles.featureList}>
                  {plan.features.map((feature, index) => (
                    <li key={index} className={styles.featureItem}>
                      <span className={styles.checkCircle}>
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                          <polyline points="20 6 9 17 4 12" />
                        </svg>
                      </span>
                      {feature}
                    </li>
                  ))}
                </ul>

                <button type="button" className={styles.button}>
                  {plan.buttonText}
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
