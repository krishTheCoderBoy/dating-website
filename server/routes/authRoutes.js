import express from "express";
import authMiddleware from "../middleware/authMiddleware.js";
import {
    register,
    login,
    sendOtp,
    resendOtp,
    verifyEmail,
    isEmailVerified,
    logout,
    sendResetOtp,
    resetPassword
} from "../controllers/authController.js";

const router = express.Router();

router.post("/register", register);
router.post("/login", login);

router.post("/send-verify-otp", authMiddleware, sendOtp);
router.post("/resend-verify-otp", authMiddleware, resendOtp);
router.post("/verify-email", authMiddleware, verifyEmail);

router.get("/is-email-verified", authMiddleware, isEmailVerified);
router.get("/logout", logout);

router.post("/send-reset-otp", sendResetOtp);
router.post("/reset-password", resetPassword);

export default router;
