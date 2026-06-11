require('dotenv').config();
require('./instrument');
const Sentry = require('@sentry/node');

const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const errorMiddleware = require('./middleware/error');
const logger = require('./config/logger');
const cookieParser = require('cookie-parser');
const { connectDB } = require('./config/database');
const { initSocket } = require('./config/socket');
const logsMiddleware = require('./middleware/logsMiddleware');
const http = require('http');

const app = express();
const server = http.createServer(app);
initSocket(server);

// Basic request logger
app.use((req, res, next) => {
  console.log(`[REQ] ${req.method} ${req.originalUrl} from ${req.headers['user-agent'] || 'unknown'}`);
  next();
});

// Security & parsing middlewares
app.use(
  cors({
    origin: (origin, callback) => callback(null, true),
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH'],
    allowedHeaders: ['Content-Type', 'Authorization', 'position'],
  })
);
app.use(helmet());
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));
app.use(cookieParser());

// Morgan logger
app.use(morgan('combined', { stream: logger.stream }));

// Global logs middleware (captures every request/response)
app.use(logsMiddleware);

// Connect to MongoDB
connectDB();

// Register routes
app.use('/api/admin', require('./routes/Admin/admin.routes'));
app.use('/api/auth', require('./routes/auth.routes'));
app.use('/api/user', require('./routes/user.routes'));
app.use('/api/restaurant', require('./routes/restaurant.routes'));
app.use('/api/cart', require('./routes/cart.routes'));
app.use('/api/settings', require('./routes/setting.routes'));
app.use('/api/order', require('./routes/order.routes'));
app.use('/api/admin/rider', require('./routes/adminRider.routes'));
app.use('/api/rider', require('./routes/rider.Routes'));
app.get("/api/debug-sentry", function mainHandler(req, res) {
  throw new Error("My first Sentry error!");
});
// Protected logs endpoint (admin only)
const protect = require('./middleware/auth');
const adminProtect = require('./middleware/adminProtect');
const logsController = require('./controllers/logs.controller');
app.get('/api/admin/logs', protect, adminProtect, logsMiddleware, logsController.getLogs);

// Error handling & Sentry
Sentry.setupExpressErrorHandler(app);
app.use(errorMiddleware);

// Start server
const PORT = process.env.PORT || 3001;
server.listen(PORT, () => {
  logger.info(`Server running on port ${PORT}`);
});
