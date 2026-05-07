const mongoose = require('mongoose');

const connectDB = async () => {
  if (!process.env.MONGO_URI && process.env.NODE_ENV === 'production') {
    throw new Error('MONGO_URI environment variable is required in production');
  }
  const mongoUri = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/explore-sphere';
  try {
    await mongoose.connect(mongoUri, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log('MongoDB connected');
  } catch (error) {
    console.error('MongoDB connection error:', error.message);
  }
};

module.exports = connectDB;
