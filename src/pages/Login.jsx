import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { supabase, isSupabaseConfigured } from '../lib/supabase';
import './Library.css';

export default function Login() {
  const navigate = useNavigate();
  const [email, setEmail] = useState(import.meta.env.VITE_DEMO_EMAIL || 'demo@knoviq.example');
  const [password, setPassword] = useState('');
  const [mode, setMode] = useState('signin');
  const [error, setError] = useState('');
  const [busy, setBusy] = useState(false);
  const configured = isSupabaseConfigured();

  async function submit(e) {
    e.preventDefault();
    setError('');
    if (!supabase) { setError('Supabase not configured. Set VITE_SUPABASE_URL / VITE_SUPABASE_PUBLISHABLE_KEY.'); return; }
    setBusy(true);
    try {
      const fn = mode === 'signup' ? supabase.auth.signUp({ email, password }) : supabase.auth.signInWithPassword({ email, password });
      const { error: err } = await fn;
      if (err) throw err;
      navigate('/dashboard');
    } catch (err) {
      setError(err.message);
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="library">
      <header className="lib-header">
        <h1>Login</h1>
        <p className="lib-subtitle">Sign in to save attempts, generate lessons with Rora, and track mastery.</p>
      </header>
      {!configured && <div className="lib-empty">Supabase env missing — login disabled until VITE_SUPABASE_URL is set. Static demo data still works.</div>}
      <form onSubmit={submit} style={{ display: 'grid', gap: '0.75rem', marginTop: '1rem' }}>
        <label style={{ display: 'grid', gap: '0.35rem', color: '#a3a3a3', fontSize: '0.85rem' }}>
          Email
          <input className="search-input" style={{ border: '1px solid #262626', borderRadius: 12, padding: '0.7rem 0.9rem' }} value={email} onChange={(e) => setEmail(e.target.value)} type="email" required />
        </label>
        <label style={{ display: 'grid', gap: '0.35rem', color: '#a3a3a3', fontSize: '0.85rem' }}>
          Password (demo password is generated later via npm run seed:demo)
          <input className="search-input" style={{ border: '1px solid #262626', borderRadius: 12, padding: '0.7rem 0.9rem' }} value={password} onChange={(e) => setPassword(e.target.value)} type="password" required minLength={6} />
        </label>
        {error && <div className="lib-empty" style={{ borderColor: '#7f1d1d', color: '#fca5a5' }}>{error}</div>}
        <button className="generate-btn" type="submit" disabled={busy || !configured} style={mode === 'signin' ? {} : { borderStyle: 'solid' }}>
          {busy ? 'Working…' : mode === 'signup' ? 'Create account' : 'Sign in / Continue as Raora (demo)'}
        </button>
        <button type="button" className="search-clear" onClick={() => setMode(mode === 'signin' ? 'signup' : 'signin')}>
          {mode === 'signin' ? 'Need an account? Switch to sign up' : 'Have an account? Switch to sign in'}
        </button>
        <Link to="/dashboard" className="search-clear" style={{ textAlign: 'center', textDecoration: 'none' }}>Continue without login (static demo)</Link>
      </form>
    </div>
  );
}
