import { useEffect, useState } from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import { supabase, isSupabaseConfigured } from '../lib/supabase';
import './Library.css';

const callbackUrl = () => `${window.location.origin}/auth/callback`;

export default function Login() {
  const navigate = useNavigate();
  const location = useLocation();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [mode, setMode] = useState('signin');
  const [error, setError] = useState('');
  const [busy, setBusy] = useState(false);
  const [pendingEmail, setPendingEmail] = useState('');
  const [cooldown, setCooldown] = useState(0);
  const configured = isSupabaseConfigured();
  const nextPath = location.state?.from?.pathname || '/library';

  useEffect(() => {
    if (!cooldown) return undefined;
    const timer = setTimeout(() => setCooldown((s) => s - 1), 1000);
    return () => clearTimeout(timer);
  }, [cooldown]);

  async function submit(e) {
    e.preventDefault();
    setError('');
    if (!supabase) {
      setError('Supabase not configured. Set VITE_SUPABASE_URL / VITE_SUPABASE_PUBLISHABLE_KEY.');
      return;
    }
    setBusy(true);
    try {
      if (mode === 'signup') {
        const { data, error: err } = await supabase.auth.signUp({
          email,
          password,
          options: { emailRedirectTo: callbackUrl() },
        });
        if (err) throw err;
        if (data.session) {
          navigate(nextPath, { replace: true });
          return;
        }
        setPendingEmail(email);
      } else {
        const { error: err } = await supabase.auth.signInWithPassword({ email, password });
        if (err) throw err;
        navigate(nextPath, { replace: true });
      }
    } catch (err) {
      if (/email not confirmed/i.test(err?.message || '')) setPendingEmail(email);
      setError(err?.message || 'Something went wrong.');
    } finally {
      setBusy(false);
    }
  }

  async function resend() {
    setError('');
    setBusy(true);
    try {
      const { error: err } = await supabase.auth.resend({
        type: 'signup',
        email: pendingEmail,
        options: { emailRedirectTo: callbackUrl() },
      });
      if (err) throw err;
      setCooldown(60);
    } catch (err) {
      setError(err?.message || 'Could not resend the email.');
    } finally {
      setBusy(false);
    }
  }

  if (pendingEmail) {
    return (
      <div className="library">
        <header className="lib-header">
          <h1>Check your inbox</h1>
          <p className="lib-subtitle">
            We sent a confirmation link to <strong>{pendingEmail}</strong>.
          </p>
        </header>
        <p className="lib-subtitle">
          Click the link to finish creating your account — it will sign you in automatically. It can take a
          minute, so check spam too.
        </p>
        {error && (
          <div className="lib-empty" style={{ borderColor: '#7f1d1d', color: '#fca5a5' }}>
            {error}
          </div>
        )}
        <div style={{ display: 'grid', gap: '0.75rem', marginTop: '1.5rem' }}>
          <button
            className="generate-btn"
            type="button"
            onClick={resend}
            disabled={busy || cooldown > 0}
          >
            {cooldown > 0 ? `Resend in ${cooldown}s` : busy ? 'Sending…' : 'Resend confirmation email'}
          </button>
          <button
            type="button"
            className="search-clear"
            onClick={() => {
              setPendingEmail('');
              setMode('signin');
              setError('');
            }}
          >
            Back to sign in
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="library">
      <header className="lib-header">
        <h1>{mode === 'signup' ? 'Create account' : 'Login'}</h1>
        <p className="lib-subtitle">
          {mode === 'signup'
            ? 'Sign up to save attempts, generate lessons with Rora, and track mastery.'
            : 'Sign in to pick up where you left off.'}
        </p>
      </header>
      {!configured && <div className="lib-empty">Supabase env missing — login disabled until VITE_SUPABASE_URL is set. Static demo data still works.</div>}
      <form onSubmit={submit} style={{ display: 'grid', gap: '0.75rem', marginTop: '1rem' }}>
        <label style={{ display: 'grid', gap: '0.35rem', color: '#a3a3a3', fontSize: '0.85rem' }}>
          Email
          <input className="search-input" style={{ border: '1px solid #262626', borderRadius: 12, padding: '0.7rem 0.9rem' }} value={email} onChange={(e) => setEmail(e.target.value)} type="email" autoComplete="email" required />
        </label>
        <label style={{ display: 'grid', gap: '0.35rem', color: '#a3a3a3', fontSize: '0.85rem' }}>
          Password
          <input className="search-input" style={{ border: '1px solid #262626', borderRadius: 12, padding: '0.7rem 0.9rem' }} value={password} onChange={(e) => setPassword(e.target.value)} type="password" autoComplete={mode === 'signup' ? 'new-password' : 'current-password'} required minLength={6} />
        </label>
        {error && <div className="lib-empty" style={{ borderColor: '#7f1d1d', color: '#fca5a5' }}>{error}</div>}
        <button className="generate-btn" type="submit" disabled={busy || !configured} style={mode === 'signin' ? {} : { borderStyle: 'solid' }}>
          {busy ? 'Working…' : mode === 'signup' ? 'Create account' : 'Sign in'}
        </button>
        <button type="button" className="search-clear" onClick={() => setMode(mode === 'signup' ? 'signin' : 'signup')}>
          {mode === 'signup' ? 'Have an account? Sign in' : 'Need an account? Sign up'}
        </button>
        <Link to="/library" className="search-clear" style={{ textAlign: 'center', textDecoration: 'none' }}>
          Continue without login (static demo)
        </Link>
      </form>
    </div>
  );
}
