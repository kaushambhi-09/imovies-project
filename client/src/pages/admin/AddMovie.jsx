import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api, { errMsg } from '../../api.js';

export default function AddMovie() {
  const [f, setF] = useState({ movieName: '', description: '', genres: '', language: '', releaseDate: '', runtime: '', certification: 'UA', posterUrl: '' });
  const [err, setErr] = useState('');
  const nav = useNavigate();
  const set = (k) => (e) => setF({ ...f, [k]: e.target.value });
  const submit = async (e) => {
    e.preventDefault();
    try { await api.post('/movies', { ...f, runtime: f.runtime ? Number(f.runtime) : undefined }); nav('/admin'); } catch (e2) { setErr(errMsg(e2)); }
  };
  return (
    <form className="panel form narrow" onSubmit={submit}>
      <h2>Add <span className="accent">movie</span></h2>
      {err && <p className="error" role="alert">{err}</p>}
      <label>Name<input required value={f.movieName} onChange={set('movieName')} /></label>
      <label>Description<textarea required minLength={10} value={f.description} onChange={set('description')} /></label>
      <label>Genres (comma separated)<input required placeholder="Action, Thriller" value={f.genres} onChange={set('genres')} /></label>
      <label>Language<input required value={f.language} onChange={set('language')} /></label>
      <label>Release date<input type="date" required value={f.releaseDate} onChange={set('releaseDate')} /></label>
      <label>Runtime (minutes)<input type="number" min="1" value={f.runtime} onChange={set('runtime')} /></label>
      <label>Certification<input value={f.certification} onChange={set('certification')} /></label>
      <label>Poster URL (optional)<input type="url" value={f.posterUrl} onChange={set('posterUrl')} /></label>
      <button className="btn btn-primary">Submit</button>
    </form>
  );
}
