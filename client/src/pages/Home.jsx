import { useEffect, useState } from 'react';
import api, { errMsg } from '../api.js';
import MovieCard from '../components/MovieCard.jsx';

const GENRES = ['All', 'Action', 'Drama', 'Comedy', 'Thriller', 'Sci-Fi', 'Family'];

export default function Home() {
  const [movies, setMovies] = useState([]);
  const [genre, setGenre] = useState('All');
  const [search, setSearch] = useState('');
  const [state, setState] = useState('loading');
  const [err, setErr] = useState('');

  useEffect(() => {
    const t = setTimeout(async () => {
      setState('loading');
      try {
        const { data } = await api.get('/movies', { params: { search: search || undefined, genre: genre === 'All' ? undefined : genre } });
        setMovies(data); setState('ok');
      } catch (e) { setErr(errMsg(e)); setState('error'); }
    }, 250);
    return () => clearTimeout(t);
  }, [genre, search]);

  return (
    <>
      <div className="toolbar">
        <h2>Available <span className="accent">movies</span></h2>
        <input aria-label="Search movies" placeholder="Search movies" value={search} onChange={(e) => setSearch(e.target.value)} />
      </div>
      <div className="chips">
        {GENRES.map((g) => <button key={g} className={`pill ${g === genre ? 'on' : ''}`} onClick={() => setGenre(g)}>{g}</button>)}
      </div>
      {state === 'error' && <p className="error">{err}</p>}
      {state === 'loading' && <p className="muted">Loading…</p>}
      {state === 'ok' && movies.length === 0 && <p className="muted">No movies found.</p>}
      <div className="grid">{movies.map((m) => <MovieCard key={m._id} movie={m} />)}</div>
    </>
  );
}
