import cors from "cors";
import "dotenv/config";
import express from "express";
import DBConnection from "./config/dbConnection.js";
import authRoutes from './routes/auth.js';
import feedbackRoutes from './routes/feedback.js';
import resultRoutes from './routes/result.js';
import userRoutes from './routes/users.js';

const app = express();
const PORT = process.env.PORT || 3000;

// Define CORS options
const corsOptions = {
  origin: 'https://facial-skincare-frontend.vercel.app',
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true,
};

// Use CORS middleware
app.use(cors(corsOptions));
app.options('*', cors(corsOptions));

// Middleware
app.use(express.json());

// Routes
app.use("/auth", authRoutes);
app.use("/user", userRoutes);
app.use("/result", resultRoutes);
app.use("/feedback", feedbackRoutes);

// Start server
app.listen(PORT, () => {
  DBConnection();
  console.log(`Server is running on port ${PORT}`);
});
