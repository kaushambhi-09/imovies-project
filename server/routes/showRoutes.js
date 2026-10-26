const r = require('express').Router();
const c = require('../controllers/showController');
const { protect, adminOnly } = require('../middleware/auth');
r.get('/', protect, adminOnly, c.all);
r.get('/movie/:movieId', c.byMovie);
r.get('/:id', c.get);
r.post('/', protect, adminOnly, c.create);
r.delete('/:id', protect, adminOnly, c.remove);
module.exports = r;
