import { Link, NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';

export default function Navbar() {
  const { auth, logout } = useAuth();
  const nav = useNavigate();
  const out = () => { logout(); nav('/'); };
  return (
    <header className="nav">
      <Link to="/" className="logo"><span>i</span>Movies</Link>
      <nav className="nav-links">
        <NavLink to="/movies">Movies</NavLink>
        {auth?.role === 'user' && <><NavLink to="/bookings">My bookings</NavLink><NavLink to="/favorites">Watchlist</NavLink></>}
        {auth?.role === 'admin' && <NavLink to="/admin">Dashboard</NavLink>}
      </nav>
      <div className="nav-actions">
        {auth ? (
          <>
            <span className="muted hide-sm">{auth.user.username}</span>
            <button className="btn btn-ghost" onClick={out}>Log out</button>
          </>
        ) : (
          <>
            <Link className="btn btn-ghost" to="/register">Sign up</Link>
            <Link className="btn btn-primary" to="/login">Sign in</Link>
          </>
        )}
      </div>
    </header>
  );
}
