import userModel from "../models/userModels.js";

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