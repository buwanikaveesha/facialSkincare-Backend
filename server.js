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

// app.use(cors({ origin: "*" }));
// app.use(function (req, res, next) {
//   res.header("Access-Control-Allow-Origin", "*");
//   res.header("Access-Control-Allow-Methods", "GET, PUT, POST");
//   res.header(
//     "Access-Control-Allow-Headers",
//     "Origin, X-Requested-With, Content-Type, Accept"
//   );
//   next();
// });
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
