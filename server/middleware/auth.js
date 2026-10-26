const jwt = require('jsonwebtoken');
const User = require('../models/userModel');
const Admin = require('../models/adminModel');
const asyncHandler = require('../utils/asyncHandler');

exports.protect = asyncHandler(async (req, res, next) => {
  const h = req.headers.authorization || '';
  if (!h.startsWith('Bearer ')) { res.status(401); throw new Error('Not authorised, token missing'); }
  let decoded;
  try { decoded = jwt.verify(h.split(' ')[1], process.env.JWT_SECRET); }
  catch { res.status(401); throw new Error('Not authorised, token invalid or expired'); }
  const Model = decoded.role === 'admin' ? Admin : User;
  const account = await Model.findById(decoded.id).select('-password');
  if (!account) { res.status(401); throw new Error('Account no longer exists'); }
  req.user = account; req.role = decoded.role;
  next();
});

exports.adminOnly = (req, res, next) => {
  if (req.role !== 'admin') { res.status(403); return next(new Error('Admin access required')); }
  next();
};
exports.userOnly = (req, res, next) => {
  if (req.role !== 'user') { res.status(403); return next(new Error('Only customers can do this')); }
  next();
};
