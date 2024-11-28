const router = require("express").Router();
const { User, validate } = require("../models/user");
const bcrypt = require("bcrypt");

router.post("/", async (req, res) => {
  try {
    // Validate the request body
    const { error } = validate(req.body);
    if (error) {
      // Log the validation error message for debugging
      console.log("Validation error:", error.details[0].message);
      return res.status(400).send({ message: error.details[0].message });
    }

    // Check if the user already exists
    const user = await User.findOne({ email: req.body.email });
    if (user) {
      return res.status(409).send({ message: "User with given email already exists!" });
    }

    // Generate salt and hash the password
    const salt = await bcrypt.genSalt(Number(process.env.SALT));
    const hashPassword = await bcrypt.hash(req.body.password, salt);

    // Save the new user with the hashed password
    const newUser = new User({ ...req.body, password: hashPassword });
    await newUser.save();

    // Send success response
    res.status(201).send({ message: "User created successfully" });
  } catch (error) {
    // Log the internal server error for debugging
    console.error("Internal Server Error:", error);
    res.status(500).send({ message: "Internal Server Error" });
  }
});

module.exports = router;
