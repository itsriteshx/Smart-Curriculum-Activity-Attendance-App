/**
 * @file db.js
 * @description Establishes and monitors the MongoDB connection using Mongoose ODM.
 * Handles initial connection, connection events, and graceful termination.
 * 
 * Viva tip:
 * In production, we don't just connect once; we listen to connection events (error, disconnected)
 * so that if MongoDB restarts or drops, the server can detect it or reconnect cleanly.
 */

const mongoose = require('mongoose');

/**
 * Connect to MongoDB database
 * @returns {Promise<typeof mongoose>} Mongoose instance
 */
const connectDB = async () => {
  const uri = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/smart_agriculture_db';

  try {
    const conn = await mongoose.connect(uri, {
      serverSelectionTimeoutMS: 5000, // Timeout after 5s instead of hanging indefinitely
    });

    console.log(`✅ MongoDB Connected Successfully: ${conn.connection.host} / ${conn.connection.name}`);
    return conn;
  } catch (error) {
    console.error(`❌ MongoDB Connection Error: ${error.message}`);
    console.warn('⚠️  Continuing server launch. Note: Database operations will fail until MongoDB is accessible.');
    // In production you might do process.exit(1), but during development we log clearly so dev server stays up
  }
};

// Listen to runtime database events
mongoose.connection.on('connected', () => {
  console.log('📡 Mongoose event: connection opened.');
});

mongoose.connection.on('error', (err) => {
  console.error(`⚠️  Mongoose event error: ${err.message}`);
});

mongoose.connection.on('disconnected', () => {
  console.warn('⚠️  Mongoose event: disconnected from MongoDB.');
});

// Handle graceful process termination (SIGINT / Ctrl+C)
process.on('SIGINT', async () => {
  await mongoose.connection.close();
  console.log('🔌 Mongoose connection closed due to application termination (SIGINT).');
  process.exit(0);
});

module.exports = connectDB;
