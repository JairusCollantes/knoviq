import { Link } from 'react-router-dom';

export default function NotFound() {
  return (
    <div className="static-page">
      <h1>Page not found</h1>
      <p>
        The page you asked for does not exist or was moved. Check the address
        for typos, or head back to somewhere familiar.
      </p>
      <div className="static-actions">
        <Link to="/dashboard" className="btn-primary">
          Back to Dashboard
        </Link>
        <Link to="/library" className="btn-ghost">
          Browse Library
        </Link>
      </div>
    </div>
  );
}
