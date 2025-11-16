import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
    {
        firstName: { type: String, required: true },
        middleName: { type: String, default: "" },
        lastName: { type: String, required: true },

        email: { type: String, required: true, unique: true },
        password: { type: String, required: true },

        dateOfBirth: { type: Date },
        gender: { type: String, enum: ["male", "female", "other"] },

        role: { type: String, enum: ["sugarmom", "boy"] },

        agreeTerms: { type: Boolean, default: false },

        approvedByAdmin: { type: Boolean, default: false },

        // profile fields
        profileName: { type: String, trim: true },
        profilePicUrl: { type: String },

        // Subscription Plans: 1 = Free, 2 = Silver, 3 = Gold
        subscriptionPlan: { type: Number, enum: [1, 2, 3], default: 1 },

        // email verification
        isEmailVerified: { type: Boolean, default: false },
        emailOtp: { type: String, default: "" },
        emailOtpExpiry: { type: Number, default: 0 },

        // password reset
        resetOtp: { type: String, default: "" },
        resetOtpExpiry: { type: Number, default: 0 },
    },
    { timestamps: true }
);

export default mongoose.model("User", userSchema);
