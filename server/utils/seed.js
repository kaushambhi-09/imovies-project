// Usage: npm run seed  -> creates an admin, a theatre, sample movies and shows
require('dotenv').config();
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const Admin = require('../models/adminModel');
const Movie = require('../models/movieModel');
const Theatre = require('../models/theatreModel');
const Show = require('../models/showModel');

(async () => {
  await mongoose.connect(process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/imovies');
  const admin = (await Admin.findOne({ email: 'admin@imovies.com' })) ||
    (await Admin.create({ username: 'admin', email: 'admin@imovies.com', password: await bcrypt.hash('admin12345', 10) }));
  const theatre = (await Theatre.findOne({ theatreName: 'Galaxy Cinemas' })) ||
    (await Theatre.create({ theatreName: 'Galaxy Cinemas', location: 'City Centre', balconySeats: 24, middleSeats: 32, lowerSeats: 32, balconyPrice: 350, middlePrice: 250, lowerPrice: 150 }));
  const samples = [
    ['Night Run', 'A getaway driver has one night to clear his name across a sleepless city.', ['Action', 'Thriller'], 'Hindi', 128],
    ['Monsoon Heist', 'A crew plans the perfect robbery during the heaviest rains in decades.', ['Thriller'], 'Telugu', 141],
    ['Last Reel', 'An old projectionist fights to keep a single-screen cinema alive.', ['Drama'], 'English', 112],
  ];
  const day = (n) => new Date(Date.now() + n * 864e5).toISOString().slice(0, 10);
  const slots = [['14:00', '19:30'], ['16:30', '21:00'], ['12:00', '22:30']];
  for (const [i, [movieName, description, genres, language, runtime]] of samples.entries()) {
    const movie = (await Movie.findOne({ movieName })) || (await Movie.create({ movieName, description, genres, language, runtime, releaseDate: new Date() }));
    for (const [d, t] of [[1, slots[i][0]], [1, slots[i][1]], [2, slots[i][0]]]) {
      await Show.updateOne({ theatre: theatre._id, showDate: day(d), showTime: t }, { $setOnInsert: { movie: movie._id, createdBy: admin._id } }, { upsert: true });
    }
  }
  console.log('Seeded. Admin login: admin@imovies.com / admin12345');
  await mongoose.disconnect();
})();
