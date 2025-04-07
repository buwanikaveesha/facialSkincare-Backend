import User from "../schema/User.js";

export const GetProfile = async (req, res) => {
  const { id } = req.params;

  try {
    const user = await User.findById(id).select("-password");
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }
    res.status(200).json(user);
  } catch (error) {
    res.status(500).json({ error: "Server error" });
  }
};

export const GetAllUsers = async (req, res) => {
  try {
    const users = await User.find().select("-password");
    if (!users.length) {
      return res.status(404).json({ error: "No users found" });
    }
    res.status(200).json(users);
  } catch (error) {
    res.status(500).json({ error: "Server error" });
  }
};

export const UpdateProfile = async (req, res) => {
  try {
    const { firstName, lastName, email } = req.body;
    const userId = req.params.id;

    if (!userId) {
      return res.status(401).send({ message: "Unauthorized access" });
    }

    if (!firstName || !lastName || !email) {
      return res.status(400).send({ message: "All fields are required" });
    }

    const existingUser = await User.findOne({ email });
    if (existingUser && existingUser._id.toString() !== userId) {
      return res.status(400).send({ message: "Email already in use" });
    }

    const updatedUser = await User.findByIdAndUpdate(
      userId,
      { firstName, lastName, email },
      { new: true, runValidators: true }
    ).select("-password");

    if (!updatedUser) {
      return res.status(404).send({ message: "User not found" });
    }

    res.status(200).send(updatedUser);
  } catch (error) {
    console.error("Error updating user profile:", error);
    res.status(500).send({ message: "Internal Server Error" });
  }
};


export const DeleteProfile = async (req, res) => {
  try {
    if (!req.user || !req.user._id) {
      return res.status(401).send({ message: "Unauthorized access" });
    }

    const user = await User.findById(req.user._id);
    if (!user) {
      return res.status(404).send({ message: "User not found" });
    }

    await User.findByIdAndDelete(req.user._id);

    res.status(200).send({ message: "User profile deleted successfully" });
  } catch (error) {
    console.error("Error deleting user profile:", error);
    res.status(500).send({ message: "Internal Server Error" });
  }
};
