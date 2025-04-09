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

const corsOptions = {
  origin: 'https://facial-skincare-frontend.vercel.app',
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true,
};

app.use(cors(corsOptions));
app.options('*', cors(corsOptions));

app.use(express.json());

app.use("/auth", authRoutes);
app.use("/user", userRoutes);
app.use("/result", resultRoutes);
app.use("/feedback", feedbackRoutes);

app.listen(PORT, () => {
  DBConnection();
  console.log(`Server is running on port ${PORT}`);
});
