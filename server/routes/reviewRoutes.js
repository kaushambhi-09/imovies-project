const r = require('express').Router();
const c = require('../controllers/reviewController');
const { protect, adminOnly, userOnly } = require('../middleware/auth');
r.get('/movie/:movieId', c.byMovie);
r.post('/movie/:movieId', protect, userOnly, c.upsert);
r.delete('/:id', protect, adminOnly, c.remove);
module.exports = r;
