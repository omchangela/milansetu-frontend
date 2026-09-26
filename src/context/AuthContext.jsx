/**
 * AuthContext — global auth state for the app.
 */

import { createContext, useContext, useState, useEffect, useCallback } from 'react';
import {
  signIn,
  signUp,
  fetchMyProfile,
  updateMyProfile,
  updateIdealPartner,
  saveTokens,
  saveUser,
  clearTokens,
  getSavedUser,
  getAccessToken,
  isValidJwtFormat,
} from '../api/auth';

const AuthContext = createContext(null);

function parseAccountPayload(data) {
  if (!data) return { profile: null, idealPartner: null, account: null };
  // New shape: { profile, ideal_partner, account }
  if (data.profile !== undefined) {
    return {
      profile: data.profile,
      idealPartner: data.ideal_partner ?? null,
      account: data.account ?? null,
    };
  }
  // Legacy flat profile object
  return { profile: data, idealPartner: null, account: null };
}

function buildUserFromAuth(data) {
  return {
    id: data.id,
    email: data.email,
    user_type: data.user_type ?? 'basic',
    is_premium: data.is_premium ?? false,
    is_staff: data.is_staff ?? false,
  };
}

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [profile, setProfile] = useState(null);
  const [idealPartner, setIdealPartner] = useState(null);
  const [account, setAccount] = useState(null);
  const [loading, setLoading] = useState(true);

  const applyAccountPayload = useCallback((data) => {
    const parsed = parseAccountPayload(data);
    if (parsed.profile) setProfile(parsed.profile);
    setIdealPartner(parsed.idealPartner);
    setAccount(parsed.account);
    return parsed;
  }, []);

  useEffect(() => {
    const savedUser = getSavedUser();
    const token = getAccessToken();

    if (!savedUser || !token || !isValidJwtFormat(token)) {
      clearTokens();
      setLoading(false);
      return;
    }

    setUser(savedUser);
    fetchMyProfile()
      .then(({ data }) => { if (data) applyAccountPayload(data); })
      .finally(() => setLoading(false));
  }, [applyAccountPayload]);

  useEffect(() => {
    const handleExpired = () => {
      setUser(null);
      setProfile(null);
      setIdealPartner(null);
      setAccount(null);
      setLoading(false);
      window.location.hash = '#login';
    };
    window.addEventListener('auth:session-expired', handleExpired);
    return () => window.removeEventListener('auth:session-expired', handleExpired);
  }, []);

  const login = useCallback(async (email, password) => {
    const { data, error } = await signIn(email, password);
    if (error) return { error };

    saveTokens({ access: data.access, refresh: data.refresh });
    const userData = buildUserFromAuth(data);
    saveUser(userData);
    setUser(userData);

    const { data: profileData, error: profileError } = await fetchMyProfile();
    if (profileError) {
      clearTokens();
      setUser(null);
      return { error: `Login succeeded but profile fetch failed: ${profileError}` };
    }
    if (profileData) applyAccountPayload(profileData);

    return { error: null };
  }, [applyAccountPayload]);

  const register = useCallback(async (payload, profilePhoto = null) => {
    const { data, error } = await signUp(payload, profilePhoto);
    if (error) return { error };

    saveTokens({ access: data.access, refresh: data.refresh });
    const userData = buildUserFromAuth(data);
    saveUser(userData);
    setUser(userData);

    const { data: profileData } = await fetchMyProfile();
    if (profileData) applyAccountPayload(profileData);

    return { error: null };
  }, [applyAccountPayload]);

  const logout = useCallback(() => {
    clearTokens();
    setUser(null);
    setProfile(null);
    setIdealPartner(null);
    setAccount(null);
  }, []);

  const refreshProfile = useCallback(async () => {
    const { data } = await fetchMyProfile();
    if (data) applyAccountPayload(data);
  }, [applyAccountPayload]);

  const updateProfile = useCallback(async (fields) => {
    const { data, error } = await updateMyProfile(fields);
    if (error) return { error };
    applyAccountPayload(data);
    return { error: null };
  }, [applyAccountPayload]);

  const saveIdealPartner = useCallback(async (fields) => {
    const { data, error } = await updateIdealPartner(fields);
    if (error) return { error };
    if (data?.ideal_partner) setIdealPartner(data.ideal_partner);
    if (data?.account) setAccount(data.account);
    return { error: null };
  }, []);

  return (
    <AuthContext.Provider
      value={{
        user,
        profile,
        idealPartner,
        account,
        loading,
        login,
        register,
        logout,
        refreshProfile,
        updateProfile,
        saveIdealPartner,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used inside <AuthProvider>');
  return ctx;
}
