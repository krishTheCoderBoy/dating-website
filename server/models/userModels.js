/* 
import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    verifyOtp: { type: String, default: '' },
    isVerified: { type: Boolean, default: false },
    verifyOtpExpiry: { type: Number, default: 0 },
    resetPasswordOtp: { type: String, default: '' },
    resetPasswordOtpExpiry: { type: Number, default: 0 }
});

const userModel = mongoose.models.user || mongoose.model('user'
    , userSchema);

export default userModel;
*/

import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
    {
        name: { type: String, required: true },
        email: { type: String, required: true, unique: true },
        password: { type: String, required: true },

        profile_name: { type: String, trim: true },
        description: { type: String, trim: true },
        DOB: { type: Date },
        documentURL: { type: String, trim: true },
        document_type: { type: String, trim: true },
        profile_pic_image: { type: String, trim: true },
        user_type: { type: String, enum: ["admin", "user"], default: "user" },

        is_document_verified: { type: Boolean, default: false },
        verifyOtp: { type: String, default: '' },
        isVerified: { type: Boolean, default: false },
        verifyOtpExpiry: { type: Number, default: 0 },
        resetPasswordOtp: { type: String, default: '' },
        resetPasswordOtpExpiry: { type: Number, default: 0 },
    },

    { timestamps: true, toJSON: { virtuals: true }, toObject: { virtuals: true } }
);

// Virtual field for age
userSchema.virtual("age").get(function () {
    if (!this.DOB) return null;
    const today = new Date();
    let age = today.getFullYear() - this.DOB.getFullYear();
    const monthDiff = today.getMonth() - this.DOB.getMonth();
    if (
        monthDiff < 0 ||
        (monthDiff === 0 && today.getDate() < this.DOB.getDate())
    ) {
        age--;
    }
    return age;
});

const userModel = mongoose.models.user || mongoose.model('user', userSchema);

export default userModel;