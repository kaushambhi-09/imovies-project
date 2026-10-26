const mongoose = require('mongoose');
const n = { type: Number, required: true, min: 0 };
const theatreSchema = new mongoose.Schema({
  theatreName: { type: String, required: true, trim: true },
  location: { type: String, required: true, trim: true },
  balconySeats: n, middleSeats: n, lowerSeats: n,
  balconyPrice: n, middlePrice: n, lowerPrice: n,
}, { timestamps: true });
module.exports = mongoose.model('Theatre', theatreSchema);
