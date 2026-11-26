import { NavLink, Link } from 'react-router-dom';
import { BrainCog, LibraryBig, User } from 'lucide-react'
import './Navbar.css';

export default function Navbar() {
  return (
    <nav className="navbar" aria-label="Primary">
      <Link to="/library" className="navbar-brand">
        <BrainCog size={22} strokeWidth={1.75} aria-hidden="true" />
        <span className="brand-text">Knoviq</span>
      </Link>

      <ul className="navbar-links">
        <li>
          <NavLink
            to="/library"
            className={({ isActive }) => (isActive ? 'nav-link active' : 'nav-link')}
          >
            <LibraryBig size={18} strokeWidth={1.75} aria-hidden="true" />
            Library
          </NavLink>
        </li>
        <li>
          <NavLink
            to="/profile"
            className={({ isActive }) => (isActive ? 'nav-link active' : 'nav-link')}
          >
            <User size={18} strokeWidth={1.75} aria-hidden="true" />
            Profile
          </NavLink>
        </li>
      </ul>
    </nav>
  );
}
