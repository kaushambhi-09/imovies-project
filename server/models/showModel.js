const mongoose = require('mongoose');
const showSchema = new mongoose.Schema({
  movie: { type: mongoose.Schema.Types.ObjectId, ref: 'Movie', required: true },
  theatre: { type: mongoose.Schema.Types.ObjectId, ref: 'Theatre', required: true },
  showDate: { type: String, required: true }, // YYYY-MM-DD
  showTime: { type: String, required: true }, // HH:mm (24h)
  bookedSeats: { type: [String], default: [] },
  createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'Admin' },
}, { timestamps: true });
showSchema.index({ movie: 1, showDate: 1 });
module.exports = mongoose.model('Show', showSchema);
