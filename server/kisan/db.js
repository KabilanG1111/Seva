const mongoose = require('mongoose');

let isConnected = false;

const connectDB = async () => {
  if (isConnected) return;

  const uri = process.env.MONGODB_URI || 'mongodb://localhost:27017/seva_kisan';

  try {
    await mongoose.connect(uri, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    isConnected = true;
    console.log('[KISAN] MongoDB connected to:', uri.split('@').pop() || uri);
  } catch (err) {
    console.error('[KISAN] MongoDB connection error:', err.message);
    // Don't crash the server — degrade gracefully
  }
};

module.exports = connectDB;
