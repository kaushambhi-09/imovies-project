// Builds the seat layout of a theatre: Balcony (B), Middle (M), Lower (L)
function buildSeats(t) {
  const tiers = [
    ['B', 'Balcony', t.balconySeats, t.balconyPrice],
    ['M', 'Middle', t.middleSeats, t.middlePrice],
    ['L', 'Lower', t.lowerSeats, t.lowerPrice],
  ];
  const seats = [];
  tiers.forEach(([p, tier, count, price]) => {
    for (let i = 1; i <= count; i++) seats.push({ id: `${p}${i}`, tier, price });
  });
  return seats;
}
module.exports = { buildSeats };
