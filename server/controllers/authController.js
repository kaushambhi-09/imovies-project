const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const User = require('../models/userModel');
const Admin = require('../models/adminModel');
const asyncHandler = require('../utils/asyncHandler');

const sign = (id, role) => jwt.sign({ id, role }, process.env.JWT_SECRET, { expiresIn: '7d' });
const payload = (acc, role) => ({ token: sign(acc._id, role), role, user: { id: acc._id, username: acc.username, email: acc.email } });

const makeRegister = (Model, role, guard) => asyncHandler(async (req, res) => {
  const { username, email, password } = req.body;
  if (!username || !email || !password) { res.status(400); throw new Error('Username, email and password are required'); }
  if (password.length < 8) { res.status(400); throw new Error('Password must be at least 8 characters'); }
  if (guard) guard(req, res);
  const hash = await bcrypt.hash(password, 10);
  const acc = await Model.create({ username, email, password: hash });
  res.status(201).json(payload(acc, role));
});

const makeLogin = (Model, role) => asyncHandler(async (req, res) => {
  const { email, password } = req.body;
  const acc = await Model.findOne({ email: (email || '').toLowerCase() });
  if (!acc || !(await bcrypt.compare(password || '', acc.password))) { res.status(401); throw new Error('Invalid email or password'); }
  res.json(payload(acc, role));
});

exports.register = makeRegister(User, 'user');
exports.login = makeLogin(User, 'user');
exports.adminRegister = makeRegister(Admin, 'admin', (req, res) => {
  if (!process.env.ADMIN_REGISTER_KEY || req.body.adminKey !== process.env.ADMIN_REGISTER_KEY) { res.status(403); throw new Error('Invalid admin key'); }
});
exports.adminLogin = makeLogin(Admin, 'admin');
exports.me = (req, res) => res.json({ role: req.role, user: { id: req.user._id, username: req.user.username, email: req.user.email } });
