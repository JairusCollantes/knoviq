import { useEffect, useState } from 'react';
import { NavLink, Link, useNavigate } from 'react-router-dom';
import { BrainCog, LibraryBig, LogIn, LogOut } from 'lucide-react';
import { useAuth } from '../hooks/useAuth';
import { api } from '../lib/apiClient';
import './Navbar.css';

function initialsOf(text) {
  const letters = String(text || '')
    .split(/\s+/)
    .filter(Boolean)
    .map((word) => word[0])
    .join('');
  return (letters.slice(0, 2) || 'K').toUpperCase();
}

export default function Navbar() {
  const { user, signOut } = useAuth();
  const navigate = useNavigate();
  const [profile, setProfile] = useState({ id: null, name: '' });

  useEffect(() => {
    if (!user) return undefined;
    let cancelled = false;
    api.profile()
      .then((data) => {
        if (!cancelled) setProfile({ id: user.id, name: data?.profile?.name || '' });
      })
      .catch(() => {});
    return () => {
      cancelled = true;
    };
  }, [user]);

  async function handleSignOut() {
    await signOut();
    navigate('/library');
  }

  const fetchedName = profile.id === user?.id ? profile.name : '';
  const label = fetchedName || user?.email || '';
  const linkClass = ({ isActive }) => (isActive ? 'nav-link active' : 'nav-link');

  return (
    <nav className="navbar" aria-label="Primary">
      <Link to="/library" className="navbar-brand">
        <BrainCog size={22} strokeWidth={1.75} aria-hidden="true" />
        <span className="brand-text">Knoviq</span>
      </Link>

      <ul className="navbar-links">
        <li>
          <NavLink to="/library" className={linkClass}>
            <LibraryBig size={18} strokeWidth={1.75} aria-hidden="true" />
            Library
          </NavLink>
        </li>

        {user ? (
          <>
            <li>
              <NavLink to="/profile" className={linkClass} title={user.email}>
                <span className="nav-avatar" aria-hidden="true">{initialsOf(label)}</span>
                <span className="nav-user-name">{label}</span>
              </NavLink>
            </li>
            <li>
              <button type="button" className="nav-link nav-signout" onClick={handleSignOut}>
                <LogOut size={18} strokeWidth={1.75} aria-hidden="true" />
                Sign out
              </button>
            </li>
          </>
        ) : (
          <li>
            <NavLink to="/login" className={linkClass}>
              <LogIn size={18} strokeWidth={1.75} aria-hidden="true" />
              Login
            </NavLink>
          </li>
        )}
      </ul>
    </nav>
  );
}
