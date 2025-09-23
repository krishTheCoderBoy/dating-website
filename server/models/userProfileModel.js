import mongoose from "mongoose";

const userProfileSchema = new mongoose.Schema(
    {
        profile_name: { type: String, required: true, trim: true },
        description: { type: String, trim: true },
        DOB: { type: Date, required: true },
        documentURL: { type: String, trim: true },
        document_type: { type: String, trim: true },
        is_document_verified: { type: Boolean, default: false },
        userID: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
        profile_pic_image: { type: String, trim: true },
        user_type: { type: String, enum: ["admin", "user"], default: "user" },
    },
    { timestamps: true, toJSON: { virtuals: true }, toObject: { virtuals: true } }
);

// Virtual field for age
userProfileSchema.virtual("age").get(function () {
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

export default mongoose.model("UserProfiles", userProfileSchema);