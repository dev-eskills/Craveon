// src/app.js
require('dotenv').config();
const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const rateLimit = require('express-rate-limit');
const { connectDB } = require('./config/database');
const errorMiddleware = require('./middleware/error');
const logger = require('./config/logger');

// app.use("/api/restaurants", require("./routes/restaurant.routes"));
// app.use("/api/products", require("./routes/product.routes"));
// app.use("/api/orders", require("./routes/order.routes"));
// app.use("/api/payments", require("./routes/payment.routes"));

const app = express();

// Security Middleware
app.use(helmet()); // Secure HTTP headers
app.use(cors({
origin: process.env.ALLOWED_ORIGINS?.split(',') || '\*',
methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH'],
allowedHeaders: ['Content-Type', 'Authorization']
}));

// Rate limiting
const limiter = rateLimit({
windowMs: 15 _ 60 _ 1000, // 15 minutes
max: 100 // limit each IP to 100 requests per windowMs
});
app.use(limiter);

// Middleware
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));
app.use(morgan('combined', { stream: logger.stream }));

// Routes
app.use('/api/auth', require('./routes/auth.routes'));
app.use('/api/users', require('./routes/user.routes'));
app.use('/api/restaurants', require('./routes/restaurant.routes'));
app.use('/api/products', require('./routes/product.routes'));
app.use('/api/orders', require('./routes/order.routes'));
app.use('/api/payments', require('./routes/payment.routes'));

// Error handling
app.use(errorMiddleware);

// Database connection
connectDB();

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
logger.info(`Server running on port ${PORT}`);
});

// src/config/database.js
const mongoose = require('mongoose');
const logger = require('./logger');

const connectDB = async () => {
try {
await mongoose.connect(process.env.MONGODB_URI, {
useNewUrlParser: true,
useUnifiedTopology: true
});
logger.info('MongoDB connected successfully');
} catch (error) {
logger.error('MongoDB connection error:', error);
process.exit(1);
}
};

module.exports = { connectDB };

// src/middleware/auth.js
const jwt = require('jsonwebtoken');
const { User } = require('../models/User');

const auth = async (req, res, next) => {
try {
const token = req.header('Authorization')?.replace('Bearer ', '');
if (!token) {
throw new Error('Authentication required');
}

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findOne({ _id: decoded.id, 'tokens.token': token });

    if (!user) {
      throw new Error('User not found');
    }

    req.token = token;
    req.user = user;
    next();

} catch (error) {
res.status(401).json({ error: 'Please authenticate' });
}
};

module.exports = auth;

// .env.example
NODE_ENV=development
PORT=3000
MONGODB_URI=mongodb://localhost:27017/food-delivery
JWT_SECRET=your-jwt-secret
JWT_EXPIRE=24h
REDIS_URL=redis://localhost:6379
ALLOWED_ORIGINS=http://localhost:3000,http://localhost:3001
SMTP_HOST=smtp.mailtrap.io
SMTP_PORT=2525
SMTP_USER=your-smtp-user
SMTP_PASS=your-smtp-pass
TWILIO_ACCOUNT_SID=your-twilio-sid
TWILIO_AUTH_TOKEN=your-twilio-token
RAZORPAY_KEY_ID=your-razorpay-key
RAZORPAY_KEY_SECRET=your-razorpay-secret
