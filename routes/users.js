const router = require("express").Router();
const bcrypt = require("bcrypt");
const { User, validate } = require("../models/user");
const auth = require("../middleware/authentication");

// Route to handle user registration
router.post("/register", async (req, res) => {
  try {
    const { error } = validate(req.body);
    if (error) {
      console.log("Validation error:", error.details[0].message);
      return res.status(400).send({ message: error.details[0].message });
    }

    const user = await User.findOne({ email: req.body.email });
    if (user) {
      return res.status(409).send({ message: "User with given email already exists!" });
    }

    const salt = await bcrypt.genSalt(Number(process.env.SALT));
    const hashPassword = await bcrypt.hash(req.body.password, salt);

    const newUser = new User({
      ...req.body,
      password: hashPassword,
    });

    await newUser.save();

    res.status(201).send({ message: "User created successfully" });
  } catch (error) {
    console.error("Internal Server Error:", error);
    res.status(500).send({ message: "Internal Server Error" });
  }
});

// Get user profile
router.get("/profile", auth, async (req, res) => {
  try {
      // Ensure the user ID from token is present
      if (!req.user || !req.user._id) {
          return res.status(401).send({ message: "Unauthorized access" });
      }

      // Fetch user data from database
      const user = await User.findById(req.user._id).select("-password");
      if (!user) {
          return res.status(404).send({ message: "User not found" });
      }

      // Respond with user details
      res.status(200).send({
          firstName: user.firstName,
          lastName: user.lastName,
          email: user.email,
      });
  } catch (error) {
      console.error("Error fetching user profile:", error);
      res.status(500).send({ message: "Internal Server Error" });
  }
});

module.exports = router;
