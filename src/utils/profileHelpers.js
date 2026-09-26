import { getAccessToken, isValidJwtFormat } from '../api/auth';

const VITE_BASE = import.meta.env.VITE_API_BASE_URL?.trim() ?? '';
const API_BASE = VITE_BASE ? VITE_BASE.replace(/\/$/, '') : '';

/** Fetch a protected gallery image and return a blob URL (or null). */
export async function fetchAuthenticatedImageUrl(path) {
  if (!path) return null;
  if (!path.startsWith('/api/')) return path;

  const token = getAccessToken();
  if (!token || !isValidJwtFormat(token)) return null;

  try {
    const res = await fetch(`${API_BASE}${path}`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    if (!res.ok) return null;
    const blob = await res.blob();
    return URL.createObjectURL(blob);
  } catch {
    return null;
  }
}

const PROFILE_FIELDS = [
  'full_name', 'age', 'height_cm', 'religion', 'mother_tongue', 'marital_status',
  'father_occupation', 'mother_occupation', 'siblings_count', 'family_values',
  'industry', 'education', 'current_designation', 'current_company',
  'annual_income_min', 'annual_income_max', 'date_of_birth', 'birth_place',
  'zodiac_sign', 'manglik_status',
];

export const BASIC_IDEAL_PARTNER_KEYS = [
  'age_min', 'age_max', 'height_min_cm', 'height_max_cm', 'religion', 'location',
];

export const PREMIUM_IDEAL_PARTNER_KEYS = [
  'mother_tongue', 'marital_status', 'education', 'industry',
  'min_income', 'max_income', 'income_unit', 'manglik_status', 'family_values',
];

const BASIC_PARTNER_FIELDS = [
  { key: 'age_min', label: 'Age Range', format: (ip) => formatAgeRange(ip?.age_min, ip?.age_max) },
  { key: 'height_min_cm', label: 'Height', format: (ip) => formatHeightRange(ip?.height_min_cm, ip?.height_max_cm) },
  { key: 'religion', label: 'Religion', format: (ip) => ip?.religion || 'Any' },
  { key: 'location', label: 'Location', format: (ip) => ip?.location || '—' },
];

const PREMIUM_PARTNER_FIELDS = [
  { key: 'mother_tongue', label: 'Mother Tongue', format: (ip) => ip?.mother_tongue || '—' },
  { key: 'marital_status', label: 'Marital Status', format: (ip) => ip?.marital_status || 'Any' },
  { key: 'education', label: 'Education', format: (ip) => ip?.education || '—' },
  { key: 'industry', label: 'Industry', format: (ip) => ip?.industry || '—' },
  {
    key: 'min_income',
    label: 'Income Range',
    format: (ip) => (
      ip?.min_income && ip?.max_income
        ? `${ip.min_income} – ${ip.max_income} ${ip.income_unit || 'LPA'}`
        : '—'
    ),
  },
  { key: 'manglik_status', label: 'Manglik', format: (ip) => ip?.manglik_status || '—' },
  { key: 'family_values', label: 'Family Values', format: (ip) => ip?.family_values || '—' },
];

export function getProfileAvatar(profile, account = null) {
  // Return protected URL when available; otherwise return null so UI
  // components can render a gender-specific icon instead of static images.
  const apiUrl = profile?.profile_photo_url || account?.profile_photo_url;
  return apiUrl || null;
}

export function getProfilePhotoUrl(profile, account = null) {
  return profile?.profile_photo_url || account?.profile_photo_url || null;
}

export function cmToFeetInches(cm) {
  if (!cm) return null;
  const totalInches = cm / 2.54;
  const feet = Math.floor(totalInches / 12);
  const inches = Math.round(totalInches % 12);
  return `${feet}'${inches}"`;
}

export function formatHeightRange(minCm, maxCm) {
  if (minCm && maxCm) return `${cmToFeetInches(minCm)} - ${cmToFeetInches(maxCm)}`;
  if (minCm) return `${cmToFeetInches(minCm)}+`;
  if (maxCm) return `Up to ${cmToFeetInches(maxCm)}`;
  return '—';
}

export function formatAgeRange(min, max) {
  if (min && max) return `${min} - ${max} Years`;
  if (min) return `${min}+ Years`;
  if (max) return `Up to ${max} Years`;
  return '—';
}

export function calculateProfileCompleteness(profile) {
  if (!profile) return 0;
  const filled = PROFILE_FIELDS.filter((field) => {
    const value = profile[field];
    return value !== null && value !== undefined && value !== '';
  }).length;
  return Math.round((filled / PROFILE_FIELDS.length) * 100);
}

/** Uses API match_score when present, otherwise client-side estimate. */
export function getMatchScore(theirProfile, myIdealPartner, myProfile) {
  if (theirProfile?.match_score != null) return theirProfile.match_score;
  return calculateMatchScore(myIdealPartner, myProfile, theirProfile);
}

export function calculateMatchScore(idealPartner, myProfile, theirProfile) {
  if (!theirProfile) return 0;

  let score = 0;
  let factors = 0;

  const addFactor = (matched) => {
    factors += 1;
    if (matched) score += 1;
  };

  if (idealPartner?.religion && theirProfile.religion) {
    addFactor(idealPartner.religion.toLowerCase() === theirProfile.religion.toLowerCase());
  }

  if (idealPartner?.mother_tongue && theirProfile.mother_tongue) {
    addFactor(idealPartner.mother_tongue.toLowerCase() === theirProfile.mother_tongue.toLowerCase());
  }

  if (idealPartner?.age_min != null && idealPartner?.age_max != null && theirProfile.age != null) {
    addFactor(
      theirProfile.age >= idealPartner.age_min &&
      theirProfile.age <= idealPartner.age_max
    );
  } else if (myProfile?.age && theirProfile.age) {
    addFactor(Math.abs(myProfile.age - theirProfile.age) <= 5);
  }

  if (idealPartner?.height_min_cm && idealPartner?.height_max_cm && theirProfile.height_cm) {
    addFactor(
      theirProfile.height_cm >= idealPartner.height_min_cm &&
      theirProfile.height_cm <= idealPartner.height_max_cm
    );
  }

  if (idealPartner?.education && theirProfile.education) {
    addFactor(idealPartner.education.toLowerCase() === theirProfile.education.toLowerCase());
  }

  if (idealPartner?.industry && theirProfile.industry) {
    addFactor(idealPartner.industry.toLowerCase() === theirProfile.industry.toLowerCase());
  }

  if (idealPartner?.location && theirProfile.birth_place) {
    addFactor(
      theirProfile.birth_place.toLowerCase().includes(idealPartner.location.toLowerCase()) ||
      idealPartner.location.toLowerCase().includes(theirProfile.birth_place.toLowerCase())
    );
  }

  if (factors === 0) return 75;
  return Math.min(99, Math.max(60, Math.round((score / factors) * 100)));
}

export function getIdealPartnerPreferences(idealPartner, account = null) {
  const isPremium = account?.is_premium ?? false;
  const fields = [...BASIC_PARTNER_FIELDS];
  if (isPremium) fields.push(...PREMIUM_PARTNER_FIELDS);

  return fields.map(({ label, format }) => ({
    label,
    value: format(idealPartner),
  }));
}

export function formatRelativeTime(dateStr) {
  if (!dateStr) return '';
  const date = new Date(dateStr);
  const diffMs = Date.now() - date.getTime();
  const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
  if (diffHours < 1) return 'Just now';
  if (diffHours < 24) return `${diffHours} hour${diffHours === 1 ? '' : 's'} ago`;
  const diffDays = Math.floor(diffHours / 24);
  if (diffDays < 7) return `${diffDays} day${diffDays === 1 ? '' : 's'} ago`;
  return date.toLocaleDateString('en-IN', { day: 'numeric', month: 'short' });
}

export const STATUS_LABELS = {
  pending: 'PENDING',
  accepted: 'ACCEPTED',
  declined: 'DECLINED',
  withdrawn: 'WITHDRAWN',
};
