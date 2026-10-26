import { useEffect, useState } from 'react';
import api, { errMsg } from '../api.js';
import MovieCard from '../components/MovieCard.jsx';

export default function Favorites() {
  const [movies, setMovies] = useState([]);
  const [err, setErr] = useState('');
  const load = () => api.get('/favorites').then((r) => setMovies(r.data)).catch((e) => setErr(errMsg(e)));
  useEffect(() => { load(); }, []);
  const remove = async (id) => { await api.post(`/favorites/${id}`); load(); };
  return (
    <>
      <h2>Your <span className="accent">watchlist</span></h2>
      {err && <p className="error">{err}</p>}
      {movies.length === 0 && !err && <p className="muted">Nothing saved yet.</p>}
      <div className="grid">{movies.map((m) => <MovieCard key={m._id} movie={m} action={<button className="btn btn-outline" onClick={() => remove(m._id)}>Remove</button>} />)}</div>
    </>
  );
}
