/* import userModel from "../models/userModels.js";

export const getUserData = async (req, res) => {
    try {
    console.log("👉 Request body in getUserData:", req.body);

    const { userId } = req.body;
    console.log("👉 Extracted userId:", userId);

    const user = await userModel.findById(userId);
    console.log("✅ User fetched from DB:", user);

    if (!user) {
      console.log("❌ User not found in DB");
      return res.status(404).json({ success: false, error: "User not found" });
    }

    res.status(200).json({
      success: true,
      userData: { name: user.name, email: user.email, isVerified: user.isVerified },
    });
  } catch (error) {
    console.error("❌ Error in getUserData:", error.message);
    res.status(500).json({ success: false, error: error.message });
  }
}
 */

import userModel from "../models/userModels.js";

export const setUserProfile = async (req, res) => {
  try {
    const userId = req.body.userId; // get it from route param
    const updates = req.body;

    // Validate required fields if this is a first-time setup
    const requiredFields = ["profile_name", "description", "DOB", "documentURL", "document_type", "profile_pic_image", "user_type"];
    for (const field of requiredFields) {
      if (!updates[field]) {
        return res.status(400).json({ message: `Missing required field: ${field}` });
      }
    }

    const updatedProfile = await userModel.findByIdAndUpdate(
      userId,
      { $set: updates },
      { new: true, runValidators: true }
    );

    if (!updatedProfile) {
      return res.status(404).json({ message: "User profile does not exist" });
    }

    return res.status(200).json({
      message: "User profile updated successfully",
      profile: updatedProfile
    });

  } catch (error) {

    // Handle duplicate key error (in case of race conditions)
    if (error.code === 11000 && error.keyPattern && error.keyPattern._id) {
      return res.status(409).json({ message: "User profile already exists" });
    }

    console.error("Error setting user profile:", error);
    return res.status(500).json({ message: "Server error" });
  }
}

export const getUserProfile = async (req, res) => {
  try {
    // const { userId } = req.body; // expecting :userId in the route
    const userId = req.body.userId; // get it from route param
    console.log("hello there , the decoded id is : ", userId);
    const profile = await userModel.findOne({ _id: userId }).lean();

    if (!profile) {
      return res.status(404).json({ message: "User profile not found" });
    }

    console.log("this is the getUserProfile function");
    console.log(profile);
    // if using virtuals like age, ensure they show in JSON
    return res.status(200).json(profile);
  } catch (error) {
    console.error("Error fetching user profile:", error);
    return res.status(500).json({ message: "Server error" });
  }
};

export const isProfileVerified = async (req, res) => {
  try {
    const userId = req.body.userId; // get it from route param
    console.log(userId);
    const profile = await userModel.findOne({ _id: userId }).lean();
    if (!profile) {
      return res.status(404).json({ message: "User profile not found" });
    }
    console.log(profile);

    return res.status(200).json(profile.isVerified);
  } catch (error) {
    console.error("Error in checking user profile verified status:", error);
    return res.status(500).json({ message: "Server error" });
  }
};

