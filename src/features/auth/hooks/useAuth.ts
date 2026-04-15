import { useEffect, useState } from 'react';
import { supabase } from '../../../lib/supabase';
import {
  getCurrentSession,
  signInAnonymously,
  signOut,
} from '../services/authService';

export function useAuth() {
  const [user, setUser] = useState<any | null>(null);
  const [loading, setLoading] = useState(true);
  const [authLoading, setAuthLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let mounted = true;

    async function initAuth() {
      try {
        setLoading(true);
        const session = await getCurrentSession();

        if (!mounted) return;
        setUser(session?.user ?? null);
      } catch (err) {
        if (!mounted) return;
        setError(err instanceof Error ? err.message : 'Failed to load session');
      } finally {
        if (!mounted) return;
        setLoading(false);
      }
    }

    initAuth();

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
      setLoading(false);
    });

    return () => {
      mounted = false;
      subscription.unsubscribe();
    };
  }, []);

  async function login() {
    try {
      setAuthLoading(true);
      setError(null);
      await signInAnonymously();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Login failed');
    } finally {
      setAuthLoading(false);
    }
  }

  async function logout() {
    try {
      setAuthLoading(true);
      setError(null);
      await signOut();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Logout failed');
    } finally {
      setAuthLoading(false);
    }
  }

  return {
    user,
    loading,
    authLoading,
    error,
    isLoggedIn: !!user,
    login,
    logout,
  };
}