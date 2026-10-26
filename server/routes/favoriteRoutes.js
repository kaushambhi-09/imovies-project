const r = require('express').Router();
const c = require('../controllers/favoriteController');
const { protect, userOnly } = require('../middleware/auth');
r.get('/', protect, userOnly, c.list);
r.post('/:movieId', protect, userOnly, c.toggle);
module.exports = r;
