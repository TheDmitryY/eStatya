import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export function Header() {
  const { isAuthenticated, logout } = useAuth();

  return (
    <header className="header">
      <div className="header-inner">
        <Link to="/" className="logo">
          📝 eStatya
        </Link>
        <nav className="nav">
          {isAuthenticated ? (
            <button className="btn btn-secondary" onClick={logout}>
              Logout
            </button>
          ) : (
            <>
              <Link to="/login" className="btn btn-secondary">
                Login
              </Link>
              <Link to="/register" className="btn btn-primary">
                Sign Up
              </Link>
            </>
          )}
        </nav>
      </div>
    </header>
  );
}
