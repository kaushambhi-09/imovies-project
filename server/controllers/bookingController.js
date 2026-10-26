const crypto = require('crypto');
const Booking = require('../models/bookingModel');
const Show = require('../models/showModel');
const asyncHandler = require('../utils/asyncHandler');
const { buildSeats } = require('../utils/seats');

const populate = [{ path: 'show', populate: [{ path: 'movie', select: 'movieName posterUrl' }, { path: 'theatre', select: 'theatreName location' }] }];

// Create booking. Seats are claimed atomically so two users can never book the same seat.
exports.create = asyncHandler(async (req, res) => {
  const { showId, seats, paymentMethod } = req.body;
  if (!showId || !Array.isArray(seats) || seats.length === 0) { res.status(400); throw new Error('Select at least one seat'); }
  if (seats.length > 10) { res.status(400); throw new Error('You can book up to 10 seats at a time'); }
  const uniq = [...new Set(seats)];
  const show = await Show.findById(showId).populate('theatre');
  if (!show) { res.status(404); throw new Error('Show not found'); }
  const layout = new Map(buildSeats(show.theatre).map((s) => [s.id, s]));
  if (uniq.some((id) => !layout.has(id))) { res.status(400); throw new Error('One or more seats are invalid'); }

  const claimed = await Show.findOneAndUpdate(
    { _id: show._id, bookedSeats: { $nin: uniq } },
    { $push: { bookedSeats: { $each: uniq } } }, { new: true });
  if (!claimed) { res.status(409); throw new Error('Some of those seats were just taken. Please pick other seats.'); }

  try {
    // Payment step is simulated; plug Razorpay / Stripe in here and release seats on failure.
    const total = uniq.reduce((sum, id) => sum + layout.get(id).price, 0);
    const booking = await Booking.create({
      bookingCode: 'IM' + crypto.randomBytes(4).toString('hex').toUpperCase(),
      user: req.user._id, show: show._id, seats: uniq, totalPrice: total,
      paymentMethod: paymentMethod || 'card', paymentId: 'PAY_' + crypto.randomBytes(6).toString('hex'),
    });
    res.status(201).json(await booking.populate(populate));
  } catch (err) {
    await Show.updateOne({ _id: show._id }, { $pull: { bookedSeats: { $in: uniq } } });
    throw err;
  }
});

exports.mine = asyncHandler(async (req, res) => res.json(await Booking.find({ user: req.user._id }).populate(populate).sort({ createdAt: -1 })));

exports.cancel = asyncHandler(async (req, res) => {
  const b = await Booking.findOne({ _id: req.params.id, user: req.user._id }).populate('show');
  if (!b) { res.status(404); throw new Error('Booking not found'); }
  if (b.status === 'cancelled') { res.status(400); throw new Error('Booking already cancelled'); }
  const start = new Date(`${b.show.showDate}T${b.show.showTime}:00`);
  if (start - Date.now() < 2 * 60 * 60 * 1000) { res.status(400); throw new Error('Bookings can only be cancelled up to 2 hours before the show'); }
  b.status = 'cancelled'; b.paymentStatus = 'refunded'; await b.save();
  await Show.updateOne({ _id: b.show._id }, { $pull: { bookedSeats: { $in: b.seats } } });
  res.json(b);
});

exports.all = asyncHandler(async (req, res) =>
  res.json(await Booking.find().populate('user', 'username email').populate(populate).sort({ createdAt: -1 })));
