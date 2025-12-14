import bcrypt from "bcrypt";
import user from "../Models/userModel.js";
import { json } from "express";

export const handleSignup = async (req, res) => {
  try {
    const { name, email, password } = req.body;
    if (!name || !email || !password) {
      return res.status(400).json({
        message: "all fields required!",
      });
    }
    const isExist = await user.findOne({ email });
    if (isExist) {
      return res.status(409).json({
        message: "user already exist with this email",
      });
    }
    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = await user.create({
      name,
      email,
      password: hashedPassword,
    });
    return res.status(201).json({
      message: "signup successfully!",
      user: {
        id: newUser._id,
        name: newUser.name,
        email: newUser.email,
      },
    });
  } catch (error) {
    return res.status(500).json({
      message: "signup error",
      error: error.message,
    });
  }
};

export const handleLogin = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        message: "required all fields!",
      });
    }

    const isExist = await user.findOne({ email });
    if (!isExist) {
      return res.status(400).json({
        message: "user not found!",
      });
    }

    const isMatch = await bcrypt.compare(password, isExist.password);
    if (!isMatch) {
      return res.status(401).json({
        message: "invalid username or password",
      });
    }

    const token = jwt.sign({ id: isExist._id }, process.env.JWT_SECRET, {
      expiresIn: "7d",
    });

    // ✅ Save token in httpOnly cookie
    res.cookie("token", token, {
      httpOnly: true, // cannot access via JS
      secure: process.env.NODE_ENV === "production", // https only in prod
      sameSite: "strict", // CSRF protection
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
    });

    return res.status(200).json({
      message: "user loged in successfully!",
      user: {
        id: isExist._id,
        name: isExist.name,
        email: isExist.email,
      },
    });
  } catch (error) {
    return res.status(500).json({
      message: "login error",
      error: error.message,
    });
  }
};
