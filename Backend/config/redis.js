// src/config/redis.js
const Redis = require("redis");
const logger = require("./logger");

// Validate environment variable
if (!process.env.REDIS_URL) {
  throw new Error("❌ REDIS_URL environment variable is not defined");
}

// Create Redis client
const redisClient = Redis.createClient({
  url: process.env.REDIS_URL,
  socket: {
    reconnectStrategy: (retries) =>
      retries > 10
        ? new Error("Retry limit exceeded")
        : Math.min(retries * 100, 3000),
  },
});

// Event listeners
redisClient.on("error", (err) => logger.error("❌ Redis Client Error:", err));
redisClient.on("connect", () => logger.info("✅ Redis Client Connected"));
redisClient.on("reconnecting", () =>
  logger.warn("⚠️ Redis Client Reconnecting...")
);
redisClient.on("end", () => logger.warn("🔌 Redis Client Disconnected"));

// Function to connect to Redis
const connectRedis = async () => {
  try {
    await redisClient.connect();
    logger.info("🚀 Redis Connection Established");
  } catch (err) {
    logger.error("❌ Failed to Connect to Redis:", err);
    throw err; // Rethrow the error to handle it in the calling code
  }
};

// Graceful shutdown
process.on("SIGINT", async () => {
  logger.warn("🛑 SIGINT received. Closing Redis client...");
  await redisClient.quit();
  process.exit(0);
});

process.on("SIGTERM", async () => {
  logger.warn("🛑 SIGTERM received. Closing Redis client...");
  await redisClient.quit();
  process.exit(0);
});

// Export the Redis client and connection promise
module.exports = {
  redisClient,
  connectRedis,
};
