import { useEffect, useState } from 'react';
import { supabase, isSupabaseConfigured } from '../lib/supabase';
import { AuthContext } from './auth-context';

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(() => isSupabaseConfigured());

  useEffect(() => {
    if (!supabase) return undefined;
    let cancelled = false;
    supabase.auth.getSession().then(({ data }) => {
      if (!cancelled) { setUser(data?.session?.user || null); setLoading(false); }
    });
    const { data: sub } = supabase.auth.onAuthStateChange((_e, session) => setUser(session?.user || null));
    return () => { cancelled = true; sub?.subscription?.unsubscribe(); };
  }, []);

  async function signOut() {
    if (supabase) await supabase.auth.signOut();
    setUser(null);
  }

  return <AuthContext.Provider value={{ user, loading, configured: isSupabaseConfigured(), signOut }}>{children}</AuthContext.Provider>;
}
