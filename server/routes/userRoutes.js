import express from "express";
<<<<<<< HEAD
import { getUserProfile, setUserProfile, isProfileVerified } from "../controllers/userController.js";
import userAuth from "../middleware/userAuth.js";

const userRouter = express.Router();

userRouter.post("/get-profile/:userId", userAuth, getUserProfile);
userRouter.post("/set-profile/:userId", userAuth, setUserProfile);
userRouter.post("/is-profile-verified/:userId", userAuth, isProfileVerified);
=======
import userAuth from "../middleware/userAuth.js";
import { getUserData } from "../controllers/userController.js";

const userRouter = express.Router();
userRouter.get('/data', userAuth,getUserData);
>>>>>>> b2ab0f9 (last commit from my side)

export default userRouter;