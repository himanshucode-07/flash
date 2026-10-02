import User from "../models/user.model.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

export const registerUser = async (req, res) => {
  try {
    const { username, email, password } = req.body;

    if (!username || typeof username !== "string" || username.trim() === "") {
      return res
        .status(400)
        .json({
          success: false,
          message: "Username is mandatory and should be a non-empty string",
        });
    }
    if (!email || typeof email !== "string" || email.trim() === "") {
      return res
        .status(400)
        .json({
          success: false,
          message: "Email is mandatory and should be a non-empty string",
        });
    }
    if (!password || typeof password !== "string" || password.trim() === "") {
      return res
        .status(400)
        .json({
          success: false,
          message: "Password is mandatory and should be a non-empty string",
        });
    }

    const existingUser = await User.findOne({ $or: [{ username }, { email }] });
    if (existingUser) {
      return res
        .status(400)
        .json({ success: false, message: "Username or email already exists" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = await User.create({
      username,
      email,
      password: hashedPassword,
    });

    return res.status(201).json({
      success: true,
      message: "User registered successfully",
      data: {
        id: newUser._id,
        username: newUser.username,
        email: newUser.email,
      },
    });
  } catch (error) {
    console.error("Error registering user:", error);
    return res
      .status(500)
      .json({ success: false, message: "Internal server error" });
  }
};

export const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || typeof email !== "string" || email.trim() === "") {
      return res
        .status(400)
        .json({
          success: false,
          message: "Email is mandatory and should be a non-empty string",
        });
    }
    if (!password || typeof password !== "string" || password.trim() === "") {
      return res
        .status(400)
        .json({
          success: false,
          message: "Password is mandatory and should be a non-empty string",
        });
    }

    const user = await User.findOne({ email });
    if (!user) {
      return res
        .status(401)
        .json({ success: false, message: "Invalid email or password" });
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res
        .status(401)
        .json({ success: false, message: "Invalid email or password" });
    }

    const token = jwt.sign(
      { id: user._id, email: user.email },
      process.env.JWT_SECRET,
      { expiresIn: "1h" },
    );
    res.status(200).json({ success: true, message: "Login successful", token });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
