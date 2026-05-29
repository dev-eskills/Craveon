const mongoose = require("mongoose");
const logger = require("./logger");
const User = require("../models/user");

const syncUserIndexes = async () => {
  const indexes = await User.collection.indexes();
  const hasLegacyUsernameIndex = indexes.some(
    (index) => index.name === "username_1"
  );

  if (hasLegacyUsernameIndex) {
    await User.collection.dropIndex("username_1");
    logger.info("Dropped legacy users.username_1 index");
  }

  await User.createIndexes();
};

const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGODB_URI, {
      maxPoolSize: 100, // Support up to 5000 users
      serverSelectionTimeoutMS: 5000, // Timeout for selecting primary node
      socketTimeoutMS: 45000, // Close sockets after idle
    });

    logger.info(`MongoDB Connected: ${conn.connection.host}`);
    await syncUserIndexes();

    // Handle MongoDB events
    mongoose.connection.on("error", (err) => {
      logger.error("MongoDB connection error:", err);
    });

    mongoose.connection.on("disconnected", () => {
      logger.warn("MongoDB disconnected. Attempting to reconnect...");
    });
  } catch (error) {
    logger.error("Error connecting to MongoDB:", error);
    process.exit(1);
  }
};

module.exports = { connectDB };
