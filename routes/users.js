const express = require("express");
const bcrypt = require("bcrypt");
const { User, validate } = require("../models/user");
const auth = require("../middleware/authentication");
const multer = require("multer");
const path = require("path");
const fs = require("fs");

const router = express.Router();

// Route to handle user registration
router.post("/register", async (req, res) => {
  try {
    const { error } = validate(req.body);
    if (error) {
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
      { new: true }
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

// Set up storage for Multer
const uploadDir = path.join(__dirname, "../uploads");
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    const sanitizedFilename = `${req.user._id}_${Date.now()}${path.extname(file.originalname)}`;
    cb(null, sanitizedFilename);
  },
});

// File filter for image uploads
const fileFilter = (req, file, cb) => {
  if (file.mimetype.startsWith("image/")) {
    cb(null, true);
  } else {
    cb(new Error("Only image files are allowed!"), false);
  }
};

// Multer middleware
const upload = multer({ storage, fileFilter });

// Route to handle profile photo upload
router.put("/profile-photo", auth, upload.single("profilePhoto"), async (req, res) => {
  try {
      if (!req.file) {
          return res.status(400).send({ message: "No file uploaded" });
      }

      const profilePhotoPath = `/uploads/${req.file.filename}`;
      const user = await User.findByIdAndUpdate(
          req.user._id,
          { profilePhoto: profilePhotoPath },
          { new: true }
      ).select("-password");

      if (!user) {
          return res.status(404).send({ message: "User not found" });
      }

      res.status(200).send({
          message: "Profile photo updated successfully",
          profilePhoto: profilePhotoPath,
      });
  } catch (error) {
      console.error("Error uploading profile photo:", error);
      res.status(500).send({ message: "Internal Server Error" });
  }
});

// Route to handle deleting the profile photo
router.put("/delete-profile-photo", auth, async (req, res) => {
  try {
    const user = await User.findById(req.user._id);

    if (!user) {
      return res.status(404).send({ message: "User not found" });
    }

    if (user.profilePhoto) {
      // Optionally, delete the file from the server
      const filePath = path.join(__dirname, "../uploads", user.profilePhoto.split('/').pop());
      fs.unlink(filePath, (err) => {
        if (err) {
          console.error("Error deleting file:", err);
        }
      });

      // Remove the profile photo from the database
      user.profilePhoto = null;
      await user.save();
      
      res.status(200).send({ message: "Profile photo deleted successfully" });
    } else {
      res.status(400).send({ message: "No profile photo to delete" });
    }
  } catch (error) {
    console.error("Error deleting profile photo:", error);
    res.status(500).send({ message: "Internal Server Error" });
  }
});

// Route to delete user account
router.delete('/delete-account', auth, async (req, res) => {
  try {
    const user = await User.findByIdAndDelete(req.user._id); // Delete the user by their ID from the token

    if (!user) {
      return res.status(404).send('User not found');
    }

    res.send('User account deleted successfully');
  } catch (err) {
    console.error('Error deleting user:', err);
    res.status(500).send('Internal Server Error');
  }
});


module.exports = router;
