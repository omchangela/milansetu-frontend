import React, { useState, useEffect, useRef } from 'react';
import styles from '../styles/my_profile_page.module.css';
import Sidebar from '../../components/Sidebar';
import TopBar from '../../components/TopBar';
import AuthenticatedImage from '../../../components/AuthenticatedImage';
import { useAuth } from '../../../context/AuthContext';
import {
  fetchGallery,
  uploadGalleryImage,
  deleteGalleryImage,
  setGalleryProfilePhoto,
} from '../../../api/auth';
import { getIdealPartnerPreferences, getProfileAvatar, getProfilePhotoUrl, BASIC_IDEAL_PARTNER_KEYS, PREMIUM_IDEAL_PARTNER_KEYS } from '../../../utils/profileHelpers';

// ── Inline SVG icons (unchanged) ─────────────────────────────────────────────
const Icons = {
  Pencil: () => (
    <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M17 3a2.828 2.828 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5L17 3z" />
    </svg>
  ),
  Share: () => (
    <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2">
      <circle cx="18" cy="5" r="3" /><circle cx="6" cy="12" r="3" /><circle cx="18" cy="19" r="3" />
      <line x1="8.59" y1="13.51" x2="15.42" y2="17.49" /><line x1="15.41" y1="6.51" x2="8.59" y2="10.49" />
    </svg>
  ),
  Pin: () => (
    <svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" /><circle cx="12" cy="10" r="3" />
    </svg>
  ),
  SearchSmall: () => (
    <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2">
      <circle cx="11" cy="11" r="8" /><line x1="21" y1="21" x2="16.65" y2="16.65" />
    </svg>
  ),
  Star: () => (
    <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2">
      <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
    </svg>
  ),
  Users: () => (
    <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" /><circle cx="9" cy="7" r="4" />
      <path d="M23 21v-2a4 4 0 0 0-3-3.87" /><path d="M16 3.13a4 4 0 0 1 0 7.75" />
    </svg>
  ),
  Profile: () => (
    <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" /><circle cx="12" cy="7" r="4" />
    </svg>
  ),
  Dashboard: () => (
    <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2">
      <rect x="3" y="3" width="7" height="7" /><rect x="14" y="3" width="7" height="7" />
      <rect x="14" y="14" width="7" height="7" /><rect x="3" y="14" width="7" height="7" />
    </svg>
  ),
  Briefcase: () => (
    <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2">
      <rect x="2" y="7" width="20" height="14" rx="2" ry="2" />
      <path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16" />
    </svg>
  ),
  Graduation: () => (
    <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M22 10L12 5L2 10L12 15L22 10Z" /><path d="M6 12V17L12 20L18 17V12" />
    </svg>
  ),
  Moon: () => (
    <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" />
    </svg>
  ),
  Save: () => (
    <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z" />
      <polyline points="17 21 17 13 7 13 7 21" /><polyline points="7 3 7 8 15 8" />
    </svg>
  ),
  Close: () => (
    <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2">
      <line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" />
    </svg>
  ),
  Camera: () => (
    <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z" />
      <circle cx="12" cy="13" r="4" />
    </svg>
  ),
};

const PROFILE_TABS = [
  { id: 'overview', label: 'Overview' },
  { id: 'personal', label: 'Personal Details' },
  { id: 'family', label: 'Family' },
  { id: 'career', label: 'Education & Career' },
  { id: 'horoscope', label: 'Horoscope' },
  { id: 'partner', label: 'Partner Preferences' },
  { id: 'photos', label: 'Photo Gallery' },
];

const MEMBERSHIP_LABELS = {
  basic: 'Basic Member',
  silver: 'Silver Member',
  gold: 'Gold Member',
  platinum: 'Platinum Member',
};

