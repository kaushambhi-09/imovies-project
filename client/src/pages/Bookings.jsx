import { useEffect, useState } from 'react';
import api, { errMsg } from '../api.js';

export default function Bookings() {
  const [list, setList] = useState([]);
  const [err, setErr] = useState('');
  const load = () => api.get('/bookings/mine').then((r) => setList(r.data)).catch((e) => setErr(errMsg(e)));
  useEffect(() => { load(); }, []);
  const cancel = async (id) => {
    if (!window.confirm('Cancel this booking?')) return;
    try { await api.put(`/bookings/${id}/cancel`); setErr(''); load(); } catch (e) { setErr(errMsg(e)); }
  };
  return (
    <>
      <h2>Your <span className="accent">bookings</span></h2>
      {err && <p className="error">{err}</p>}
      {list.length === 0 && !err && <p className="muted">No bookings yet.</p>}
      <div className="grid-2">
        {list.map((b) => (
          <article className="panel" key={b._id}>
            <div className="between"><h3>{b.show?.movie?.movieName || 'Removed movie'}</h3><span className={`tag ${b.status}`}>{b.status}</span></div>
            <p className="muted">{b.show?.theatre?.theatreName} · {b.show?.showDate} · {b.show?.showTime}</p>
            <p>Seats: {b.seats.join(', ')}</p>
            <p>Total ₹{b.totalPrice} · {b.paymentMethod} · {b.paymentStatus}</p>
            <p className="muted">Booking code {b.bookingCode}</p>
            {b.status === 'confirmed' && <button className="btn btn-outline" onClick={() => cancel(b._id)}>Cancel booking</button>}
          </article>
        ))}
      </div>
    </>
  );
}
