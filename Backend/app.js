require("./instrument.js");
const Sentry = require("@sentry/node");
require("dotenv").config();
const express = require("express");
const cors = require("cors");
const helmet = require("helmet");
const morgan = require("morgan");
const errorMiddleware = require("./middleware/error");
const logger = require("./config/logger");
const cookieParser = require("cookie-parser");
const { connectDB } = require("./config/database");
const { initSocket } = require("./config/socket");

const app = express(); 
const server = http.createServer(app); 
initSocket(server);  

app.use((req, res, next) => {
  console.log(`[REQ] ${req.method} ${req.originalUrl} from ${req.headers['user-agent'] || 'unknown'}`);
  next();
});

// Security Middleware
app.use(
  cors({
    origin: (origin, callback) => {
      return callback(null, true);
    },
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH'],
    allowedHeaders: ['Content-Type', 'Authorization', 'position'],
  })
);
app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true, limit: "10mb" }));
app.use(cookieParser());
app.use(morgan("combined", { stream: logger.stream }));


// ─── ALL YOUR ROUTES ───────────────────────────────────────
app.use("/api/admin", require("./routes/Admin/admin.routes"));
app.use("/api/auth", require("./routes/auth.routes"));
app.use("/api/user", require("./routes/user.routes"));

app.use("/api/restaurant", require("./routes/restaurant.routes"));
app.use("/api/cart", require("./routes/cart.routes"));
app.use("/api/settings", require("./routes/setting.routes"));
app.use("/api/order", require("./routes/order.routes"));
app.use("/api/admin/rider", require("./routes/adminRider.routes"));
app.use("/api/rider", require("./routes/rider.Routes"));

// ─── SENTRY ERROR HANDLER ──────────────────────────────────
Sentry.setupExpressErrorHandler(app);

// ─── YOUR CUSTOM ERROR MIDDLEWARE ───────────────────────────────────
app.use(errorMiddleware);
// Database connection
connectDB();

const PORT = process.env.PORT || 3001;
server.listen(PORT, () => {
  logger.info(`Server running on port ${PORT}`);
});
