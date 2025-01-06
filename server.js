require("dotenv").config();
const express = require("express");
const app = express();
const cors = require("cors");
const connection = require("./db");
const userRoutes = require("./routes/users");
const authRoutes = require("./routes/auth");
const path = require("path");

// database connection
connection();

// middlewares
app.use(express.json());
app.use(cors());
// Serve static files for uploaded images
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// routes
app.use("/api/users", userRoutes);
app.use("/api/auth", authRoutes);


const port = process.env.PORT || 3000;
app.listen(port, console.log(`Listening on port ${port}...`));
