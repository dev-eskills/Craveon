const mongoose = require("mongoose");
const logger = require("./logger");
const dns = require("dns");
const User = require("../models/user");
const connectDB = async () => {
  dns.setServers(["1.1.1.1", "8.8.8.8"]); 
  try {
    const conn = await mongoose.connect(process.env.MONGODB_URI, {
      maxPoolSize: 100, // Support up to 5000 users
      serverSelectionTimeoutMS: 5000, // Timeout for selecting primary node
      socketTimeoutMS: 45000, // Close sockets after idle
    });

    logger.info(`MongoDB Connected: ${conn.connection.host}`);
    await User.syncIndexes();

    // Handle MongoDB events
    mongoose.connection.on('error', (err) => {
      logger.error('MongoDB connection error:', err);
    });

    mongoose.connection.on('disconnected', () => {
      logger.warn('MongoDB disconnected. Attempting to reconnect...');
    });
  } catch (error) {
    logger.error('Error connecting to MongoDB:', error);
    process.exit(1);
  }
};

module.exports = { connectDB };
