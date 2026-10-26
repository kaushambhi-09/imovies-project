import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api, { errMsg } from '../../api.js';

export default function AddShow() {
  const [theatres, setTheatres] = useState([]);
  const [movies, setMovies] = useState([]);
  const [f, setF] = useState({ theatre: '', movie: '', showDate: '', showTime: '' });
  const [err, setErr] = useState('');
  const nav = useNavigate();
  useEffect(() => { Promise.all([api.get('/theatres'), api.get('/movies')]).then(([t, m]) => { setTheatres(t.data); setMovies(m.data); }).catch((e) => setErr(errMsg(e))); }, []);
  const set = (k) => (e) => setF({ ...f, [k]: e.target.value });
  const submit = async (e) => { e.preventDefault(); try { await api.post('/shows', f); nav('/admin'); } catch (e2) { setErr(errMsg(e2)); } };
  return (
    <form className="panel form narrow" onSubmit={submit}>
      <h2>Add <span className="accent">show</span></h2>
      {err && <p className="error" role="alert">{err}</p>}
      <label>Theatre<select required value={f.theatre} onChange={set('theatre')}><option value="">Select theatre</option>{theatres.map((t) => <option key={t._id} value={t._id}>{t.theatreName}</option>)}</select></label>
      <label>Movie<select required value={f.movie} onChange={set('movie')}><option value="">Select movie</option>{movies.map((m) => <option key={m._id} value={m._id}>{m.movieName}</option>)}</select></label>
      <label>Show date<input type="date" required value={f.showDate} onChange={set('showDate')} /></label>
      <label>Show time<input type="time" required value={f.showTime} onChange={set('showTime')} /></label>
      <button className="btn btn-primary">Submit</button>
    </form>
  );
}
