const Theatre = require('../models/theatreModel');
const Show = require('../models/showModel');
const asyncHandler = require('../utils/asyncHandler');

exports.list = asyncHandler(async (req, res) => res.json(await Theatre.find().sort({ theatreName: 1 })));
exports.create = asyncHandler(async (req, res) => res.status(201).json(await Theatre.create(req.body)));
exports.remove = asyncHandler(async (req, res) => {
  if (await Show.exists({ theatre: req.params.id })) { res.status(409); throw new Error('Delete this theatre\'s shows first'); }
  await Theatre.findByIdAndDelete(req.params.id);
  res.json({ message: 'Theatre removed' });
});
