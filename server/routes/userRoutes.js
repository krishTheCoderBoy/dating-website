import express from 'express';
import userAuth from '../middleware/userAuth.js';
import { getUserProfile, isProfileVerified, setUserProfile } from "../controllers/userController.js";

const userRouter = express.Router();
userRouter.get('/data', userAuth, getUserProfile);
userRouter.post('/set-profile', userAuth, setUserProfile);
userRouter.get('/is-profile-verified', userAuth, isProfileVerified);

export default userRouter;