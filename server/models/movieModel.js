const mongoose = require('mongoose');
const movieSchema = new mongoose.Schema({
  movieName: { type: String, required: [true, 'Movie name is required'], trim: true, minlength: [2, 'Movie name must be at least 2 characters'], maxlength: [200, 'Movie name cannot exceed 200 characters'] },
  description: { type: String, required: [true, 'Description is required'], trim: true, minlength: [10, 'Description must be at least 10 characters'] },
  genres: { type: [String], validate: { validator: (g) => Array.isArray(g) && g.length > 0, message: 'At least one genre is required' } },
  language: { type: String, required: [true, 'Language is required'], trim: true },
  releaseDate: { type: Date, required: [true, 'Release date is required'] },
  runtime: { type: Number, min: 1 },
  certification: { type: String, default: 'UA' },
  posterUrl: { type: String, default: '' },
}, { timestamps: true });
module.exports = mongoose.model('Movie', movieSchema);
