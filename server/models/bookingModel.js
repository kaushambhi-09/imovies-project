const mongoose = require('mongoose');
const bookingSchema = new mongoose.Schema({
  bookingCode: { type: String, required: true, unique: true },
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  show: { type: mongoose.Schema.Types.ObjectId, ref: 'Show', required: true },
  seats: { type: [String], required: true },
  totalPrice: { type: Number, required: true },
  paymentMethod: { type: String, default: 'card' },
  paymentStatus: { type: String, enum: ['paid', 'refunded'], default: 'paid' },
  paymentId: String,
  status: { type: String, enum: ['confirmed', 'cancelled'], default: 'confirmed' },
}, { timestamps: true });
module.exports = mongoose.model('Booking', bookingSchema);
