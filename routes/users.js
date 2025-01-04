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

// Fetch user profile
router.get("/profile", auth, async (req, res) => {
  try {
      if (!req.user || !req.user._id) {
          return res.status(401).send({ message: "Unauthorized access" });
      }

      const user = await User.findById(req.user._id).select("-password");
      if (!user) {
          return res.status(404).send({ message: "User not found" });
      }

      res.status(200).send(user);
  } catch (error) {
      console.error("Error fetching user profile:", error);
      res.status(500).send({ message: "Internal Server Error" });
  }
});

// Update user profile
router.put("/profile", auth, async (req, res) => {
  try {
      const { firstName, lastName, email } = req.body;

      if (!firstName || !lastName || !email) {
          return res.status(400).send({ message: "All fields are required" });
      }

      const user = await User.findByIdAndUpdate(
          req.user._id,
          { firstName, lastName, email },
          { new: true } // Return the updated document
      ).select("-password");

      if (!user) {
          return res.status(404).send({ message: "User not found" });
      }

      res.status(200).send(user);
  } catch (error) {
      console.error("Error updating user profile:", error);
      res.status(500).send({ message: "Internal Server Error" });
  }
});


module.exports = router;
