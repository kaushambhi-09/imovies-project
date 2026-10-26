import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api, { errMsg } from '../../api.js';

const num = ['balconyPrice', 'balconySeats', 'middlePrice', 'middleSeats', 'lowerPrice', 'lowerSeats'];
const label = { balconyPrice: 'Balcony seat price', balconySeats: 'Balcony seat count', middlePrice: 'Middle seat price', middleSeats: 'Middle seat count', lowerPrice: 'Lower seat price', lowerSeats: 'Lower seat count' };

export default function AddTheatre() {
  const [f, setF] = useState({ theatreName: '', location: '', balconyPrice: '', balconySeats: '', middlePrice: '', middleSeats: '', lowerPrice: '', lowerSeats: '' });
  const [err, setErr] = useState('');
  const nav = useNavigate();
  const set = (k) => (e) => setF({ ...f, [k]: e.target.value });
  const submit = async (e) => {
    e.preventDefault();
    const body = { ...f }; num.forEach((k) => { body[k] = Number(body[k]); });
    try { await api.post('/theatres', body); nav('/admin'); } catch (e2) { setErr(errMsg(e2)); }
  };
  return (
    <form className="panel form narrow" onSubmit={submit}>
      <h2>Add <span className="accent">theatre</span></h2>
      {err && <p className="error" role="alert">{err}</p>}
      <label>Theatre name<input required value={f.theatreName} onChange={set('theatreName')} /></label>
      <label>Location<input required value={f.location} onChange={set('location')} /></label>
      <div className="two">{num.map((k) => <label key={k}>{label[k]}<input type="number" min="0" required value={f[k]} onChange={set(k)} /></label>)}</div>
      <button className="btn btn-primary">Submit</button>
    </form>
  );
}
