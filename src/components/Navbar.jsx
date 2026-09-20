import { NavLink } from 'react-router-dom';
import { BrainCog, LayoutDashboard, LibraryBig, User } from 'lucide-react'
import './Navbar.css';

export default function Navbar() {
  return (
    <nav className="navbar">
      <div className="navbar-brand">
        <BrainCog />
        <span className="brand-text">Knoviq</span>
      </div>

      <div className="navbar-links">
        <NavLink
          to="/dashboard"
          className={({ isActive }) => (isActive ? 'nav-link active' : 'nav-link')}
        >
          <LayoutDashboard />
          Dashboard
        </NavLink>
        <NavLink
          to="/library"
          className={({ isActive }) => (isActive ? 'nav-link active' : 'nav-link')}
        >
          <LibraryBig />
          Library
        </NavLink>
        <NavLink
          to="/profile"
          className={({ isActive }) => (isActive ? 'nav-link active' : 'nav-link')}
        >
          <User />
          Profile
        </NavLink>
      </div>
    </nav>
  );
}