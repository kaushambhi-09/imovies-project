require('dotenv').config();
const express = require('express');
const cors = require('cors');
const path = require('path');
const fs = require('fs');
const connectDB = require('./config/db');
const { notFound, errorHandler } = require('./middleware/error');

if (!process.env.JWT_SECRET) {
  process.env.JWT_SECRET = 'imovies_default_jwt_secret_key_change_in_production';
  console.warn('⚠️ Warning: JWT_SECRET environment variable is missing. Using a fallback secret.');
}

const app = express();

const rawClientUrl = process.env.CLIENT_URL ? process.env.CLIENT_URL.trim().replace(/\/$/, '') : '';
app.use(
  cors({
    origin: (origin, callback) => {
      // Allow requests with no origin (e.g. mobile apps, curl, or same-origin)
      if (!origin) return callback(null, true);
      if (!rawClientUrl || rawClientUrl === '*' || origin === rawClientUrl || origin === 'http://localhost:5173') {
        return callback(null, true);
      }
      return callback(null, true);
    },
    credentials: true,
  })
);

app.use(express.json());

// API Health Check
app.get('/api/health', (req, res) => {
  res.json({ ok: true, status: 'healthy', timestamp: new Date().toISOString() });
});

// API Routes
app.use('/api/auth', require('./routes/authRoutes'));
app.use('/api/movies', require('./routes/movieRoutes'));
app.use('/api/theatres', require('./routes/theatreRoutes'));
app.use('/api/shows', require('./routes/showRoutes'));
app.use('/api/bookings', require('./routes/bookingRoutes'));
app.use('/api/favorites', require('./routes/favoriteRoutes'));
app.use('/api/reviews', require('./routes/reviewRoutes'));

// Serve frontend build if present (enables single-service fullstack deployment)
const clientDistPath = path.join(__dirname, '../client/dist');
if (fs.existsSync(clientDistPath)) {
  app.use(express.static(clientDistPath));
  app.get('*', (req, res, next) => {
    if (req.path.startsWith('/api')) return next();
    res.sendFile(path.join(clientDistPath, 'index.html'));
  });
} else {
  app.get('/', (req, res) => {
    res.json({
      message: 'iMovies API is running',
      health: '/api/health',
      docs: 'Backend active. Connect frontend or explore /api endpoints.'
    });
  });
}

app.use(notFound);
app.use(errorHandler);

const PORT = process.env.PORT || 8000;
connectDB().then(() =>
  app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`))
);
