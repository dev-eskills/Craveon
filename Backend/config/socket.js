const { Server } = require("socket.io");
const logger = require("./logger");

let io;

const initSocket = (httpServer) => {
  io = new Server(httpServer, {
    cors: {
      origin: process.env.CLIENT_URL || "http://localhost:3000",
      methods: ["GET", "POST"],
      credentials: true,
    },
  });

  io.on("connection", (socket) => {
    logger.info(`[SOCKET] Connected | ID: ${socket.id} | IP: ${socket.handshake.address}`);

    socket.on("disconnect", (reason) => {
      logger.info(`[SOCKET] Disconnected | ID: ${socket.id} | Reason: ${reason}`);
    });

    socket.on("error", (error) => {
      logger.error(`[SOCKET] Error | ID: ${socket.id} | Error: ${error.message}`);
    });

    socket.on("connect_error", (error) => {
      logger.error(`[SOCKET] Connection Error | ID: ${socket.id} | Error: ${error.message}`);
    });
  });

  logger.info("[SOCKET] Socket.io initialized successfully");
  return io;
};

const getIO = () => {
  if (!io) {
    throw new Error("Socket.io not initialized. Call initSocket(server) first.");
  }
  return io;
};

module.exports = { initSocket, getIO };