const r = require('express').Router();
const c = require('../controllers/theatreController');
const { protect, adminOnly } = require('../middleware/auth');
r.get('/', protect, adminOnly, c.list);
r.post('/', protect, adminOnly, c.create);
r.delete('/:id', protect, adminOnly, c.remove);
module.exports = r;
