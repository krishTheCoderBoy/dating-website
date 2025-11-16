import mongoose from "mongoose";

const documentSchema = new mongoose.Schema(
    {
        userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },

        personImage: { type: String }, // Selfie / face
        personGovtId: { type: String }, // ID card

        docType: { type: String }, // Aadhaar / Passport / etc

        approved: { type: Boolean, default: false },
    },
    { timestamps: true }
);

export default mongoose.model("UserDocument", documentSchema);
