import userProfileModel from "../models/userProfileModel.js";

export const setUserProfile = async (req, res) => {
    try {

        const { userId } = req.params; // expecting :userId in the route
        console.log(userId);
        const { profile_name, description, DOB, documentURL, document_type, profile_pic_image, user_type } = req.body;

        // Check if profile already exists
        const existingProfile = await userProfileModel.findOne({ userID: userId }).lean();
        if (existingProfile) {
            return res.status(409).json({ message: "User profile already exists" }); // 409 Conflict
        }

        // Create new profile
        const newProfile = new userProfileModel({
            userID: userId,
            profile_name,
            description,
            DOB,
            documentURL,
            document_type,
            profile_pic_image,
            user_type
        });

        await newProfile.save();

        return res.status(201).json({
            message: "User profile created successfully",
            profile: newProfile
        });

    } catch (error) {

        // Handle duplicate key error (in case of race conditions)
        if (error.code === 11000 && error.keyPattern && error.keyPattern.userID) {
            return res.status(409).json({ message: "User profile already exists" });
        }

        console.error("Error setting user profile:", error);
        return res.status(500).json({ message: "Server error" });
    }
}

export const getUserProfile = async (req, res) => {
    try {
        const { userId } = req.params; // expecting :userId in the route

        const profile = await userProfileModel.findOne({ userID: userId }).lean();

        if (!profile) {
            return res.status(404).json({ message: "User profile not found" });
        }

        // if using virtuals like age, ensure they show in JSON
        return res.status(200).json(profile);
    } catch (error) {
        console.error("Error fetching user profile:", error);
        return res.status(500).json({ message: "Server error" });
    }
};

export const isProfileVerified = async (req, res) => {
    try {
        const { userId } = req.params; // expecting :userId in the route
        const profile = await userProfileModel.findOne({ userID: userId }).lean();
        if (!profile) {
            return res.status(404).json({ message: "User profile not found" });
        }

        return res.status(200).json(profile.is_document_verified);
    } catch (error) {
        console.error("Error in checking user profile verified status:", error);
        return res.status(500).json({ message: "Server error" });
    }
}