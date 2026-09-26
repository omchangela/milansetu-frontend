import { useState } from 'react';
import Header from '../../components/Header';
import styles from '../styles/contact_page.module.css';
import contactHeroBg from '../../../assets/User_end_assets/contact_Hero Section.jpg';

export default function ContactPage() {
  const [form, setForm] = useState({
    name: '',
    email: '',
    phone: '',
    method: 'Phone Call',
    message: ''
  });

  const [errors, setErrors] = useState({});
  const [submitted, setSubmitted] = useState(false);

  const validate = () => {
    const newErrors = {};
    if (!form.name.trim()) newErrors.name = 'Name is required';
    if (!form.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) {
      newErrors.email = 'Invalid email address';
    }
    if (!form.phone.trim()) newErrors.phone = 'Phone is required';
    if (!form.message.trim()) newErrors.message = 'Message is required';
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = () => {
    if (validate()) {
      setSubmitted(true);
      console.log('Form Submitted:', form);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors(prev => {
        const next = { ...prev };
        delete next[name];
        return next;
      });
    }
  };

  return (
    <div className={styles.page}>
      <Header />

      <main>
        {/* 1. Hero Section */}
        <section className={styles.hero}>
          <img src={contactHeroBg} alt="Contact us background" className={styles.heroBg} aria-hidden="true" />
          <div className={styles.heroOverlay} aria-hidden="true" />

          <div className={styles.heroContent}>
            <span className={styles.heroBadge}>GLOBAL CONCIERGE</span>
            <h1 className={styles.heroHeading}>We're Here to Guide Your Journey.</h1>
            <p className={styles.heroSubtext}>
              Connecting heritage with destiny. Our dedicated relationship managers 
              are available around the clock to assist our elite members.
            </p>
          </div>
        </section>

        {/* 2. Main Content Row */}
        <section className={styles.mainContent}>
          {/* LEFT COLUMN - Form */}
          <div className={styles.leftColumn}>
            <div className={styles.formCard}>
              {submitted ? (
                <div className={styles.successBlock}>
                  <div className={styles.successIcon}>✓</div>
                  <p className={styles.successMsg}>
                    Your inquiry has been received. A concierge will reach out within 24 hours.
                  </p>
                </div>
              ) : (
                <>
                  <h2 className={styles.formHeading}>Send an Inquiry</h2>
                  <p className={styles.formSubtext}>
                    Confidentiality and precision are the cornerstones of our service.
                  </p>

                  <div className={styles.formRow}>
                    <div className={styles.formField}>
                      <label className={styles.fieldLabel}>NAME</label>
                      <input 
                        name="name"
                        placeholder="Your full name" 
                        className={`${styles.input} ${errors.name ? styles.fieldError : ''}`}
                        value={form.name}
                        onChange={handleChange}
                      />
                      {errors.name && <span className={styles.errorText}>{errors.name}</span>}
                    </div>
                    <div className={styles.formField}>
                      <label className={styles.fieldLabel}>EMAIL</label>
                      <input 
                        name="email"
                        type="email"
                        placeholder="example@heritage.com" 
                        className={`${styles.input} ${errors.email ? styles.fieldError : ''}`}
                        value={form.email}
                        onChange={handleChange}
                      />
                      {errors.email && <span className={styles.errorText}>{errors.email}</span>}
                    </div>
                  </div>

                  <div className={styles.formRow}>
                    <div className={styles.formField}>
                      <label className={styles.fieldLabel}>PHONE</label>
                      <input 
                        name="phone"
                        type="tel"
                        placeholder="+91 XXXX XXX XXX" 
                        className={`${styles.input} ${errors.phone ? styles.fieldError : ''}`}
                        value={form.phone}
                        onChange={handleChange}
                      />
                      {errors.phone && <span className={styles.errorText}>{errors.phone}</span>}
                    </div>
                    <div className={styles.formField}>
                      <label className={styles.fieldLabel}>PREFERRED CONTACT METHOD</label>
                      <div className={styles.selectWrap}>
                        <select 
                          name="method"
                          className={styles.select}
                          value={form.method}
                          onChange={handleChange}
                        >
                          <option>Phone Call</option>
                          <option>Email</option>
                          <option>WhatsApp</option>
                          <option>Video Call</option>
                        </select>
                        <span className={styles.selectChevron}>∨</span>
                      </div>
                    </div>
                  </div>

                  <div className={styles.formField}>
                    <label className={styles.fieldLabel}>MESSAGE</label>
                    <textarea 
                      name="message"
                      placeholder="How can our concierge assist you?" 
                      className={`${styles.textarea} ${errors.message ? styles.fieldError : ''}`}
                      value={form.message}
                      onChange={handleChange}
                    />
                    {errors.message && <span className={styles.errorText}>{errors.message}</span>}
                  </div>

                  <button className={styles.submitBtn} onClick={handleSubmit}>
                    SUBMIT INQUIRY
                  </button>
                </>
              )}
            </div>
          </div>

          {/* RIGHT COLUMN - Cards */}
          <div className={styles.rightColumn}>
            {/* Card A - Direct Channels */}
            <div className={`${styles.infoCard} ${styles.navyCard}`}>
              <h3 className={styles.cardHeading}>Direct Channels</h3>
              <div className={styles.infoList}>
                <div className={styles.infoItem}>
                  <div className={styles.infoIcon}>🛡️</div>
                  <div className={styles.infoContent}>
                    <span className={styles.infoLabel}>PREMIUM CONCIERGE</span>
                    <span className={`${styles.infoValue} ${styles.goldValue}`}>
                      elite@heritage-matrimony.com
                    </span>
                  </div>
                </div>
                <div className={styles.infoItem}>
                  <div className={styles.infoIcon}>📞</div>
                  <div className={styles.infoContent}>
                    <span className={styles.infoLabel}>SUPPORT LINE</span>
                    <span className={styles.infoValue}>+91 22 4567 8900</span>
                    <span className={styles.infoValue}>+91 22 4567 8901</span>
                  </div>
                </div>
                <div className={styles.infoItem}>
                  <div className={styles.infoIcon}>📍</div>
                  <div className={styles.infoContent}>
                    <span className={styles.infoLabel}>HEAD OFFICE</span>
                    <span className={styles.infoValue}>
                      Level 24, Heritage Tower, Marine Drive, Mumbai 400021
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Card B - Support Hours */}
            <div className={`${styles.infoCard} ${styles.whiteCard}`}>
              <div className={styles.hoursHeader}>
                <span className={styles.hoursIcon}>🕒</span>
                <h3 className={styles.cardHeading} style={{margin:0}}>Support Hours</h3>
              </div>
              <p className={styles.hoursText}>
                We provide 24/7 dedicated support for our Elite and Diamond members 
                across all time zones.
              </p>
              <div className={styles.statusRow}>
                <span className={styles.statusDot}></span>
                <span className={styles.statusText}>Concierge currently active</span>
              </div>
            </div>

            {/* Card C - Map Preview */}
            <div className={styles.mapCard}>
              <svg className={styles.mapGrid} viewBox="0 0 200 200">
                <defs>
                  <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
                    <path d="M 40 0 L 0 0 0 40" fill="none" stroke="rgba(201,168,76,0.2)" strokeWidth="0.5"/>
                  </pattern>
                </defs>
                <rect width="100%" height="100%" fill="url(#grid)" />
                <path d="M 0 50 L 200 50 M 0 120 L 200 120 M 60 0 L 60 200 M 150 0 L 150 200" stroke="rgba(201,168,76,0.2)" strokeWidth="1" />
              </svg>
              <div className={styles.mapPin}>📍</div>
              <button 
                className={styles.mapBtn}
                onClick={() => window.open('https://maps.google.com/?q=Heritage+Tower+Marine+Drive+Mumbai', '_blank')}
              >
                📍 View on Google Maps
              </button>
            </div>
          </div>
        </section>
      </main>

      {/* 3. Footer */}
      <footer className={styles.footer}>
        <div className={styles.footerGrid}>
          <div>
            <div className={styles.footerBrand}>MilanSetu</div>
            <p className={styles.footerTagline}>
              Redefining elite matchmaking for the modern world with respect for tradition.
            </p>
          </div>
          <div>
            <h4 className={styles.footerColHead}>LEGAL</h4>
            <ul className={styles.footerLinks}>
              <li className={styles.footerLinkItem}><a href="#privacy" className={styles.footerLink}>Privacy Policy</a></li>
              <li className={styles.footerLinkItem}><a href="#terms" className={styles.footerLink}>Terms of Service</a></li>
              <li className={styles.footerLinkItem}><a href="#cookie" className={styles.footerLink}>Cookie Policy</a></li>
            </ul>
          </div>
          <div>
            <h4 className={styles.footerColHead}>ASSISTANCE</h4>
            <ul className={styles.footerLinks}>
              <li className={styles.footerLinkItem}><a href="#grievance" className={styles.footerLink}>Grievance Redressal</a></li>
              <li className={styles.footerLinkItem}><a href="#safety" className={styles.footerLink}>Safety Tips</a></li>
              <li className={styles.footerLinkItem}><a href="#faq" className={styles.footerLink}>FAQ</a></li>
            </ul>
          </div>
          <div>
            <h4 className={styles.footerColHead}>STAY CONNECTED</h4>
            <div className={styles.socialRow}>
              <span className={styles.socialIcon}>🔗</span>
              <span className={styles.socialIcon}>✉️</span>
              <span className={styles.socialIcon}>🌐</span>
            </div>
            <p className={styles.appText}>Download our exclusive concierge app.</p>
          </div>
        </div>
        <div className={styles.footerBottom}>
          <p className={styles.copyright}>
            © 2024 Heritage Elite Matrimony. All rights reserved. Designed for the discerning.
          </p>
          <span className={styles.footerTag}>A LEGACY OF LOVE</span>
        </div>
      </footer>
    </div>
  );
}
