const r = require('express').Router();
const c = require('../controllers/bookingController');
const { protect, adminOnly, userOnly } = require('../middleware/auth');
r.post('/', protect, userOnly, c.create);
r.get('/mine', protect, userOnly, c.mine);
r.put('/:id/cancel', protect, userOnly, c.cancel);
r.get('/', protect, adminOnly, c.all);
module.exports = r;
