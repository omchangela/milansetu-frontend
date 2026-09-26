import { useState, useRef } from 'react';
import styles from '../styles/register_page.module.css';
import loginCouple from '../../../assets/User_end_assets/login_couple.png';
import { useAuth } from '../../../context/AuthContext';

const TOTAL_STEPS = 4;

const STEP_META = [
  { step: 1, title: 'Personal Details',    subtitle: 'Basic Information' },
  { step: 2, title: 'Family Information',  subtitle: 'Your Family Background' },
  { step: 3, title: 'Career & Education',  subtitle: 'Professional Details' },
  { step: 4, title: 'Horoscope & Kundali', subtitle: 'Astrological Details' },
];

const RELIGIONS       = ['Hindu', 'Muslim', 'Christian', 'Sikh', 'Jain', 'Buddhist', 'Parsi', 'Other'];
const LANGUAGES       = ['Hindi', 'English', 'Tamil', 'Telugu', 'Kannada', 'Malayalam', 'Marathi', 'Bengali', 'Gujarati', 'Punjabi', 'Other'];
const MARITAL_STATUSES = ['Never Married', 'Divorced', 'Widowed', 'Awaiting Divorce'];
const FAMILY_VALUES   = ['Traditional', 'Moderate', 'Liberal'];
const INCOME_UNITS    = ['LPA', 'USD/yr', 'GBP/yr'];
const ZODIAC_SIGNS    = ['Aries', 'Taurus', 'Gemini', 'Cancer', 'Leo', 'Virgo', 'Libra', 'Scorpio', 'Sagittarius', 'Capricorn', 'Aquarius', 'Pisces'];
const MANGLIK         = ['Non-Manglik', 'Manglik', 'Partial Manglik'];

