// src/app.js
require('dotenv').config();
const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const rateLimit = require('express-rate-limit');
const errorMiddleware = require('./middleware/error');
const logger = require('./config/logger');
const cookieParser = require('cookie-parser');
const { connectDB } = require('./config/database');
const fs = require('fs');
const app = express();
app.use(cookieParser());

app.use((req, res, next) => {
  console.log(`[REQ] ${req.method} ${req.originalUrl} from ${req.headers['user-agent'] || 'unknown'}`);
  next();
});

// Security Middleware
app.use(
  cors({
    origin: (origin, callback) => {
      logger.info(
        `[CORS] Allowing origin: ${origin || 'N/A'} (ALLOW ALL MODE)`
      );
      return callback(null, true);
    },
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH'],
    allowedHeaders: ['Content-Type', 'Authorization', 'position'],
  })
);
app.use(helmet()); // Secure HTTP headers
// Middleware
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));
app.use(morgan('combined', { stream: logger.stream }));

// Routes
app.use('/api/auth', require('./routes/auth.routes'));
app.use('/api/user', require('./routes/user.routes'));
app.use('/api/admin', require('./routes/Admin/admin.routes'));
app.use('/api/restaurant', require('./routes/restaurant.routes'));
app.use('/api/cart', require('./routes/cart.routes'));
app.use('/api/settings', require('./routes/setting.routes'));
app.use('/api/order', require('./routes/order.routes'));
app.use('/api/admin/rider', require('./routes/adminRider.routes'));
app.use('/api/rider', require('./routes/rider.Routes'));
// Error handling
app.use(errorMiddleware);
// Database connection
connectDB();

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  logger.info(`Server running on port ${PORT}`);
});
