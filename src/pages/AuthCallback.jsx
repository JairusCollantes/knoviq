import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import './Library.css';

const TIMEOUT_MS = 10000;

function readUrlError() {
  const hash = window.location.hash.replace(/^#/, '');
  const params = new URLSearchParams(hash || window.location.search);
  const message = params.get('error_description') || params.get('error');
  return message ? decodeURIComponent(message.replace(/\+/g, ' ')) : '';
}

export default function AuthCallback() {
  const navigate = useNavigate();
  const { user, loading } = useAuth();
  const [urlError] = useState(readUrlError);
  const [timedOut, setTimedOut] = useState(false);

  useEffect(() => {
    if (user) navigate('/library', { replace: true });
  }, [user, navigate]);

  useEffect(() => {
    const timer = setTimeout(() => setTimedOut(true), TIMEOUT_MS);
    return () => clearTimeout(timer);
  }, []);

  if (urlError) {
    return (
      <div className="library">
        <header className="lib-header">
          <h1>Link not valid</h1>
          <p className="lib-subtitle">{urlError}</p>
        </header>
        <Link to="/login" className="generate-btn" style={{ display: 'inline-flex', justifyContent: 'center' }}>
          Back to sign in
        </Link>
      </div>
    );
  }

  if (!loading && timedOut) {
    return (
      <div className="library">
        <header className="lib-header">
          <h1>Confirmation link expired</h1>
          <p className="lib-subtitle">
            This link is invalid or has already been used. Request a new one from the sign-in page.
          </p>
        </header>
        <Link to="/login" className="generate-btn" style={{ display: 'inline-flex', justifyContent: 'center' }}>
          Back to sign in
        </Link>
      </div>
    );
  }

  return (
    <div className="library">
      <header className="lib-header">
        <h1>Confirming your email…</h1>
        <p className="lib-subtitle">Hang tight, this only takes a second.</p>
      </header>
    </div>
  );
}
