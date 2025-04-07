import jwt from "jsonwebtoken";
import Joi from "joi";
import bcrypt from "bcrypt";
import passwordComplexity from "joi-password-complexity";
import User from "../schema/User.js";

const createToken = (user) => {
  return jwt.sign({ _id: user._id, email: user.email }, process.env.JWT_PRIVATE_KEY, { expiresIn: "7d" });
};


const validate = (data) => {
  const schema = Joi.object({
    firstName: Joi.string().trim().required().label("First Name"),
    lastName: Joi.string().trim().required().label("Last Name"),
    email: Joi.string().email().trim().required().label("Email"),
    password: passwordComplexity({
      min: 8,
      max: 30,
      lowerCase: 1,
      upperCase: 1,
      numeric: 1,
      symbol: 1,
      requirementCount: 4,
    })
      .required()
      .label("Password"),
  });
  return schema.validate(data);
};

export const Register = async (req, res) => {
  try {
    const { error } = validate(req.body);
    if (error) {
      return res.status(400).json({ message: error.details[0].message });
    }

    const email = req.body.email.toLowerCase();
    const user = await User.findOne({ email });
    if (user) {
      return res
        .status(409)
        .json({ message: "User with given email already exists!" });
    }

    const salt = await bcrypt.genSalt(Number(process.env.SALT) || 10);
    const hashPassword = await bcrypt.hash(req.body.password, salt);

    const newUser = new User({
      ...req.body,
      email,
      password: hashPassword,
    });

    await newUser.save();
    res.status(201).json({ message: "User created successfully" });
  } catch (error) {
    console.error("Internal Server Error:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

export const Login = async (req, res) => {
  let { email, password } = req.body;
  try {
    const user = await User.findOne({ email });

    if (!user) {
      return res.status(401).json({ message: "Invalid Email or Password" });
    }

    const validPassword = await bcrypt.compare(password, user.password);

    if (!validPassword) {
      return res.status(401).json({ message: "Invalid Email or Password" });
    }

    const token = createToken(user);
    res.status(200).json({ message: "Login successful", token });
  } catch (error) {
    console.error("Error during login:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};
