import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import User from "../models/User.js";
import transporter from "../config/nodemailer.js";

export const register = async (req, res) => {
  const { firstName, lastName, email, password } = req.body;

  if (!firstName || !lastName || !email || !password)
    return res.status(400).json({ success: false, error: "Missing fields" });

  const exists = await User.findOne({ email });
  if (exists) return res.status(409).json({ success: false, error: "Email already registered" });

  const hash = await bcrypt.hash(password, 10);

  const user = await User.create({
    firstName,
    lastName,
    email,
    password: hash,
  });

  const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: "1d" });

  res.json({ success: true, token });
};

export const login = async (req, res) => {
  const { email, password } = req.body;

  const user = await User.findOne({ email });
  if (!user)
    return res.status(404).json({ success: false, error: "User not found" });

  const match = await bcrypt.compare(password, user.password);
  if (!match)
    return res.status(401).json({ success: false, error: "Wrong password" });

  const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET);
  res.json({ success: true, token });
};

export const sendOtp = async (req, res) => {
  const user = await User.findById(req.userId);

  if (user.isEmailVerified)
    return res.status(400).json({ success: false, error: "Already verified" });

  const otp = String(Math.floor(100000 + Math.random() * 900000));

  user.emailOtp = otp;
  user.emailOtpExpiry = Date.now() + 10 * 60 * 1000;
  await user.save();

  await transporter.sendMail({
    to: user.email,
    subject: "Email Verification OTP",
    text: `Your OTP is ${otp}`
  });

  res.json({ success: true, message: "OTP sent" });
};

export const resendOtp = sendOtp;

export const verifyEmail = async (req, res) => {
  const user = await User.findById(req.userId);
  const { otp } = req.body;

  if (user.emailOtp !== otp)
    return res.status(400).json({ success: false, error: "Invalid OTP" });

  if (Date.now() > user.emailOtpExpiry)
    return res.status(400).json({ success: false, error: "OTP expired" });

  user.isEmailVerified = true;
  user.emailOtp = "";
  user.emailOtpExpiry = 0;
  await user.save();

  res.json({ success: true, message: "Email verified" });
};

export const isEmailVerified = async (req, res) => {
  const user = await User.findById(req.userId);
  res.json({ isVerified: user.isEmailVerified });
};

export const logout = async (req, res) => {
  res.json({ success: true, message: "Logged out" });
};

export const sendResetOtp = async (req, res) => {
  const { email } = req.body;

  const user = await User.findOne({ email });
  if (!user) return res.status(404).json({ error: "No user found" });

  const otp = String(Math.floor(100000 + Math.random() * 900000));

  user.resetOtp = otp;
  user.resetOtpExpiry = Date.now() + 10 * 60 * 1000;
  await user.save();

  await transporter.sendMail({
    to: email,
    subject: "Password Reset OTP",
    text: `OTP: ${otp}`
  });

  res.json({ success: true });
};

export const resetPassword = async (req, res) => {
  const { email, otp, newPassword } = req.body;

  const user = await User.findOne({ email });

  if (user.resetOtp !== otp)
    return res.status(400).json({ error: "Invalid OTP" });

  if (Date.now() > user.resetOtpExpiry)
    return res.status(400).json({ error: "OTP expired" });

  user.password = await bcrypt.hash(newPassword, 10);
  user.resetOtp = "";
  user.resetOtpExpiry = 0;
  await user.save();

  res.json({ success: true });
};
