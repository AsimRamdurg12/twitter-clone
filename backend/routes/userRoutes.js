import express from "express";
import { protectRoute } from "../middlewares/protectRoute.js";
import { followUser, getSuggestedUsers, getUserProfile, updateUserProfile } from "../controllers/userController.js";


const router = express.Router();

router.get("/profile/:username",protectRoute, getUserProfile)

router.get("/suggested",protectRoute, getSuggestedUsers)

router.post("/follow/:id",protectRoute, followUser)

router.post("/update",protectRoute, updateUserProfile)

export default router;