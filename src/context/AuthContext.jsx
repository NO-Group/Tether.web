import { createContext, useContext, useEffect, useState, useCallback } from 'react';
import { supabase, isConfigured } from '../supabaseClient.js';
import { getMyProfile } from '../lib/api.js';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [session, setSession] = useState(null);
  const [user, setUser] = useState(null);
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);

  const refreshProfile = useCallback(async (uid) => {
    if (!uid) return null;
    try {
      const p = await getMyProfile(uid);
      setProfile(p);
      return p;
    } catch (e) {
      console.error('profile load failed', e);
      return null;
    }
  }, []);

  useEffect(() => {
    if (!isConfigured || !supabase) {
      setLoading(false);
      return;
    }
    supabase.auth.getSession().then(({ data }) => {
      const s = data.session;
      setSession(s);
      if (s?.user) {
        setUser(s.user);
        refreshProfile(s.user.id);
      }
      setLoading(false);
    });

    const { data: sub } = supabase.auth.onAuthStateChange((_event, s) => {
      setSession(s);
      setUser(s?.user ?? null);
      if (s?.user) refreshProfile(s.user.id);
      else setProfile(null);
    });
    return () => sub?.subscription?.unsubscribe();
  }, [refreshProfile]);

  const signOut = useCallback(async () => {
    await supabase.auth.signOut();
    setUser(null);
    setProfile(null);
  }, []);

  const value = {
    supabase,
    session,
    user,
    profile,
    refreshProfile,
    signOut,
    loading,
    isConfigured,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  return useContext(AuthContext);
}
