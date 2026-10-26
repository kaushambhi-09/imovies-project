const Show = require('../models/showModel');
const Theatre = require('../models/theatreModel');
const Booking = require('../models/bookingModel');
const asyncHandler = require('../utils/asyncHandler');
const { buildSeats } = require('../utils/seats');

const today = () => new Date().toISOString().slice(0, 10);

exports.byMovie = asyncHandler(async (req, res) => {
  const shows = await Show.find({ movie: req.params.movieId, showDate: { $gte: today() } })
    .populate('theatre', 'theatreName location').select('-bookedSeats').sort({ showDate: 1, showTime: 1 });
  res.json(shows);
});
exports.get = asyncHandler(async (req, res) => {
  const show = await Show.findById(req.params.id).populate('movie', 'movieName posterUrl language').populate('theatre');
  if (!show) { res.status(404); throw new Error('Show not found'); }
  const booked = new Set(show.bookedSeats);
  const seats = buildSeats(show.theatre).map((s) => ({ ...s, booked: booked.has(s.id) }));
  res.json({ _id: show._id, movie: show.movie, theatre: { _id: show.theatre._id, theatreName: show.theatre.theatreName, location: show.theatre.location }, showDate: show.showDate, showTime: show.showTime, seats });
});
exports.all = asyncHandler(async (req, res) =>
  res.json(await Show.find().populate('movie', 'movieName').populate('theatre', 'theatreName').select('-bookedSeats').sort({ showDate: -1, showTime: 1 })));
exports.create = asyncHandler(async (req, res) => {
  const { movie, theatre, showDate, showTime } = req.body;
  if (!movie || !theatre || !showDate || !showTime) { res.status(400); throw new Error('Movie, theatre, date and time are required'); }
  if (!(await Theatre.exists({ _id: theatre }))) { res.status(404); throw new Error('Theatre not found'); }
  if (await Show.exists({ theatre, showDate, showTime })) { res.status(409); throw new Error('That theatre already has a show at this date and time'); }
  res.status(201).json(await Show.create({ movie, theatre, showDate, showTime, createdBy: req.user._id }));
});
exports.remove = asyncHandler(async (req, res) => {
  const show = await Show.findByIdAndDelete(req.params.id);
  if (!show) { res.status(404); throw new Error('Show not found'); }
  await Booking.updateMany({ show: show._id, status: 'confirmed' }, { status: 'cancelled', paymentStatus: 'refunded' });
  res.json({ message: 'Show removed; existing bookings were cancelled and marked refunded' });
});
