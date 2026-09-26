/**
 * auth.js — all API calls related to authentication and profile.
 *
 * In dev, Vite proxies /api/* → Django (see vite.config.js).
 * In production, VITE_API_BASE_URL points to the deployed backend.
 */

// In dev the Vite proxy handles /api → Django, so BASE is just "/api".
// In production VITE_API_BASE_URL is set (e.g. https://milansetu-backend.onrender.com/)
// and BASE becomes "https://milansetu-backend.onrender.com/api".
const VITE_BASE = import.meta.env.VITE_API_BASE_URL?.trim() ?? '';
const BASE = VITE_BASE ? `${VITE_BASE.replace(/\/$/, '')}/api` : '/api';

// ── Token helpers ────────────────────────────────────────────────────────────

export const saveTokens = ({ access, refresh }) => {
  localStorage.setItem('access_token', access);
  localStorage.setItem('refresh_token', refresh);
};

export const clearTokens = () => {
  localStorage.removeItem('access_token');
  localStorage.removeItem('refresh_token');
  localStorage.removeItem('user');
};

export const getAccessToken  = () => localStorage.getItem('access_token');
export const getRefreshToken = () => localStorage.getItem('refresh_token');

export const saveUser = (user) =>
  localStorage.setItem('user', JSON.stringify(user));

export const getSavedUser = () => {
  try { return JSON.parse(localStorage.getItem('user')); }
  catch { return null; }
};

/**
 * Returns true if the string looks like a well-formed JWT
 * (three base64url segments separated by dots).
 * Does NOT verify the signature — just sanity-checks format.
 */
export function isValidJwtFormat(token) {
  if (!token || typeof token !== 'string') return false;
  const parts = token.split('.');
  if (parts.length !== 3) return false;
  try {
    // Each segment must be valid base64url
    parts.forEach(p => atob(p.replace(/-/g, '+').replace(/_/g, '/')));
    // Decode payload and check exp
    const payload = JSON.parse(atob(parts[1].replace(/-/g, '+').replace(/_/g, '/')));
    if (!payload.exp) return false;
    // Reject tokens already expired locally (saves a round-trip)
    // Allow 10-second clock skew
    return payload.exp > (Date.now() / 1000) - 10;
  } catch {
    return false;
  }
}

// ── Generic fetch wrapper ─────────────────────────────────────────────────────

// Tracks an in-flight refresh so parallel requests don't each trigger their own
let _refreshPromise = null;

// Paths that must NOT send an Authorization header (public endpoints)
const PUBLIC_PATHS = ['/auth/signin/', '/milansetu/signup/', '/auth/token/refresh/'];

async function requestMultipart(path, formData, { public: isPublic = false, method = 'POST' } = {}) {
  const headers = {};
  if (!isPublic) {
    const token = getAccessToken();
    if (token && isValidJwtFormat(token)) {
      headers['Authorization'] = `Bearer ${token}`;
    } else if (token) {
      clearTokens();
      window.dispatchEvent(new CustomEvent('auth:session-expired'));
      return { data: null, error: 'Session expired. Please log in again.' };
    }
  }

  try {
    const res = await fetch(`${BASE}${path}`, { method, headers, body: formData });
    const isJson = res.headers.get('content-type')?.includes('application/json');
    const data = isJson ? await res.json() : null;

    if (!res.ok) {
      const msg =
        data?.detail ||
        Object.values(data || {}).flat().join(' ') ||
        `HTTP ${res.status}`;
      return { data: null, error: msg, upgradeRequired: data?.upgrade_required ?? false };
    }

    return { data, error: null };
  } catch {
    return { data: null, error: 'Network error. Please check your connection.' };
  }
}

async function request(path, options = {}, _isRetry = false) {
  const headers = { 'Content-Type': 'application/json', ...(options.headers || {}) };

  const isPublic = PUBLIC_PATHS.some(p => path.startsWith(p));
  if (!isPublic) {
    const token = getAccessToken();
    // Only attach token if it's a properly formatted JWT — never send garbage
    if (token && isValidJwtFormat(token)) {
      headers['Authorization'] = `Bearer ${token}`;
    } else if (token) {
      // Token exists but is malformed/expired locally — clear it immediately
      clearTokens();
      window.dispatchEvent(new CustomEvent('auth:session-expired'));
      return { data: null, error: 'Session expired. Please log in again.' };
    }
  }

  try {
    const res = await fetch(`${BASE}${path}`, { ...options, headers });
    const isJson = res.headers.get('content-type')?.includes('application/json');
    const data   = isJson ? await res.json() : null;

    if (res.status === 401 && !_isRetry && data?.code === 'token_not_valid') {
      const isExpired = Array.isArray(data.messages) &&
        data.messages.some(m => m.message?.toLowerCase().includes('expired'));

      if (isExpired) {
        // Access token expired server-side → try refresh once
        if (!_refreshPromise) {
          _refreshPromise = _doRefresh().finally(() => { _refreshPromise = null; });
        }
        const refreshed = await _refreshPromise;
        if (refreshed) return request(path, options, true); // retry with new token
      }

      // Token invalid or refresh failed → clear session
      clearTokens();
      window.dispatchEvent(new CustomEvent('auth:session-expired'));
      return { data: null, error: 'Session expired. Please log in again.' };
    }

    if (!res.ok) {
      const msg =
        data?.detail ||
        Object.values(data || {}).flat().join(' ') ||
        `HTTP ${res.status}`;
      return { data: null, error: msg };
    }

    return { data, error: null };
  } catch {
    return { data: null, error: 'Network error. Please check your connection.' };
  }
}

