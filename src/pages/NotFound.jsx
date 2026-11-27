import { Link } from 'react-router-dom';
import './NotFound.css';

export default function NotFound() {
  return (
    <div className="static-page nf">
      <p className="nf-kicker">404 · off the grid</p>
      <h1>This page didn&rsquo;t stick.</h1>
      <p>
        The link may be old, or the lesson was removed. Either way you are not lost — you are one click
        from somewhere useful.
      </p>
      <div className="static-actions">
        <Link to="/library" className="btn-primary">
          Back to library
        </Link>
        <Link to="/learn/java-oop" className="btn-ghost">
          Open a sample lesson
        </Link>
      </div>
      <span className="nf-dot" aria-hidden="true" />
    </div>
  );
}
