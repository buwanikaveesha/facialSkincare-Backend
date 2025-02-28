require("dotenv").config();
const express = require("express");
const app = express();
const cors = require("cors");
const connection = require("./db");
const userRoutes = require("./routes/users");
const authRoutes = require("./routes/auth");
const path = require("path");
const feedbackRoutes = require('./routes/feedback'); 
const resultRoutes = require("./routes/result");

console.log("JWT Secret Key:", process.env.JWTPRIVATEKEY);


// Database connection
connection();

// Middlewares
app.use(express.json());
app.use(cors());
// Serve static files for uploaded images
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Routes
app.use("/api/users", userRoutes);
app.use("/api/auth", authRoutes);
 

app.use("/api/feedback", feedbackRoutes);


// Use the result routes
app.use("/api/results", resultRoutes);
const port = process.env.PORT || 3000;
app.listen(port, () => console.log(`Listening on port ${port}...`));
