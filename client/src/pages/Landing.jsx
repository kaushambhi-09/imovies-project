import { Link } from 'react-router-dom';

const features = [
  ['Live seat map', 'See what is free and pick your spot before you pay.'],
  ['Secure payments', 'Pay for your tickets and keep a record of every booking.'],
  ['Booking history', 'Review upcoming shows, cancel or write a review.'],
];

export default function Landing() {
  return (
    <>
      <section className="hero">
        <div>
          <span className="eyebrow">NOW SHOWING</span>
          <h1>Pick your seat.<br />Own the night.</h1>
          <p className="lead">Browse what is playing, choose a showtime and reserve seats in real time. Tickets in minutes.</p>
          <div className="row">
            <Link className="btn btn-primary btn-lg" to="/movies">Book tickets</Link>
            <Link className="btn btn-ghost btn-lg" to="/register">Create account</Link>
          </div>
        </div>
        <div className="hero-art" aria-hidden="true">
          <div className="seat-grid">{Array.from({ length: 32 }, (_, i) => <i key={i} className={[3, 4, 10, 11, 12, 19, 20, 27].includes(i) ? 'taken' : [13, 14].includes(i) ? 'sel' : ''} />)}</div>
        </div>
      </section>
      <section className="grid-3">
        {features.map(([t, d]) => <div className="panel" key={t}><h3>{t}</h3><p className="muted">{d}</p></div>)}
      </section>
    </>
  );
}
