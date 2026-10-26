import { useCallback, useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import api, { errMsg } from '../api.js';
import { useAuth } from '../context/AuthContext.jsx';

const fmtTime = (t) => { const [h, m] = t.split(':').map(Number); return `${((h + 11) % 12) + 1}:${String(m).padStart(2, '0')} ${h >= 12 ? 'PM' : 'AM'}`; };

export default function MovieDetails() {
  const { id } = useParams();
  const { auth } = useAuth();
  const [movie, setMovie] = useState(null);
  const [shows, setShows] = useState([]);
  const [reviews, setReviews] = useState([]);
  const [rv, setRv] = useState({ rating: 5, comment: '' });
  const [msg, setMsg] = useState('');

  const load = useCallback(async () => {
    try {
      const [m, s, r] = await Promise.all([api.get(`/movies/${id}`), api.get(`/shows/movie/${id}`), api.get(`/reviews/movie/${id}`)]);
      setMovie(m.data); setShows(s.data); setReviews(r.data);
    } catch (e) { setMsg(errMsg(e)); }
  }, [id]);
  useEffect(() => { load(); }, [load]);

  const addFav = async () => { try { const { data } = await api.post(`/favorites/${id}`); setMsg(data.favorite ? 'Added to watchlist' : 'Removed from watchlist'); } catch (e) { setMsg(errMsg(e)); } };
  const sendReview = async (e) => { e.preventDefault(); try { await api.post(`/reviews/movie/${id}`, rv); setRv({ rating: 5, comment: '' }); load(); } catch (e2) { setMsg(errMsg(e2)); } };

  if (!movie) return <p className="muted">{msg || 'Loading…'}</p>;
  const byDate = shows.reduce((a, s) => ((a[s.showDate] ||= []).push(s), a), {});

  return (
    <>
      <section className="panel">
        <h1>{movie.movieName}</h1>
        <p className="muted">{movie.genres.join(', ')} · {movie.language}{movie.runtime ? ` · ${movie.runtime} min` : ''} · {movie.certification} · {movie.avgRating ? `${movie.avgRating}/5 (${movie.reviewCount})` : 'No ratings yet'}</p>
        <p>{movie.description}</p>
        {auth?.role === 'user' && <button className="btn btn-outline" onClick={addFav}>♡ Watchlist</button>}
        {msg && <p className="muted">{msg}</p>}
      </section>

      <h2>Showtimes</h2>
      {shows.length === 0 && <p className="muted">No upcoming shows yet.</p>}
      {Object.entries(byDate).map(([date, list]) => (
        <div key={date} className="panel">
          <h3>{new Date(date + 'T00:00').toDateString()}</h3>
          <div className="row wrap">
            {list.map((s) => (
              <Link key={s._id} className="btn btn-outline" to={auth ? `/shows/${s._id}/seats` : '/login'}>
                {fmtTime(s.showTime)} · {s.theatre.theatreName}
              </Link>
            ))}
          </div>
        </div>
      ))}

      <h2>Reviews</h2>
      {auth?.role === 'user' && (
        <form className="panel form" onSubmit={sendReview}>
          <label>Rating
            <select value={rv.rating} onChange={(e) => setRv({ ...rv, rating: Number(e.target.value) })}>{[5, 4, 3, 2, 1].map((n) => <option key={n} value={n}>{n} / 5</option>)}</select>
          </label>
          <label>Comment<textarea maxLength={500} value={rv.comment} onChange={(e) => setRv({ ...rv, comment: e.target.value })} /></label>
          <button className="btn btn-primary">Submit review</button>
        </form>
      )}
      {reviews.length === 0 && <p className="muted">No reviews yet.</p>}
      {reviews.map((r) => <div className="panel" key={r._id}><strong>{r.user?.username || 'User'}</strong> · {r.rating}/5<p className="muted">{r.comment}</p></div>)}
    </>
  );
}
