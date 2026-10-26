const Favorite = require('../models/favoriteModel');
const asyncHandler = require('../utils/asyncHandler');

exports.list = asyncHandler(async (req, res) => {
  const favs = await Favorite.find({ user: req.user._id }).populate('movie').sort({ createdAt: -1 });
  res.json(favs.filter((f) => f.movie).map((f) => f.movie));
});
exports.toggle = asyncHandler(async (req, res) => {
  const f = { user: req.user._id, movie: req.params.movieId };
  const existing = await Favorite.findOneAndDelete(f);
  if (existing) return res.json({ favorite: false });
  await Favorite.create(f);
  res.status(201).json({ favorite: true });
});
