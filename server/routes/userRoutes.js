import express from "express";
import { getUserProfile, setUserProfile, isProfileVerified } from "../controllers/userController.js";
import userAuth from "../middleware/userAuth.js";

const userRouter = express.Router();

userRouter.post("/get-profile/:userId", userAuth, getUserProfile);
userRouter.post("/set-profile/:userId", userAuth, setUserProfile);
userRouter.post("/is-profile-verified/:userId", userAuth, isProfileVerified);

export default userRouter;