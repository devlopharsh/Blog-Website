const express = require("express");
const cors = require("cors");
const morgan = require("morgan");

const postRoutes = require("./routes/post.routes");
const errorMiddleware = require("./middlewares/error.middleware");
const authRoutes = require("./routes/auth.routes");

const app = express();

app.use(cors());
app.use(express.json());
app.use(morgan("dev"));

app.get("/api/health", (req, res) => {
  res.json({
    success: true,
    status: "ok",
    uptime: process.uptime(),
    timestamp: new Date().toISOString(),
  });
});

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/posts", postRoutes);

// Global Error Handler
app.use(errorMiddleware);

module.exports = app;