// ── Edit Partner Preferences Modal ────────────────────────────────────────────
function EditPartnerModal({ idealPartner, account, onClose, onSave }) {
  const isPremium = account?.is_premium ?? false;

  const buildInitialFields = () => {
    const base = {
      age_min: idealPartner?.age_min ?? '',
      age_max: idealPartner?.age_max ?? '',
      height_min_cm: idealPartner?.height_min_cm ?? '',
      height_max_cm: idealPartner?.height_max_cm ?? '',
      religion: idealPartner?.religion || '',
      location: idealPartner?.location || '',
    };
    if (!isPremium) return base;
    return {
      ...base,
      mother_tongue: idealPartner?.mother_tongue || '',
      marital_status: idealPartner?.marital_status || '',
      education: idealPartner?.education || '',
      industry: idealPartner?.industry || '',
      min_income: idealPartner?.min_income ?? '',
      max_income: idealPartner?.max_income ?? '',
      income_unit: idealPartner?.income_unit || '',
      manglik_status: idealPartner?.manglik_status || '',
      family_values: idealPartner?.family_values || '',
    };
  };

  const [fields, setFields] = useState(buildInitialFields);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  const set = (k, v) => setFields((f) => ({ ...f, [k]: v }));

  const basicFields = [
    { label: 'Min Age', key: 'age_min', type: 'number' },
    { label: 'Max Age', key: 'age_max', type: 'number' },
    { label: 'Min Height (cm)', key: 'height_min_cm', type: 'number' },
    { label: 'Max Height (cm)', key: 'height_max_cm', type: 'number' },
    { label: 'Religion', key: 'religion', type: 'text' },
    { label: 'Location', key: 'location', type: 'text' },
  ];

  const premiumFields = [
    { label: 'Mother Tongue', key: 'mother_tongue', type: 'text' },
    { label: 'Marital Status', key: 'marital_status', type: 'text' },
    { label: 'Education', key: 'education', type: 'text' },
    { label: 'Industry', key: 'industry', type: 'text' },
    { label: 'Min Income', key: 'min_income', type: 'number' },
    { label: 'Max Income', key: 'max_income', type: 'number' },
    { label: 'Income Unit', key: 'income_unit', type: 'text' },
    { label: 'Manglik Status', key: 'manglik_status', type: 'text' },
    { label: 'Family Values', key: 'family_values', type: 'text' },
  ];

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSaving(true);

    const allowedKeys = isPremium
      ? [...BASIC_IDEAL_PARTNER_KEYS, ...PREMIUM_IDEAL_PARTNER_KEYS]
      : BASIC_IDEAL_PARTNER_KEYS;

    const payload = Object.fromEntries(
      Object.entries(fields).filter(
        ([key, v]) => allowedKeys.includes(key) && v !== ''
      )
    );

    ['age_min', 'age_max', 'height_min_cm', 'height_max_cm', 'min_income', 'max_income'].forEach((key) => {
      if (payload[key] !== undefined) payload[key] = Number(payload[key]);
    });

    const { error: err } = await onSave(payload);
    setSaving(false);
    if (err) { setError(err); return; }
    onClose();
  };

  return (
    <div className={styles.modalOverlay} onClick={onClose}>
      <div className={styles.modalCard} onClick={(e) => e.stopPropagation()}>
        <div className={styles.modalHeader}>
          <h2 className={styles.modalTitle}>Partner Preferences</h2>
          <button className={styles.modalClose} onClick={onClose}><Icons.Close /></button>
        </div>

        {error && <div className={styles.apiError}>{error}</div>}
        {!isPremium && (
          <div className={styles.apiError} style={{ background: '#fff8e6', color: '#8a6d00' }}>
            Age, height, religion, and location are free for everyone.
            Upgrade to Premium to filter by income, education, manglik, and more.
          </div>
        )}

        <form onSubmit={handleSubmit} className={styles.modalForm}>
          {basicFields.map(({ label, key, type }) => (
            <div className={styles.modalField} key={key}>
              <label className={styles.modalLabel}>{label}</label>
              <input
                className={styles.modalInput}
                type={type}
                value={fields[key]}
                onChange={(e) => set(key, e.target.value)}
              />
            </div>
          ))}

          {!isPremium && (
            <div
              style={{
                gridColumn: '1 / -1',
                padding: '12px 16px',
                background: '#faf6ee',
                borderRadius: '8px',
                border: '1px dashed #c9a227',
                cursor: 'pointer',
              }}
              onClick={() => { window.location.hash = '#subscription'; }}
            >
              <strong>Premium filters</strong> — income, education, manglik, mother tongue, and more.
              <span style={{ display: 'block', marginTop: '4px', color: '#8a6d00' }}>
                Tap to upgrade →
              </span>
            </div>
          )}

          {isPremium && premiumFields.map(({ label, key, type }) => (
            <div className={styles.modalField} key={key}>
              <label className={styles.modalLabel}>{label} (Premium)</label>
              <input
                className={styles.modalInput}
                type={type}
                value={fields[key]}
                onChange={(e) => set(key, e.target.value)}
              />
            </div>
          ))}

          <div className={styles.modalActions}>
            <button type="button" className={styles.cancelBtn} onClick={onClose}>Cancel</button>
            <button type="submit" className={styles.saveProfileBtn} disabled={saving}>
              <Icons.Save /> {saving ? 'Saving…' : 'Save Preferences'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

// ── Edit Modal ────────────────────────────────────────────────────────────────
function EditProfileModal({ profile, onClose, onSave }) {
  const [fields, setFields] = useState({
    full_name:           profile?.full_name || '',
    age:                 profile?.age || '',
    height_cm:           profile?.height_cm || '',
    religion:            profile?.religion || '',
    mother_tongue:       profile?.mother_tongue || '',
    marital_status:      profile?.marital_status || '',
    father_occupation:   profile?.father_occupation || '',
    mother_occupation:   profile?.mother_occupation || '',
    siblings_count:      profile?.siblings_count || '',
    siblings_details:    profile?.siblings_details || '',
    family_values:       profile?.family_values || '',
    industry:            profile?.industry || '',
    education:           profile?.education || '',
    current_designation: profile?.current_designation || '',
    current_company:     profile?.current_company || '',
    annual_income_min:   profile?.annual_income_min || '',
    annual_income_max:   profile?.annual_income_max || '',
    income_unit:         profile?.income_unit || 'LPA',
    birth_place:         profile?.birth_place || '',
    zodiac_sign:         profile?.zodiac_sign || '',
    manglik_status:      profile?.manglik_status || '',
  });
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  const set = (k, v) => setFields(f => ({ ...f, [k]: v }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSaving(true);
    // Strip empty strings so backend keeps existing values
    const payload = Object.fromEntries(
      Object.entries(fields).filter(([, v]) => v !== '')
    );
    const { error: err } = await onSave(payload);
    setSaving(false);
    if (err) { setError(err); return; }
    onClose();
  };

  return (
    <div className={styles.modalOverlay} onClick={onClose}>
      <div className={styles.modalCard} onClick={e => e.stopPropagation()}>
        <div className={styles.modalHeader}>
          <h2 className={styles.modalTitle}>Edit Profile</h2>
          <button className={styles.modalClose} onClick={onClose}><Icons.Close /></button>
        </div>

        {error && <div className={styles.apiError}>{error}</div>}

        <form onSubmit={handleSubmit} className={styles.modalForm}>
          {[
            { label: 'Full Name',           key: 'full_name',           type: 'text' },
            { label: 'Age',                 key: 'age',                 type: 'number' },
            { label: 'Height (cm)',          key: 'height_cm',           type: 'number' },
            { label: 'Religion',            key: 'religion',            type: 'text' },
            { label: 'Mother Tongue',       key: 'mother_tongue',       type: 'text' },
            { label: 'Marital Status',      key: 'marital_status',      type: 'text' },
            { label: "Father's Occupation", key: 'father_occupation',   type: 'text' },
            { label: "Mother's Occupation", key: 'mother_occupation',   type: 'text' },
            { label: 'Siblings Count',      key: 'siblings_count',      type: 'number' },
            { label: 'Siblings Details',    key: 'siblings_details',    type: 'text' },
            { label: 'Family Values',       key: 'family_values',       type: 'text' },
            { label: 'Industry',            key: 'industry',            type: 'text' },
            { label: 'Education',           key: 'education',           type: 'text' },
            { label: 'Designation',         key: 'current_designation', type: 'text' },
            { label: 'Company',             key: 'current_company',     type: 'text' },
            { label: 'Income Min',          key: 'annual_income_min',   type: 'number' },
            { label: 'Income Max',          key: 'annual_income_max',   type: 'number' },
            { label: 'Income Unit',         key: 'income_unit',         type: 'text' },
            { label: 'Birth Place',         key: 'birth_place',         type: 'text' },
            { label: 'Zodiac Sign',         key: 'zodiac_sign',         type: 'text' },
            { label: 'Manglik Status',      key: 'manglik_status',      type: 'text' },
          ].map(({ label, key, type }) => (
            <div className={styles.modalField} key={key}>
              <label className={styles.modalLabel}>{label}</label>
              <input
                className={styles.modalInput}
                type={type}
                value={fields[key]}
                onChange={e => set(key, e.target.value)}
              />
            </div>
          ))}

          <div className={styles.modalActions}>
            <button type="button" className={styles.cancelBtn} onClick={onClose}>Cancel</button>
            <button type="submit" className={styles.saveProfileBtn} disabled={saving}>
              <Icons.Save /> {saving ? 'Saving…' : 'Save Changes'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

// ── Photo Gallery Section ─────────────────────────────────────────────────────
function PhotoGallerySection({ account, profile, refreshProfile }) {
  const [items, setItems] = useState([]);
  const [galleryMeta, setGalleryMeta] = useState(null);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [actionId, setActionId] = useState(null);
  const [error, setError] = useState('');
  const fileInputRef = useRef(null);

  const loadGallery = async () => {
    const { data, error: err } = await fetchGallery();
    if (err) {
      setError(err);
    } else if (data) {
      setItems(data.items || []);
      setGalleryMeta(data);
      setError('');
    }
    setLoading(false);
  };

  useEffect(() => {
    loadGallery();
  }, []);

  const limit = galleryMeta?.limit ?? account?.gallery_limit ?? 5;
  const count = galleryMeta?.count ?? account?.gallery_count ?? items.length;
  const canUpload = count < limit;

  const handleUpload = async (e) => {
    const file = e.target.files?.[0];
    e.target.value = '';
    if (!file) return;

    setUploading(true);
    setError('');
    const { data, error: err, upgradeRequired } = await uploadGalleryImage(file);
    setUploading(false);

    if (err) {
      setError(upgradeRequired
        ? `${err} Upgrade to Silver, Gold, or Platinum for up to ${galleryMeta?.premium_limit ?? 30} photos.`
        : err);
      return;
    }

    await loadGallery();
    if (refreshProfile) await refreshProfile();
  };

  const handleSetProfile = async (id) => {
    setActionId(id);
    setError('');
    const { error: err } = await setGalleryProfilePhoto(id);
    setActionId(null);
    if (err) {
      setError(err);
      return;
    }
    await loadGallery();
    if (refreshProfile) await refreshProfile();
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Remove this photo from your gallery?')) return;
    setActionId(id);
    setError('');
    const { error: err } = await deleteGalleryImage(id);
    setActionId(null);
    if (err) {
      setError(err);
      return;
    }
    await loadGallery();
    if (refreshProfile) await refreshProfile();
  };

  return (
    <>
      <div className={styles.photoGalleryToolbar}>
        <span className={styles.photoGalleryCount}>
          {count} / {limit} photos
          {!account?.is_premium && (
            <span className={styles.photoGalleryPremiumNote}>
              {' '}· Basic limit {galleryMeta?.basic_limit ?? 5}. Premium unlocks more.
            </span>
          )}
        </span>
        {canUpload && (
          <>
            <input
              ref={fileInputRef}
              type="file"
              accept="image/jpeg,image/png,image/webp"
              className={styles.photoGalleryFileInput}
              onChange={handleUpload}
            />
            <button
              type="button"
              className={styles.photoGalleryUploadBtn}
              disabled={uploading}
              onClick={() => fileInputRef.current?.click()}
            >
              {uploading ? 'Uploading…' : '+ Add Photo'}
            </button>
          </>
        )}
      </div>

      {error && <p className={styles.photoGalleryError} role="alert">{error}</p>}

      {loading ? (
        <p className={styles.photoGalleryHint}>Loading gallery…</p>
      ) : items.length === 0 ? (
        <p className={styles.photoGalleryHint}>
          No photos yet. Add your first profile photo — images are checked for appropriateness before approval.
        </p>
      ) : (
        <div className={styles.photoGalleryGrid}>
          {items.map((item) => (
            <div key={item.id} className={styles.photoGalleryItem}>
              <AuthenticatedImage
                src={item.image_url}
                profile={profile}
                alt={item.original_filename || 'Gallery photo'}
                className={styles.photoGalleryImg}
              />
              <div className={styles.photoGalleryItemFooter}>
                {item.is_profile_photo ? (
                  <span className={styles.photoGalleryLabel}>Profile Photo</span>
                ) : (
                  <button
                    type="button"
                    className={styles.photoGallerySetBtn}
                    disabled={actionId === item.id || item.sensitivity_status === 'rejected'}
                    onClick={() => handleSetProfile(item.id)}
                  >
                    {actionId === item.id ? '…' : 'Set as Profile'}
                  </button>
                )}
                <button
                  type="button"
                  className={styles.photoGalleryDeleteBtn}
                  disabled={actionId === item.id}
                  onClick={() => handleDelete(item.id)}
                  aria-label="Delete photo"
                >
                  ×
                </button>
              </div>
              {item.sensitivity_status === 'pending' && (
                <span className={styles.photoGalleryStatus}>Review pending</span>
              )}
            </div>
          ))}
        </div>
      )}

      <p className={styles.photoGalleryHint}>
        JPEG, PNG, or WebP up to 5 MB. Each upload passes a sensitivity check. Choose any approved photo as your profile picture.
      </p>
    </>
  );
}

// ── Share Modal ───────────────────────────────────────────────────────────────
function ShareProfileModal({ profileId, displayName, onClose }) {
  const profileUrl = `${window.location.origin}${window.location.pathname}#profile/${profileId}`;
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(profileUrl).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  };

  const handleNativeShare = () => {
    if (navigator.share) {
      navigator.share({
        title: `${displayName} — MilanSetu`,
        text: `Check out ${displayName}'s profile on MilanSetu!`,
        url: profileUrl,
      });
    } else {
      handleCopy();
    }
  };

  return (
    <div className={styles.modalOverlay} onClick={onClose}>
      <div className={styles.modalCard} onClick={e => e.stopPropagation()} style={{ maxWidth: '460px' }}>
        <div className={styles.modalHeader}>
          <h2 className={styles.modalTitle}>Share Profile</h2>
          <button className={styles.modalClose} onClick={onClose}><Icons.Close /></button>
        </div>
        <div style={{ padding: '8px 0 16px' }}>
          <p style={{ color: '#666', fontSize: '14px', marginBottom: '16px' }}>
            Share your profile with family or friends using the link below.
          </p>
          <div style={{
            display: 'flex', gap: '8px', alignItems: 'center',
            background: '#f8f5f0', borderRadius: '10px', padding: '12px 14px',
            border: '1.5px solid #e8d9c0',
          }}>
            <span style={{ flex: 1, fontSize: '13px', color: '#555', wordBreak: 'break-all' }}>{profileUrl}</span>
            <button
              onClick={handleCopy}
              style={{
                flexShrink: 0, padding: '6px 14px', borderRadius: '8px',
                border: 'none', background: copied ? '#4caf50' : '#7B1F2E',
                color: '#fff', fontSize: '13px', cursor: 'pointer', transition: 'background 0.3s',
              }}
            >
              {copied ? '✓ Copied!' : 'Copy'}
            </button>
          </div>
          <div className={styles.modalActions} style={{ marginTop: '20px' }}>
            <button type="button" className={styles.cancelBtn} onClick={onClose}>Close</button>
            <button
              type="button"
              className={styles.saveProfileBtn}
              onClick={handleNativeShare}
            >
              <Icons.Share /> Share Now
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

// ── Request Edit Modal ────────────────────────────────────────────────────────
function RequestEditModal({ onClose }) {
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = () => {
    setSubmitted(true);
    setTimeout(() => { setSubmitted(false); onClose(); }, 2000);
  };

  return (
    <div className={styles.modalOverlay} onClick={onClose}>
      <div className={styles.modalCard} onClick={e => e.stopPropagation()} style={{ maxWidth: '460px' }}>
        <div className={styles.modalHeader}>
          <h2 className={styles.modalTitle}>Request Profile Edit</h2>
          <button className={styles.modalClose} onClick={onClose}><Icons.Close /></button>
        </div>
        <div style={{ padding: '8px 0 16px' }}>
          {submitted ? (
            <div style={{
              textAlign: 'center', padding: '24px',
              color: '#4caf50', fontSize: '16px', fontWeight: 600,
            }}>
              ✓ Request sent! Admin will review and apply your changes.
            </div>
          ) : (
            <>
              <div style={{
                background: '#fff8e6', border: '1px solid #f0c040',
                borderRadius: '10px', padding: '14px 16px', marginBottom: '16px',
              }}>
                <p style={{ margin: 0, fontSize: '14px', color: '#7a5500', lineHeight: '1.6' }}>
                  <strong>Profile edits require admin approval.</strong><br />
                  To maintain data integrity and trust, all profile changes are reviewed by our team before being applied.
                </p>
              </div>
              <p style={{ fontSize: '13px', color: '#666', marginBottom: '20px' }}>
                Click the button below to submit a request. Our team will contact you within 24 hours to process your changes.
              </p>
              <div className={styles.modalActions}>
                <button type="button" className={styles.cancelBtn} onClick={onClose}>Cancel</button>
                <button type="button" className={styles.saveProfileBtn} onClick={handleSubmit}>
                  <Icons.Pencil /> Send Edit Request
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}

// ── Main MyProfilePage ────────────────────────────────────────────────────────
const MyProfilePage = () => {
  const { user, profile, idealPartner, account, updateProfile, saveIdealPartner, refreshProfile } = useAuth();
  const [editOpen, setEditOpen] = useState(false);
  const [partnerOpen, setPartnerOpen] = useState(false);
  const [shareOpen, setShareOpen] = useState(false);
  const [requestEditOpen, setRequestEditOpen] = useState(false);
  const [activeTab, setActiveTab] = useState('overview');

  const displayName = profile?.full_name || user?.email || 'Your Profile';
  const designation = profile?.current_designation || '';
  const photoUrl = getProfilePhotoUrl(profile, account);
  const avatarFallback = getProfileAvatar(profile, account);
  const membershipLabel = MEMBERSHIP_LABELS[user?.user_type || account?.user_type || 'basic'] || 'Member';
  const birthDate   = profile?.date_of_birth
    ? new Date(profile.date_of_birth).toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' })
    : '—';

  const showSection = (sectionId) => activeTab === 'overview' || activeTab === sectionId;

  return (
    <div className={styles.dashboardContainer}>
      <Sidebar activePage="profile" />

      <main className={styles.mainContent}>
        <TopBar
          searchPlaceholder="Search connections..."
          userName={displayName}
          avatarSrc={photoUrl || avatarFallback}
        />

        <div className={styles.profileBody}>
          {/* Profile Header Card */}
          <section className={styles.profileHeaderCard}>
            <div className={styles.bannerStrip}></div>
            <div className={styles.headerContent}>
              <div className={styles.profileInfoWrapper}>
                <div className={styles.photoContainer}>
                  <AuthenticatedImage
                    src={photoUrl}
                    profile={profile}
                    fallbackSrc={avatarFallback}
                    alt={displayName}
                    className={styles.profilePhoto}
                  />
                  <div className={styles.verifiedBadge}>✓</div>
                </div>
                <div>
                  <div className={styles.nameBadgeRow}>
                    <h1 className={styles.profileName}>{displayName}</h1>
                    <span className={styles.memberBadge}>{membershipLabel}</span>
                  </div>
                  <div className={styles.metaLine}>
                    <Icons.Pin />
                    {profile?.birth_place || 'India'}
                    {designation ? ` • ${designation}` : ''}
                  </div>
                </div>
              </div>
              <div className={styles.headerActions}>
                <button className={styles.editBtn} onClick={() => setRequestEditOpen(true)}>
                  <Icons.Pencil /> Request Edit
                </button>
                <button className={styles.shareBtn} onClick={() => setShareOpen(true)}>
                  <Icons.Share /> Share
                </button>
              </div>
            </div>
          </section>

          {/* Tab Navigation */}
          <nav className={styles.tabBar} role="tablist" aria-label="Profile sections">
            {PROFILE_TABS.map((tab) => (
              <button
                key={tab.id}
                type="button"
                role="tab"
                aria-selected={activeTab === tab.id}
                className={`${styles.tab} ${activeTab === tab.id ? styles.activeTab : ''}`}
                onClick={() => setActiveTab(tab.id)}
              >
                {tab.label}
              </button>
            ))}
          </nav>

          {/* Info Grid */}
          <div className={styles.infoGrid}>
            {showSection('personal') && (
            <div className={styles.infoCard}>
              <div className={styles.cardHeader}>
                <div className={styles.iconCircle}><Icons.SearchSmall /></div>
                <h2 className={styles.cardTitle}>Personal Details</h2>
              </div>
              <div className={styles.fieldGrid}>
                {[
                  { label: 'Full Name',      value: profile?.full_name     || '—' },
                  { label: 'Age',            value: profile?.age ? `${profile.age} Years` : '—' },
                  { label: 'Height',         value: profile?.height_cm ? `${profile.height_cm} cm` : '—' },
                  { label: 'Religion',       value: profile?.religion      || '—' },
                  { label: 'Mother Tongue',  value: profile?.mother_tongue || '—' },
                  { label: 'Marital Status', value: profile?.marital_status || '—' },
                ].map((f, i) => (
                  <div key={i} className={styles.field}>
                    <span className={styles.fieldLabel}>{f.label}</span>
                    <div className={styles.fieldValue}>{f.value}</div>
                  </div>
                ))}
              </div>
            </div>
            )}

            {showSection('partner') && (
            <div className={`${styles.infoCard} ${styles.darkCard}`}>
              <div className={styles.cardHeader}>
                <div className={styles.iconCircle} style={{ backgroundColor: 'rgba(255,255,255,0.1)', color: 'white' }}>
                  <Icons.Star />
                </div>
                <h2 className={styles.cardTitle}>Ideal Partner</h2>
              </div>
              <div>
                {getIdealPartnerPreferences(idealPartner, account).map((p) => (
                  <div key={p.label} className={styles.prefRow}>
                    <span className={styles.prefLabel}>{p.label}</span>
                    <span className={styles.prefValue}>{p.value}</span>
                  </div>
                ))}
                <button className={styles.updatePrefBtn} onClick={() => setPartnerOpen(true)}>
                  Update Preferences
                </button>
              </div>
            </div>
            )}

            {showSection('family') && (
            <div className={styles.infoCard}>
              <div className={styles.cardHeader}>
                <div className={styles.iconCircle}><Icons.Users /></div>
                <h2 className={styles.cardTitle}>Family Information</h2>
              </div>
              <div className={styles.subBoxGrid}>
                <div className={styles.subBox}>
                  <span className={styles.subBoxLabel}>PARENTS</span>
                  <div className={styles.subField}>
                    <Icons.Briefcase />
                    <div className={styles.subFieldInfo}>
                      <span className={styles.subFieldLabel}>Father's Occupation</span>
                      <span className={styles.subFieldValue}>{profile?.father_occupation || '—'}</span>
                    </div>
                  </div>
                  <div className={styles.subField}>
                    <Icons.Profile />
                    <div className={styles.subFieldInfo}>
                      <span className={styles.subFieldLabel}>Mother's Occupation</span>
                      <span className={styles.subFieldValue}>{profile?.mother_occupation || '—'}</span>
                    </div>
                  </div>
                </div>
                <div className={styles.subBox}>
                  <span className={styles.subBoxLabel}>BACKGROUND</span>
                  <div className={styles.subField}>
                    <Icons.Users />
                    <div className={styles.subFieldInfo}>
                      <span className={styles.subFieldLabel}>Siblings</span>
                      <span className={styles.subFieldValue}>
                        {profile?.siblings_count != null
                          ? `${profile.siblings_count}${profile.siblings_details ? ` — ${profile.siblings_details}` : ''}`
                          : '—'}
                      </span>
                    </div>
                  </div>
                  <div className={styles.subField}>
                    <Icons.Dashboard />
                    <div className={styles.subFieldInfo}>
                      <span className={styles.subFieldLabel}>Family Values</span>
                      <span className={styles.subFieldValue}>{profile?.family_values || '—'}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            )}

            {showSection('career') && (
            <div className={`${styles.infoCard} ${styles.careerCard}`}>
              <div className={styles.cardHeader}>
                <div className={`${styles.iconCircle} ${styles.goldCircle}`}><Icons.Graduation /></div>
                <h2 className={styles.cardTitle}>Career</h2>
              </div>
              <div className={styles.careerItem}>
                <span className={styles.careerTitle}>{profile?.education || '—'}</span>
                <span className={styles.careerSubtitle}>{profile?.industry || ''}</span>
              </div>
              <div className={styles.careerItem}>
                <span className={styles.careerTitle}>{profile?.current_company || '—'}</span>
                <span className={styles.careerSubtitle}>{profile?.current_designation || ''}</span>
              </div>
              <div className={styles.divider}></div>
              <div className={styles.incomeRow}>
                <span className={styles.subFieldLabel}>Annual Income</span>
                <span className={styles.incomeValue}>
                  {profile?.annual_income_min && profile?.annual_income_max
                    ? `${profile.annual_income_min} – ${profile.annual_income_max} ${profile.income_unit || 'LPA'}`
                    : '—'}
                </span>
              </div>
            </div>
            )}

            {showSection('horoscope') && (
            <div className={`${styles.infoCard} ${styles.fullWidth}`}>
              <div className={styles.cardHeaderFull}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                  <div className={styles.iconCircle}><Icons.Moon /></div>
                  <h2 className={styles.cardTitle}>Horoscope & Kundali</h2>
                </div>
                <div className={styles.badgeRow}>
                  {profile?.manglik_status && (
                    <span className={styles.pinkPill}>{profile.manglik_status}</span>
                  )}
                  {profile?.kundali_url && (
                    <a href={profile.kundali_url} target="_blank" rel="noreferrer" className={styles.outlinePill}>
                      View Full Kundali
                    </a>
                  )}
                </div>
              </div>
              <div className={styles.dataRow}>
                {[
                  { label: 'BIRTH DATE',  value: birthDate },
                  { label: 'BIRTH TIME',  value: profile?.time_of_birth  || '—' },
                  { label: 'BIRTH PLACE', value: profile?.birth_place    || '—' },
                  { label: 'ZODIAC SIGN', value: profile?.zodiac_sign    || '—' },
                ].map((d, i) => (
                  <div key={i} className={styles.dataItem}>
                    <span className={styles.fieldLabel}>{d.label}</span>
                    <span className={styles.subFieldValue} style={{ fontSize: '15px' }}>{d.value}</span>
                  </div>
                ))}
              </div>
            </div>
            )}

            {showSection('photos') && (
            <div className={`${styles.infoCard} ${styles.fullWidth}`}>
              <div className={styles.cardHeader}>
                <div className={styles.iconCircle}><Icons.Camera /></div>
                <h2 className={styles.cardTitle}>Photo Gallery</h2>
              </div>
              <PhotoGallerySection
                account={account}
                profile={profile}
                refreshProfile={refreshProfile}
              />
            </div>
            )}
          </div>
        </div>

        <footer className={styles.profileFooter}>
          <div className={styles.footerInner}>
            <div>
              <span className={styles.footerWordmark}>MilanSetu</span>
              <span className={styles.copyright}>© 2024 MilanSetu Matrimonials. All rights reserved.</span>
            </div>
            <div className={styles.footerLinks}>
              <a href="#profile" className={styles.footerLink}>Privacy Policy</a>
              <a href="#profile" className={styles.footerLink}>Terms of Service</a>
              <a href="#profile" className={styles.footerLink}>Safety Tips</a>
              <a href="#profile" className={styles.footerLink}>Contact Us</a>
            </div>
          </div>
        </footer>

        {shareOpen && (
          <ShareProfileModal
            profileId={profile?.id || user?.id || 'me'}
            displayName={displayName}
            onClose={() => setShareOpen(false)}
          />
        )}
        {requestEditOpen && (
          <RequestEditModal onClose={() => setRequestEditOpen(false)} />
        )}
      </main>

      {/* Edit Modal */}
      {editOpen && (
        <EditProfileModal
          profile={profile}
          onClose={() => setEditOpen(false)}
          onSave={updateProfile}
        />
      )}

      {partnerOpen && (
        <EditPartnerModal
          idealPartner={idealPartner}
          account={account}
          onClose={() => setPartnerOpen(false)}
          onSave={saveIdealPartner}
        />
      )}
    </div>
  );
};

export default MyProfilePage;