export default function RegisterPage() {
  const { register } = useAuth();

  const [currentStep, setCurrentStep] = useState(1);
  const [gender, setGender] = useState('female');
  const [profilePhoto, setProfilePhoto] = useState(null);
  const [photoPreview, setPhotoPreview] = useState(null);
  const photoInputRef = useRef(null);
  const [apiError, setApiError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const [formData, setFormData] = useState({
    // Step 1 — Personal Details
    full_name: '',
    age: '',
    date_of_birth: '',
    height_cm: '',
    religion: '',
    mother_tongue: '',
    marital_status: '',
    mobile: '',
    countryCode: '+91',
    email: '',
    password: '',
    confirm_password: '',

    // Step 2 — Family
    father_occupation: '',
    mother_occupation: '',
    siblings_count: '',
    siblings_details: '',
    family_values: '',

    // Step 3 — Career
    industry: '',
    education: '',
    current_designation: '',
    current_company: '',
    annual_income_min: '',
    annual_income_max: '',
    income_unit: 'LPA',

    // Step 4 — Horoscope
    time_of_birth: '',
    birth_place: '',
    zodiac_sign: '',
    manglik_status: '',
    kundali_url: '',
  });

  const set = (field, value) => setFormData(prev => ({ ...prev, [field]: value }));

  const handlePhotoChange = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setProfilePhoto(file);
    setPhotoPreview(URL.createObjectURL(file));
  };

  const handleNext = async (e) => {
    e.preventDefault();
    setApiError('');

    if (currentStep < TOTAL_STEPS) {
      setCurrentStep(s => s + 1);
      document.querySelector(`.${styles.leftPanel}`)?.scrollTo(0, 0);
      return;
    }

    // Final step — submit to API
    setSubmitting(true);

    // Build payload matching the backend SignupSerializer fields
    const payload = {
      email: formData.email.trim().toLowerCase(),
      password: formData.password,
      confirm_password: formData.confirm_password,
      phone: formData.mobile ? `${formData.countryCode}${formData.mobile}` : undefined,

      // Profile fields
      full_name: formData.full_name || undefined,
      age: formData.age ? Number(formData.age) : undefined,
      date_of_birth: formData.date_of_birth || undefined,
      height_cm: formData.height_cm ? Number(formData.height_cm) : undefined,
      religion: formData.religion || undefined,
      mother_tongue: formData.mother_tongue || undefined,
      marital_status: formData.marital_status || undefined,
      father_occupation: formData.father_occupation || undefined,
      mother_occupation: formData.mother_occupation || undefined,
      siblings_count: formData.siblings_count ? Number(formData.siblings_count) : undefined,
      siblings_details: formData.siblings_details || undefined,
      family_values: formData.family_values || undefined,
      industry: formData.industry || undefined,
      education: formData.education || undefined,
      current_designation: formData.current_designation || undefined,
      current_company: formData.current_company || undefined,
      annual_income_min: formData.annual_income_min ? Number(formData.annual_income_min) : undefined,
      annual_income_max: formData.annual_income_max ? Number(formData.annual_income_max) : undefined,
      income_unit: formData.income_unit || undefined,
      time_of_birth: formData.time_of_birth || undefined,
      birth_place: formData.birth_place || undefined,
      zodiac_sign: formData.zodiac_sign || undefined,
      manglik_status: formData.manglik_status || undefined,
      kundali_url: formData.kundali_url || undefined,
    };

    // Remove undefined keys so DRF doesn't complain
    Object.keys(payload).forEach(k => payload[k] === undefined && delete payload[k]);

    const { error } = await register(payload, profilePhoto || null);
    setSubmitting(false);

    if (error) {
      setApiError(error);
      return;
    }

    window.location.hash = '#dashboard';
  };

  const handleBack = () => {
    if (currentStep > 1) setCurrentStep(s => s - 1);
  };

  const meta = STEP_META[currentStep - 1];
  const progress = (currentStep / TOTAL_STEPS) * 100;

  return (
    <div className={styles.registerContainer}>
      {/* ── LEFT PANEL ─────────────────────────────── */}
      <div className={styles.leftPanel}>

        <div className={styles.personalDetailsHeader}>
          <h2>{meta.title}</h2>
          <div className={styles.stepIndicator}>
            <div className={styles.stepCircle}>{currentStep}</div>
            <span>Step {currentStep} of {TOTAL_STEPS}: {meta.subtitle}</span>
          </div>
          <div className={styles.progressTrack}>
            <div className={styles.progressFill} style={{ width: `${progress}%` }} />
          </div>
          <div className={styles.stepDots}>
            {STEP_META.map(s => (
              <div
                key={s.step}
                className={`${styles.stepDot} ${currentStep >= s.step ? styles.stepDotActive : ''}`}
              />
            ))}
          </div>
        </div>

        {apiError && (
          <div className={styles.apiError} role="alert">
            {apiError}
          </div>
        )}

        <form onSubmit={handleNext}>

          {/* ── STEP 1: Personal Details ── */}
          {currentStep === 1 && (
            <>
              <div className={styles.formRow}>
                <div className={styles.formGroup}>
                  <label className={styles.label}>Full Name <span className={styles.req}>*</span></label>
                  <input className={styles.input} type="text" placeholder="e.g. Rahul Sharma"
                    value={formData.full_name} onChange={e => set('full_name', e.target.value)} required />
                </div>
                <div className={styles.formGroup}>
                  <label className={styles.label}>Age <span className={styles.req}>*</span></label>
                  <input className={styles.input} type="number" placeholder="e.g. 28" min="18" max="70"
                    value={formData.age} onChange={e => set('age', e.target.value)} required />
                </div>
              </div>

              <div className={styles.formGroup}>
                <label className={styles.label}>Gender <span className={styles.req}>*</span></label>
                <div className={styles.genderToggle}>
                  {['male', 'female'].map(g => (
                    <button key={g} type="button"
                      className={`${styles.genderBtn} ${gender === g ? styles.genderBtnActive : ''}`}
                      onClick={() => setGender(g)}>
                      {g.charAt(0).toUpperCase() + g.slice(1)}
                    </button>
                  ))}
                </div>
              </div>

              <div className={styles.formRow}>
                <div className={styles.formGroup}>
                  <label className={styles.label}>Date of Birth <span className={styles.req}>*</span></label>
                  <input className={styles.input} type="date"
                    value={formData.date_of_birth} onChange={e => set('date_of_birth', e.target.value)} required />
                </div>
                <div className={styles.formGroup}>
                  <label className={styles.label}>Height (cm)</label>
                  <input className={styles.input} type="number" placeholder="e.g. 170" min="120" max="230"
                    value={formData.height_cm} onChange={e => set('height_cm', e.target.value)} />
                </div>
              </div>

              <div className={styles.formRow}>
                <div className={styles.formGroup}>
                  <label className={styles.label}>Religion</label>
                  <select className={styles.input} value={formData.religion} onChange={e => set('religion', e.target.value)}>
                    <option value="">Select Religion</option>
                    {RELIGIONS.map(r => <option key={r}>{r}</option>)}
                  </select>
                </div>
                <div className={styles.formGroup}>
                  <label className={styles.label}>Mother Tongue</label>
                  <select className={styles.input} value={formData.mother_tongue} onChange={e => set('mother_tongue', e.target.value)}>
                    <option value="">Select Language</option>
                    {LANGUAGES.map(l => <option key={l}>{l}</option>)}
                  </select>
                </div>
              </div>

              <div className={styles.formGroup}>
                <label className={styles.label}>Marital Status</label>
                <div className={styles.pillGroup}>
                  {MARITAL_STATUSES.map(m => (
                    <button key={m} type="button"
                      className={`${styles.pill} ${formData.marital_status === m ? styles.pillActive : ''}`}
                      onClick={() => set('marital_status', m)}>{m}</button>
                  ))}
                </div>
              </div>

              <div className={styles.formGroup}>
                <label className={styles.label}>
                  Profile Photo <span className={styles.optional}>(recommended)</span>
                </label>
                <input
                  ref={photoInputRef}
                  type="file"
                  accept="image/jpeg,image/png,image/webp"
                  className={styles.hiddenFileInput}
                  onChange={handlePhotoChange}
                />
                <div className={styles.photoUploadRow}>
                  {photoPreview ? (
                    <img src={photoPreview} alt="Preview" className={styles.photoPreview} />
                  ) : (
                    <div className={styles.photoPlaceholder}>📷</div>
                  )}
                  <button
                    type="button"
                    className={styles.photoUploadBtn}
                    onClick={() => photoInputRef.current?.click()}
                  >
                    {profilePhoto ? 'Change Photo' : 'Upload Photo'}
                  </button>
                </div>
                <p className={styles.fieldHint}>
                  Clear portrait, JPEG/PNG/WebP, max 5 MB. Passed through sensitivity check on upload.
                </p>
              </div>

              <div className={styles.formGroup}>
                <label className={styles.label}>Mobile Number <span className={styles.req}>*</span></label>
                <div className={styles.phoneInputWrapper}>
                  <select className={`${styles.input} ${styles.countryCode}`}
                    value={formData.countryCode} onChange={e => set('countryCode', e.target.value)}>
                    <option value="+91">+91</option>
                    <option value="+1">+1</option>
                    <option value="+44">+44</option>
                    <option value="+61">+61</option>
                    <option value="+971">+971</option>
                  </select>
                  <input className={styles.input} type="tel" placeholder="00000 00000"
                    value={formData.mobile} onChange={e => set('mobile', e.target.value)} required />
                </div>
              </div>

              <div className={styles.formGroup}>
                <label className={styles.label}>Email Address <span className={styles.req}>*</span></label>
                <input className={styles.input} type="email" placeholder="rahul@example.com"
                  value={formData.email} onChange={e => set('email', e.target.value)} required />
              </div>

              <div className={styles.formRow}>
                <div className={styles.formGroup}>
                  <label className={styles.label}>Password <span className={styles.req}>*</span></label>
                  <input className={styles.input} type="password" placeholder="Min 8 characters"
                    value={formData.password} onChange={e => set('password', e.target.value)}
                    minLength={8} required />
                </div>
                <div className={styles.formGroup}>
                  <label className={styles.label}>Confirm Password <span className={styles.req}>*</span></label>
                  <input className={styles.input} type="password" placeholder="Re-enter password"
                    value={formData.confirm_password} onChange={e => set('confirm_password', e.target.value)}
                    minLength={8} required />
                </div>
              </div>
            </>
          )}

          {/* ── STEP 2: Family Information ── */}
          {currentStep === 2 && (
            <>
              <div className={styles.formRow}>
                <div className={styles.formGroup}>
                  <label className={styles.label}>Father's Occupation</label>
                  <input className={styles.input} type="text" placeholder="e.g. Business Owner"
                    value={formData.father_occupation} onChange={e => set('father_occupation', e.target.value)} />
                </div>
                <div className={styles.formGroup}>
                  <label className={styles.label}>Mother's Occupation</label>
                  <input className={styles.input} type="text" placeholder="e.g. Homemaker"
                    value={formData.mother_occupation} onChange={e => set('mother_occupation', e.target.value)} />
                </div>
              </div>

              <div className={styles.formRow}>
                <div className={styles.formGroup}>
                  <label className={styles.label}>Number of Siblings</label>
                  <input className={styles.input} type="number" placeholder="e.g. 2" min="0" max="10"
                    value={formData.siblings_count} onChange={e => set('siblings_count', e.target.value)} />
                </div>
                <div className={styles.formGroup}>
                  <label className={styles.label}>Siblings Details</label>
                  <input className={styles.input} type="text" placeholder="e.g. 1 Brother (Married)"
                    value={formData.siblings_details} onChange={e => set('siblings_details', e.target.value)} />
                </div>
              </div>

              <div className={styles.formGroup}>
                <label className={styles.label}>Family Values</label>
                <div className={styles.pillGroup}>
                  {FAMILY_VALUES.map(v => (
                    <button key={v} type="button"
                      className={`${styles.pill} ${formData.family_values === v ? styles.pillActive : ''}`}
                      onClick={() => set('family_values', v)}>{v}</button>
                  ))}
                </div>
              </div>

              <div className={styles.infoBox}>
                <span className={styles.infoIcon}>ℹ</span>
                Family background helps us find highly compatible matches for you.
              </div>
            </>
          )}

          {/* ── STEP 3: Career & Education ── */}
          {currentStep === 3 && (
            <>
              <div className={styles.formRow}>
                <div className={styles.formGroup}>
                  <label className={styles.label}>Highest Education <span className={styles.req}>*</span></label>
                  <input className={styles.input} type="text" placeholder="e.g. B.Tech, IIT Delhi"
                    value={formData.education} onChange={e => set('education', e.target.value)} required />
                </div>
                <div className={styles.formGroup}>
                  <label className={styles.label}>Industry</label>
                  <input className={styles.input} type="text" placeholder="e.g. Technology"
                    value={formData.industry} onChange={e => set('industry', e.target.value)} />
                </div>
              </div>

              <div className={styles.formRow}>
                <div className={styles.formGroup}>
                  <label className={styles.label}>Current Designation</label>
                  <input className={styles.input} type="text" placeholder="e.g. Software Architect"
                    value={formData.current_designation} onChange={e => set('current_designation', e.target.value)} />
                </div>
                <div className={styles.formGroup}>
                  <label className={styles.label}>Current Company</label>
                  <input className={styles.input} type="text" placeholder="e.g. Google India"
                    value={formData.current_company} onChange={e => set('current_company', e.target.value)} />
                </div>
              </div>

              <div className={styles.formGroup}>
                <label className={styles.label}>Annual Income Range</label>
                <div className={styles.incomeRow}>
                  <input className={styles.input} type="number" placeholder="Min"
                    value={formData.annual_income_min} onChange={e => set('annual_income_min', e.target.value)} />
                  <span className={styles.incomeSep}>–</span>
                  <input className={styles.input} type="number" placeholder="Max"
                    value={formData.annual_income_max} onChange={e => set('annual_income_max', e.target.value)} />
                  <select className={`${styles.input} ${styles.incomeUnit}`}
                    value={formData.income_unit} onChange={e => set('income_unit', e.target.value)}>
                    {INCOME_UNITS.map(u => <option key={u}>{u}</option>)}
                  </select>
                </div>
              </div>
            </>
          )}

          {/* ── STEP 4: Horoscope ── */}
          {currentStep === 4 && (
            <>
              <div className={styles.formRow}>
                <div className={styles.formGroup}>
                  <label className={styles.label}>Time of Birth</label>
                  <input className={styles.input} type="time"
                    value={formData.time_of_birth} onChange={e => set('time_of_birth', e.target.value)} />
                </div>
                <div className={styles.formGroup}>
                  <label className={styles.label}>Birth Place</label>
                  <input className={styles.input} type="text" placeholder="e.g. Lucknow, UP"
                    value={formData.birth_place} onChange={e => set('birth_place', e.target.value)} />
                </div>
              </div>

              <div className={styles.formGroup}>
                <label className={styles.label}>Zodiac Sign</label>
                <div className={styles.pillGroup}>
                  {ZODIAC_SIGNS.map(z => (
                    <button key={z} type="button"
                      className={`${styles.pill} ${formData.zodiac_sign === z ? styles.pillActive : ''}`}
                      onClick={() => set('zodiac_sign', z)}>{z}</button>
                  ))}
                </div>
              </div>

              <div className={styles.formGroup}>
                <label className={styles.label}>Manglik Status</label>
                <div className={styles.pillGroup}>
                  {MANGLIK.map(m => (
                    <button key={m} type="button"
                      className={`${styles.pill} ${formData.manglik_status === m ? styles.pillActive : ''}`}
                      onClick={() => set('manglik_status', m)}>{m}</button>
                  ))}
                </div>
              </div>

              <div className={styles.formGroup}>
                <label className={styles.label}>
                  Kundali / Horoscope URL <span className={styles.optional}>(optional)</span>
                </label>
                <input className={styles.input} type="url" placeholder="https://link-to-your-kundali.com"
                  value={formData.kundali_url} onChange={e => set('kundali_url', e.target.value)} />
                <p className={styles.fieldHint}>You can share a link to your Kundali document.</p>
              </div>

              <div className={styles.infoBox}>
                <span className={styles.infoIcon}>✦</span>
                Horoscope details help our matchmakers suggest spiritually aligned profiles.
              </div>
            </>
          )}

          {/* ── Navigation Buttons ── */}
          <div className={styles.btnRow}>
            {currentStep > 1 && (
              <button type="button" className={styles.backBtn} onClick={handleBack}>
                ← Back
              </button>
            )}
            <button type="submit" className={styles.saveBtn} disabled={submitting}>
              {currentStep === TOTAL_STEPS
                ? (submitting ? 'Creating account…' : 'Complete Registration →')
                : 'Save & Continue →'}
            </button>
          </div>

        </form>
      </div>

      {/* ── RIGHT PANEL ─────────────────────────────── */}
      <div className={styles.rightPanel}>
        <h1 className={styles.showcaseHeading}>Begin Your Story of<br />Eternal Elegance</h1>

        <div className={styles.phoneMockupContainer}>
          <div className={styles.mockupContent}>
            <img src={loginCouple} alt="App Preview" className={styles.mockupImg} />
          </div>
        </div>

        <div className={styles.rightStepList}>
          {STEP_META.map(s => (
            <div key={s.step}
              className={`${styles.rightStep} ${currentStep === s.step ? styles.rightStepActive : ''} ${currentStep > s.step ? styles.rightStepDone : ''}`}>
              <div className={styles.rightStepNum}>{currentStep > s.step ? '✓' : s.step}</div>
              <span>{s.title}</span>
            </div>
          ))}
        </div>

        <div className={`${styles.floatingCard} ${styles.cardElite}`}>
          <div className={styles.cardIcon}>◆</div>
          <div className={styles.cardText}>
            <span className={styles.cardTag}>EXCLUSIVE</span>
            <span className={styles.cardLabel}>Elite Circle Access</span>
          </div>
        </div>

        <div className={`${styles.floatingCard} ${styles.cardVerified}`}>
          <div className={styles.cardIcon}>✓</div>
          <div className={styles.cardText}>
            <span className={styles.cardTag}>VERIFIED</span>
            <span className={styles.cardLabel}>100% Genuine</span>
          </div>
        </div>
      </div>
    </div>
  );
}
