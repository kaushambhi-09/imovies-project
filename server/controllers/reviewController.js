const Review = require('../models/reviewModel');
const asyncHandler = require('../utils/asyncHandler');

exports.byMovie = asyncHandler(async (req, res) =>
  res.json(await Review.find({ movie: req.params.movieId }).populate('user', 'username').sort({ updatedAt: -1 })));
exports.upsert = asyncHandler(async (req, res) => {
  const { rating, comment } = req.body;
  const r = await Review.findOneAndUpdate({ user: req.user._id, movie: req.params.movieId }, { rating, comment },
    { new: true, upsert: true, runValidators: true, setDefaultsOnInsert: true });
  res.status(201).json(r);
});
exports.remove = asyncHandler(async (req, res) => {
  await Review.findByIdAndDelete(req.params.id);
  res.json({ message: 'Review removed' });
});
