const path = require("path");
const dotenv = require("dotenv");
dotenv.config();

const express = require("express");
const cors = require("cors");
const helmet = require("helmet");
const morgan = require("morgan");
const rateLimit = require("express-rate-limit");
const mongoSanitize = require("express-mongo-sanitize");

const connectDB = require("./config/db");
const { notFound, errorHandler } = require("./middleware/errorMiddleware");

connectDB();

const app = express();

// Security & parsing middleware
app.use(helmet());
app.use(
  cors({
    origin: process.env.CLIENT_URL || "http://localhost:5173",
    credentials: true,
  })
);
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(mongoSanitize());

if (process.env.NODE_ENV !== "production") {
  app.use(morgan("dev"));
}

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 300,
  standardHeaders: true,
  legacyHeaders: false,
});
app.use("/api", limiter);

// Static uploads folder
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

// Routes
app.use("/api/auth", require("./routes/authRoutes"));
app.use("/api/users", require("./routes/userRoutes"));
app.use("/api/scholarships", require("./routes/scholarshipRoutes"));
app.use("/api/loans", require("./routes/loanRoutes"));
app.use("/api/prediction", require("./routes/predictionRoutes"));
app.use("/api/admin", require("./routes/adminRoutes"));
app.use("/api/notifications", require("./routes/notificationRoutes"));

app.get("/api/health", (req, res) => res.json({ success: true, message: "API is running" }));

app.use(notFound);
app.use(errorHandler);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
