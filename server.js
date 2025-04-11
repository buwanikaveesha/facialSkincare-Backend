import cors from "cors";
import "dotenv/config";
import express from "express";
import DBConnection from "./config/dbConnection.js";
import authRoutes from './routes/auth.js';
import feedbackRoutes from './routes/feedback.js';
import resultRoutes from './routes/result.js';
import userRoutes from './routes/users.js';

const app = express();
const PORT = 3000;

app.use(cors());
app.use(express.json());

app.use("/api/auth", authRoutes);
app.use("/api/user", userRoutes);
app.use("/api/result", resultRoutes);
app.use("/api/feedback", feedbackRoutes);

app.listen(PORT, () => {
  DBConnection();
  console.log(`Server is running on port ${PORT}`);
});
