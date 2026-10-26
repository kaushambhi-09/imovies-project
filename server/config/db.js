const mongoose = require('mongoose');
module.exports = async function connectDB() {
  try {
    await mongoose.connect(process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/imovies');
    console.log('Connected to MongoDB');
  } catch (err) {
    console.error('MongoDB connection error:', err.message);
    process.exit(1);
  }
};
