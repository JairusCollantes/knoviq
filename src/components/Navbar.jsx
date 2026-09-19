import { NavLink } from 'react-router-dom';
import './Navbar.css';

export default function Navbar() {
  return (
    <nav className="navbar">
      <div className="navbar-brand">
        <span className="brand-icon">🧠</span>
        <span className="brand-text">StudyFlow</span>
      </div>

      <div className="navbar-links">
        <NavLink
          to="/dashboard"
          className={({ isActive }) => (isActive ? 'nav-link active' : 'nav-link')}
        >
          <span className="nav-icon">📊</span>
          Dashboard
        </NavLink>
        <NavLink
          to="/practice"
          className={({ isActive }) => (isActive ? 'nav-link active' : 'nav-link')}
        >
          <span className="nav-icon">📚</span>
          Library
        </NavLink>
        <NavLink
          to="/profile"
          className={({ isActive }) => (isActive ? 'nav-link active' : 'nav-link')}
        >
          <span className="nav-icon">👤</span>
          Profile
        </NavLink>
      </div>
    </nav>
  );
}