const r = require('express').Router();
const c = require('../controllers/authController');
const { protect } = require('../middleware/auth');
r.post('/register', c.register);
r.post('/login', c.login);
r.post('/admin/register', c.adminRegister);
r.post('/admin/login', c.adminLogin);
r.get('/me', protect, c.me);
module.exports = r;
