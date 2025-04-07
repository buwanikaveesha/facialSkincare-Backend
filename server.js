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

const allowedOrigins = [
  "https://facial-skincare-frontend.vercel.app"
];

app.use(cors({
  origin: function (origin, callback) {
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error("Not allowed by CORS"));
    }
  },
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  allowedHeaders: ["Origin", "X-Requested-With", "Content-Type", "Accept", "Authorization"],
  credentials: true
}));

app.use(express.json());

app.use("/api/auth", authRoutes);
app.use("/api/user", userRoutes);
app.use("/api/result", resultRoutes);
app.use("/api/feedback", feedbackRoutes);

app.listen(PORT, () => {
  DBConnection();
  console.log(`Server is running on port ${PORT}`);
});
