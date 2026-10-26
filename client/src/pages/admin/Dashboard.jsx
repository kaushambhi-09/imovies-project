import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import api, { errMsg } from '../../api.js';

export default function Dashboard() {
  const [shows, setShows] = useState([]);
  const [movies, setMovies] = useState([]);
  const [bookings, setBookings] = useState([]);
  const [err, setErr] = useState('');

  const load = async () => {
    try {
      const [s, m, b] = await Promise.all([api.get('/shows'), api.get('/movies'), api.get('/bookings')]);
      setShows(s.data); setMovies(m.data); setBookings(b.data);
    } catch (e) { setErr(errMsg(e)); }
  };
  useEffect(() => { load(); }, []);

  const del = async (url, text) => {
    if (!window.confirm(text)) return;
    try { await api.delete(url); load(); } catch (e) { setErr(errMsg(e)); }
  };
  const revenue = bookings.filter((b) => b.status === 'confirmed').reduce((s, b) => s + b.totalPrice, 0);

  return (
    <>
      <div className="toolbar"><h2>Admin <span className="accent">dashboard</span></h2>
        <div className="row wrap"><Link className="btn btn-primary" to="/admin/movies/new">Add movie</Link><Link className="btn btn-outline" to="/admin/theatres/new">Add theatre</Link><Link className="btn btn-outline" to="/admin/shows/new">Add show</Link></div>
      </div>
      {err && <p className="error">{err}</p>}
      <div className="grid-3">
        <div className="panel"><p className="muted">Movies</p><h2>{movies.length}</h2></div>
        <div className="panel"><p className="muted">Confirmed bookings</p><h2>{bookings.filter((b) => b.status === 'confirmed').length}</h2></div>
        <div className="panel"><p className="muted">Revenue</p><h2>₹{revenue}</h2></div>
      </div>

      <h3>Shows</h3>
      <div className="grid-2">
        {shows.map((s) => (
          <div className="panel between" key={s._id}>
            <div><strong>{s.movie?.movieName}</strong><p className="muted">{s.theatre?.theatreName} · {s.showDate} · {s.showTime}</p></div>
            <button className="btn btn-outline" onClick={() => del(`/shows/${s._id}`, 'Delete this show? Its bookings will be cancelled.')}>Delete</button>
          </div>
        ))}
      </div>

      <h3>Movies</h3>
      <div className="grid-2">
        {movies.map((m) => (
          <div className="panel between" key={m._id}>
            <div><strong>{m.movieName}</strong><p className="muted">{m.genres.join(', ')} · {m.language}</p></div>
            <button className="btn btn-outline" onClick={() => del(`/movies/${m._id}`, 'Delete this movie and all its shows?')}>Delete</button>
          </div>
        ))}
      </div>

      <h3>All bookings</h3>
      <div className="table-wrap">
        <table>
          <thead><tr><th>Code</th><th>User</th><th>Movie</th><th>Show</th><th>Seats</th><th>Total</th><th>Status</th></tr></thead>
          <tbody>
            {bookings.map((b) => (
              <tr key={b._id}><td>{b.bookingCode}</td><td>{b.user?.email}</td><td>{b.show?.movie?.movieName}</td><td>{b.show?.showDate} {b.show?.showTime}</td><td>{b.seats.join(', ')}</td><td>₹{b.totalPrice}</td><td>{b.status}</td></tr>
            ))}
          </tbody>
        </table>
      </div>
    </>
  );
}
