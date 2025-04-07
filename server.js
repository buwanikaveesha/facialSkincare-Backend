import express from "express";
import "dotenv/config";
import cors from "cors";
import DBConnection from "./config/dbConnection.js";
import authRoutes from './routes/auth.js';
import userRoutes from './routes/users.js';
import resultRoutes from './routes/result.js';
import feedbackRoutes from './routes/feedback.js';

const app = express();
const PORT = 3000;

app.use(cors({ origin: "*" }));
app.use(express.json());

app.use("/api/auth", authRoutes);
app.use("/api/user", userRoutes);
app.use("/api/result", resultRoutes);
app.use("/api/feedback", feedbackRoutes);

app.listen(PORT, () => {
  DBConnection();
  console.log(`Server is running on port ${PORT}`);
});
