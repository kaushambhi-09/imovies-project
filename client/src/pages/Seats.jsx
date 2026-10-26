import { useEffect, useMemo, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import api, { errMsg } from '../api.js';

const TIERS = ['Balcony', 'Middle', 'Lower'];

export default function Seats() {
  const { id } = useParams();
  const nav = useNavigate();
  const [show, setShow] = useState(null);
  const [picked, setPicked] = useState([]);
  const [method, setMethod] = useState('card');
  const [err, setErr] = useState('');
  const [busy, setBusy] = useState(false);

  // Poll so seats taken by other users appear without a refresh
  useEffect(() => {
    let live = true;
    const load = async () => {
      try {
        const { data } = await api.get(`/shows/${id}`);
        if (!live) return;
        setShow(data);
        setPicked((p) => p.filter((s) => !data.seats.find((x) => x.id === s)?.booked));
      } catch (e) { if (live) setErr(errMsg(e)); }
    };
    load();
    const t = setInterval(load, 5000);
    return () => { live = false; clearInterval(t); };
  }, [id]);

  const total = useMemo(() => show ? picked.reduce((s, p) => s + show.seats.find((x) => x.id === p).price, 0) : 0, [picked, show]);
  const toggle = (s) => { if (s.booked) return; setPicked((p) => (p.includes(s.id) ? p.filter((x) => x !== s.id) : p.length < 10 ? [...p, s.id] : p)); };

  const pay = async () => {
    setBusy(true); setErr('');
    try { await api.post('/bookings', { showId: id, seats: picked, paymentMethod: method }); nav('/bookings'); }
    catch (e) { setErr(errMsg(e)); } finally { setBusy(false); }
  };

  if (!show) return <p className="muted">{err || 'Loading…'}</p>;
  return (
    <>
      <h1>{show.movie.movieName}</h1>
      <p className="muted">{show.theatre.theatreName}, {show.theatre.location} · {show.showDate} · {show.showTime}</p>
      <div className="screen" aria-hidden="true">SCREEN</div>
      {TIERS.map((tier) => {
        const seats = show.seats.filter((s) => s.tier === tier);
        if (!seats.length) return null;
        return (
          <div key={tier} className="tier">
            <h3>{tier} <span className="muted">₹{seats[0].price}</span></h3>
            <div className="seats">
              {seats.map((s) => (
                <button key={s.id} disabled={s.booked} aria-pressed={picked.includes(s.id)} aria-label={`Seat ${s.id}${s.booked ? ' taken' : ''}`}
                  className={`seat ${s.booked ? 'taken' : ''} ${picked.includes(s.id) ? 'sel' : ''}`} onClick={() => toggle(s)}>{s.id.slice(1)}</button>
              ))}
            </div>
          </div>
        );
      })}
      <div className="legend muted"><i className="seat" /> Available <i className="seat sel" /> Selected <i className="seat taken" /> Taken</div>
      <div className="panel checkout">
        <div><strong>{picked.length} seat(s)</strong><span className="muted"> {picked.join(', ')}</span><p className="total">Total ₹{total}</p></div>
        <select aria-label="Payment method" value={method} onChange={(e) => setMethod(e.target.value)}>
          <option value="card">Card</option><option value="upi">UPI</option><option value="netbanking">Net banking</option>
        </select>
        <button className="btn btn-primary" disabled={!picked.length || busy} onClick={pay}>{busy ? 'Processing…' : 'Pay & confirm'}</button>
      </div>
      {err && <p className="error" role="alert">{err}</p>}
    </>
  );
}