// Internal helper — returns true if a new access token was successfully obtained
async function _doRefresh() {
  const refresh = getRefreshToken();
  if (!refresh) return false;
  try {
    const res = await fetch(`${BASE}/auth/token/refresh/`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ refresh }),
    });
    if (!res.ok) return false;
    const data = await res.json();
    if (data?.access) {
      localStorage.setItem('access_token', data.access);
      if (data?.refresh) localStorage.setItem('refresh_token', data.refresh);
      return true;
    }
    return false;
  } catch {
    return false;
  }
}

// ── Auth endpoints ────────────────────────────────────────────────────────────

/**
 * Sign in — always clears stale tokens first so no old token is ever sent.
 */
export async function signIn(email, password) {
  clearTokens();
  return request('/auth/signin/', {
    method: 'POST',
    body: JSON.stringify({ email, password }),
  });
}

/**
 * Register a new user with profile data.
 * Pass profilePhoto (File) to upload a profile picture during signup.
 */
export async function signUp(payload, profilePhoto = null) {
  if (profilePhoto instanceof File) {
    const form = new FormData();
    Object.entries(payload).forEach(([key, value]) => {
      if (value !== undefined && value !== null && value !== '') {
        form.append(key, value);
      }
    });
    form.append('profile_photo', profilePhoto);
    return requestMultipart('/milansetu/signup/', form, { public: true });
  }

  return request('/milansetu/signup/', {
    method: 'POST',
    body: JSON.stringify(payload),
  });
}

/**
 * Explicitly refresh the access token (public helper for external use).
 */
export async function refreshAccessToken() {
  const refresh = getRefreshToken();
  if (!refresh) return { data: null, error: 'No refresh token' };
  const result = await request('/auth/token/refresh/', {
    method: 'POST',
    body: JSON.stringify({ refresh }),
  });
  if (result.data?.access) {
    localStorage.setItem('access_token', result.data.access);
  }
  return result;
}

// ── Profile & account endpoints ───────────────────────────────────────────────

export async function fetchMyProfile() {
  return request('/milansetu/profile/fetch_detail/');
}

export async function updateMyProfile(fields) {
  return request('/milansetu/profile/fetch_detail/', {
    method: 'PATCH',
    body: JSON.stringify(fields),
  });
}

export async function fetchIdealPartner() {
  return request('/milansetu/ideal-partner/');
}

export async function updateIdealPartner(fields) {
  return request('/milansetu/ideal-partner/', {
    method: 'PATCH',
    body: JSON.stringify(fields),
  });
}

export async function fetchProfiles(query = '') {
  const qs = query ? (query.startsWith('?') ? query : `?${query}`) : '';
  return request(`/milansetu/profiles/${qs}`);
}

export async function fetchProfileById(id) {
  return request(`/milansetu/profiles/${id}/`);
}

// ── Received interests ────────────────────────────────────────────────────────

export async function fetchReceivedInterests() {
  return request('/milansetu/interests/received/');
}

// ── Sent interests ────────────────────────────────────────────────────────────

export async function fetchSentInterests() {
  return request('/milansetu/interests/sent/');
}

export async function fetchSentInterestStats() {
  return request('/milansetu/interests/sent/stats/');
}

export async function sendInterest(receiverProfileId, message = '') {
  return request('/milansetu/interests/sent/', {
    method: 'POST',
    body: JSON.stringify({
      receiver_profile_id: receiverProfileId,
      message,
    }),
  });
}

export async function withdrawInterest(id) {
  return request(`/milansetu/interests/sent/${id}/`, {
    method: 'PATCH',
    body: JSON.stringify({ action: 'withdraw' }),
  });
}

export async function deleteInterest(id) {
  return request(`/milansetu/interests/sent/${id}/`, { method: 'DELETE' });
}

// ── Photo gallery ─────────────────────────────────────────────────────────────

export async function fetchGallery() {
  return request('/milansetu/gallery/');
}

export async function uploadGalleryImage(file, { setAsProfile = false } = {}) {
  const form = new FormData();
  form.append('image', file);
  if (setAsProfile) form.append('set_as_profile', 'true');
  return requestMultipart('/milansetu/gallery/', form);
}

export async function deleteGalleryImage(id) {
  return request(`/milansetu/gallery/${id}/`, { method: 'DELETE' });
}

export async function setGalleryProfilePhoto(id) {
  return request(`/milansetu/gallery/${id}/set-profile/`, { method: 'POST' });
}

// ── FCM Push Notifications ────────────────────────────────────────────────────

/**
 * Store or update the FCM device token for the current user.
 * Called after getFCMToken() on login.
 */
export async function storeFCMToken(token) {
  return request('/milansetu/fcm/token/', {
    method: 'POST',
    body: JSON.stringify({ token }),
  });
}

// ── Chat / Accepted Interests ─────────────────────────────────────────────────

/**
 * Fetch interests that have been accepted — these become chat contacts.
 * Returns both sent-and-accepted and received-and-accepted interests.
 */
export async function fetchAcceptedInterests() {
  return request('/milansetu/interests/accepted/');
}

// ── Generic apiClient (for use in firebase modules) ──────────────────────────

/**
 * Thin axios-like object for use inside firebase modules.
 * Supports: apiClient.post(path, body)
 */
export const apiClient = {
  post: (path, body) =>
    request(path, { method: 'POST', body: JSON.stringify(body) }),
  get: (path) => request(path),
};

