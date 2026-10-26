import { Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from './context/AuthContext.jsx';
import Navbar from './components/Navbar.jsx';
import Landing from './pages/Landing.jsx';
import AuthForm from './pages/AuthForm.jsx';
import Home from './pages/Home.jsx';
import MovieDetails from './pages/MovieDetails.jsx';
import Seats from './pages/Seats.jsx';
import Bookings from './pages/Bookings.jsx';
import Favorites from './pages/Favorites.jsx';
import Dashboard from './pages/admin/Dashboard.jsx';
import AddMovie from './pages/admin/AddMovie.jsx';
import AddTheatre from './pages/admin/AddTheatre.jsx';
import AddShow from './pages/admin/AddShow.jsx';

function Guard({ role, children }) {
  const { auth } = useAuth();
  if (!auth) return <Navigate to={role === 'admin' ? '/admin/login' : '/login'} replace />;
  if (auth.role !== role) return <Navigate to={auth.role === 'admin' ? '/admin' : '/movies'} replace />;
  return children;
}

export default function App() {
  return (
    <>
      <Navbar />
      <main className="page">
        <Routes>
          <Route path="/" element={<Landing />} />
          <Route path="/login" element={<AuthForm mode="login" />} />
          <Route path="/register" element={<AuthForm mode="register" />} />
          <Route path="/admin/login" element={<AuthForm mode="login" admin />} />
          <Route path="/admin/register" element={<AuthForm mode="register" admin />} />
          <Route path="/movies" element={<Home />} />
          <Route path="/movies/:id" element={<MovieDetails />} />
          <Route path="/shows/:id/seats" element={<Guard role="user"><Seats /></Guard>} />
          <Route path="/bookings" element={<Guard role="user"><Bookings /></Guard>} />
          <Route path="/favorites" element={<Guard role="user"><Favorites /></Guard>} />
          <Route path="/admin" element={<Guard role="admin"><Dashboard /></Guard>} />
          <Route path="/admin/movies/new" element={<Guard role="admin"><AddMovie /></Guard>} />
          <Route path="/admin/theatres/new" element={<Guard role="admin"><AddTheatre /></Guard>} />
          <Route path="/admin/shows/new" element={<Guard role="admin"><AddShow /></Guard>} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </main>
    </>
  );
}
