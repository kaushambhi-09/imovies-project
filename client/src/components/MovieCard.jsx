import { Link } from 'react-router-dom';

const COLORS = ['#E11D48', '#F59E0B', '#14B8A6', '#6366F1', '#EC4899'];
const DARK_TEXT = new Set(['#F59E0B', '#14B8A6', '#EC4899']);
export const colorFor = (name = '') => COLORS[[...name].reduce((a, c) => a + c.charCodeAt(0), 0) % COLORS.length];

export default function MovieCard({ movie, action }) {
  const bg = colorFor(movie.movieName);
  return (
    <article className="card">
      <Link to={`/movies/${movie._id}`} className="poster" style={{ background: movie.posterUrl ? `center / cover url(${movie.posterUrl})` : bg, color: DARK_TEXT.has(bg) ? '#0B0D17' : '#fff' }}>
        <span className="chip">{movie.certification || 'UA'}</span>
        {!movie.posterUrl && <h3>{movie.movieName}</h3>}
      </Link>
      <div className="card-body">
        {movie.posterUrl && <h3 className="card-title">{movie.movieName}</h3>}
        <p className="muted">{movie.genres?.join(', ')} · {movie.language}</p>
        {action || <Link className="btn btn-outline" to={`/movies/${movie._id}`}>Book now</Link>}
      </div>
    </article>
  );
}
