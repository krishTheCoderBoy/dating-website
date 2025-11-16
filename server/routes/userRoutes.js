import express from "express";
import authMiddleware from "../middleware/authMiddleware.js";
import {
    isProfileFilled,
    updateProfile,
    updateProfilePhoto,
    isDocUploaded,
    uploadDocs,
    updateDocs,
    isProfileVerified
} from "../controllers/userController.js";

const router = express.Router();

router.get("/is-profile-filled", authMiddleware, isProfileFilled);
router.post("/update-profile", authMiddleware, updateProfile);

router.post("/update-profile-photo", authMiddleware, updateProfilePhoto);

router.get("/is-doc-uploaded", authMiddleware, isDocUploaded);
router.post("/upload-docs", authMiddleware, uploadDocs);
router.post("/update-docs", authMiddleware, updateDocs);

router.get("/is-profile-verified", authMiddleware, isProfileVerified);

export default router;
