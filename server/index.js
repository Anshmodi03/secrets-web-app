require("dotenv").config();
const express = require("express");
const cors = require("cors");
const authRouter = require("./routes/authRouter");
const secretRouter = require("./routes/secretRouter");
const errorMiddleware = require("./middleware/error");
const path = require("path");
const morgan = require("morgan"); // For logging HTTP requests

// Initialize the database connection
require("./db");

const app = express();

// Middleware setup
app.use(cors());
app.use(express.json());

// Logging HTTP requests using morgan (optional, for development purposes)
app.use(morgan("dev"));

// Serve static files from the 'dist' directory
app.use(express.static(path.resolve(__dirname, "dist")));

// Define routes for the authentication and secret operations
app.use("/api/auth", authRouter);
app.use("/api/secrets", secretRouter);

// Handle any other routes (for a single-page application) – this is for serving the frontend
app.get("*", (req, res) => {
  res.sendFile(path.resolve(__dirname, "dist", "index.html"));
});

// Error handling middleware (for centralized error management)
app.use(errorMiddleware);

// Set the port from the environment variable or default to 5000
const PORT = process.env.PORT || 5000;

// Start the server and log the message
app.listen(PORT, () => {
  console.log(`App is running at http://localhost:${PORT}...`);
});
