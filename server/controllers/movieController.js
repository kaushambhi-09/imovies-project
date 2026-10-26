const Movie = require('../models/movieModel');
const Show = require('../models/showModel');
const Review = require('../models/reviewModel');
const asyncHandler = require('../utils/asyncHandler');

const normalise = (b) => ({ ...b, genres: Array.isArray(b.genres) ? b.genres : String(b.genres || '').split(',').map((g) => g.trim()).filter(Boolean) });

exports.list = asyncHandler(async (req, res) => {
  const { search, genre, language } = req.query;
  const q = {};
  if (search) q.movieName = new RegExp(search.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'i');
  if (genre) q.genres = new RegExp(`^${genre}$`, 'i');
  if (language) q.language = new RegExp(`^${language}$`, 'i');
  res.json(await Movie.find(q).sort({ releaseDate: -1 }));
});
exports.get = asyncHandler(async (req, res) => {
  const movie = await Movie.findById(req.params.id);
  if (!movie) { res.status(404); throw new Error('Movie not found'); }
  const agg = await Review.aggregate([{ $match: { movie: movie._id } }, { $group: { _id: null, avg: { $avg: '$rating' }, count: { $sum: 1 } } }]);
  res.json({ ...movie.toObject(), avgRating: agg[0] ? Number(agg[0].avg.toFixed(1)) : null, reviewCount: agg[0]?.count || 0 });
});
exports.create = asyncHandler(async (req, res) => res.status(201).json(await Movie.create(normalise(req.body))));
exports.update = asyncHandler(async (req, res) => {
  const m = await Movie.findByIdAndUpdate(req.params.id, normalise(req.body), { new: true, runValidators: true });
  if (!m) { res.status(404); throw new Error('Movie not found'); }
  res.json(m);
});
exports.remove = asyncHandler(async (req, res) => {
  const m = await Movie.findByIdAndDelete(req.params.id);
  if (!m) { res.status(404); throw new Error('Movie not found'); }
  await Show.deleteMany({ movie: m._id });
  res.json({ message: 'Movie and its shows removed' });
});
