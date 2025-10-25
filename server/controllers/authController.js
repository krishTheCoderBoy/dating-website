import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import userModel from '../models/userModels.js';
import transporter from '../config/nodemailer.js';

export const register = async (req, res) => {
  const { name, email, password } = req.body;

  if (!name || !email || !password) {
    return res.status(400).json({ success: false, error: "Please fill all the fields" });
  }

  try {
    const existingUser = await userModel.findOne({ email });
    if (existingUser) {
      return res.status(409).json({ success: false, error: "User already exists" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const user = new userModel({ name, email, password: hashedPassword });
    await user.save();

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: "1d" });

    // Instead of setting a cookie, attach token to header
    res.setHeader("Authorization", `Bearer ${token}`);
    /*     res.cookie("token", token, {
          httpOnly: true,
          secure: process.env.NODE_ENV === "production",
          sameSite: process.env.NODE_ENV === "production" ? "none" : "strict",
          maxAge: 24 * 60 * 60 * 1000,
        }); */

    // Send welcome email
    const mailOptions = {
      from: process.env.SENDER_EMAIL,
      to: email,
      subject: 'Welcome to Our Service!',
      text: `Hello ${name},\n\nThank you for registering at our service. We're excited to have you on board!\n\nBest regards,\nThe Team`
    };
    await transporter.sendMail(mailOptions);
    console.log(process.env.SMTP_USER, process.env.SMTP_PASS, process.env.SENDER_EMAIL);
    return res.status(201).json({ success: true, message: "User registered successfully", token });
  } catch (err) {

    console.error("Registration error:", err);
    return res.status(500).json({ success: false, error: `server error : ${err.message}` });
  }

};

// ----------------------
// Login Controller
// ----------------------
export const login = async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ success: false, error: "Please fill all the fields" });
  }

  try {
    const user = await userModel.findOne({ email });
    if (!user) {
      return res.status(404).json({ success: false, error: "User does not exist" });
    }

    const isPasswordCorrect = await bcrypt.compare(password, user.password);
    if (!isPasswordCorrect) {
      return res.status(401).json({ success: false, error: "Invalid credentials" });
    }

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: "1d" });

    // --- Send token in header instead of cookie ---
    res.setHeader("Authorization", `Bearer ${token}`);

    return res.status(200).json({
      success: true,
      message: "Login successful",
      token,
      user: { id: user._id, email: user.email }
    });

  } catch (err) {
    console.error("Login error:", err);
    return res.status(500).json({ success: false, error: "server error" });
  }
};

// ----------------------
// Logout Controller
// ----------------------
export const logout = async (req, res) => {
  try {
    /*     res.clearCookie("token", {
          httpOnly: true,
          secure: process.env.NODE_ENV === "production",
          sameSite: process.env.NODE_ENV === "production" ? "none" : "strict",
        }); */
    return res.status(200).json({ success: true, message: "Logged out successfully" });
  } catch (err) {
    return res.status(500).json({ success: false, error: err.message });
  }
};


export const sendVerifyOtp = async (req, res) => {
  try {
    const userId = req.userId;
    const user = await userModel.findById(userId);
    if (user.isVerified) {
      return res.status(400).json({ success: false, error: "User is already verified" });
    }
    const otp = String(Math.floor(100000 + Math.random() * 900000));
    user.verifyOtp = otp;
    user.verifyOtpExpiry = Date.now() + 10 * 60 * 1000;
    await user.save();
    const mailOptions = {
      from: process.env.SENDER_EMAIL,
      to: user.email,
      subject: 'Your Verification OTP',
      text: `Hello ${user.name},\n\nYour OTP for email verification is ${otp}. It is valid for 10 minutes.\n\nBest regards,\nThe Team`
    };
    console.log(`the generated otp is ${otp}`);
    await transporter.sendMail(mailOptions);
    res.status(200).json({ success: true, message: "OTP sent to your email" });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
}


export const verifyEmail = async (req, res) => {
  const userId = req.userId;
  const { otp } = req.body;
  if (!userId || !otp) {
    return res.status(400).json({ success: false, error: "Please provide all the fields" });
  }
  try {
    const user = await userModel.findById(userId);
    if (!user) {
      return res.status(404).json({ success: false, error: "User not found" });
    }
    if (user.verifyOtp === '' || user.verifyOtp !== otp) {
      return res.status(400).json({ success: false, error: "Invalid OTP" });
    }
    if (user.verifyOtpExpiry < Date.now()) {
      return res.status(400).json({ success: false, error: "OTP has expired" });
    }
    user.isVerified = true;
    user.verifyOtp = '';
    user.verifyOtpExpiry = 0;
    await user.save();
    res.status(200).json({ success: true, message: "Email verified successfully" });
  }
  catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
}

export const isAuthenticated = async (req, res) => {
  try {
    return res.status(200).json({ success: true, message: "User is authenticated" });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
}


export const sendResetOtp = async (req, res) => {
  const { email } = req.body;
  if (!email) {
    return res.status(400).json({ success: false, error: "Please provide email" });
  }
  try {
    const user = await userModel.findOne({ email });
    if (!user) {
      return res.status(404).json({ success: false, error: "User not found" });
    }
    const otp = String(Math.floor(100000 + Math.random() * 900000));
    user.resetPasswordOtp = otp;
    user.resetPasswordOtpExpiry = Date.now() + 10 * 60 * 1000;
    await user.save();
    const mailOptions = {
      from: process.env.SENDER_EMAIL,
      to: user.email,
      subject: 'Your Password Reset OTP',
      text: `Hello ${user.name},\n\nYour OTP for password reset is ${otp}. It is valid for 10 minutes.\n\nBest regards,\nThe Team`
    };
    await transporter.sendMail(mailOptions);
    return res.status(200).json({ success: true, message: "OTP sent to your email" });
  } catch (error) {
    return res.status(500).json({ success: false, error: error.message });
  }
}



export const resetPassword = async (req, res) => {
  const { email, otp, newPassword } = req.body;
  if (!email || !otp || !newPassword) {
    return res.status(400).json({ success: false, error: "Please provide all the fields" });
  }
  try {
    const user = await userModel.findOne({ email });
    if (!user) {
      return res.status(404).json({ success: false, error: "User not found" });
    }
    if (user.resetPasswordOtp === '' || user.resetPasswordOtp !== otp) {
      return res.status(400).json({ success: false, error: "Invalid OTP" });
    }
    if (user.resetPasswordOtpExpiry < Date.now()) {
      return res.status(400).json({ success: false, error: "OTP has expired" });
    }
    const hashedPassword = await bcrypt.hash(newPassword, 10);
    user.password = hashedPassword;
    user.resetPasswordOtp = '';
    user.resetPasswordOtpExpiry = 0;
    await user.save();
    return res.status(200).json({ success: true, message: "Password reset successfully" });

  } catch (error) {
    return res.status(500).json({ success: false, error: error.message });
  }
}