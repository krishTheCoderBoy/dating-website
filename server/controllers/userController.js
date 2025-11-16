import User from "../models/User.js";
import UserDocument from "../models/UserDocument.js";

export const isProfileFilled = async (req, res) => {
  const user = await User.findById(req.userId);

  const filled =
    user.dateOfBirth &&
    user.gender &&
    user.role &&
    user.agreeTerms;

  res.json({ filled });
};

export const updateProfile = async (req, res) => {
  const { dateOfBirth, gender, role, agreeTerms } = req.body;

  await User.findByIdAndUpdate(req.userId, {
    dateOfBirth,
    gender,
    role,
    agreeTerms,
  });

  res.json({ success: true });
};

export const updateProfilePhoto = async (req, res) => {
  const { profilePicUrl, profileName } = req.body;

  await User.findByIdAndUpdate(req.userId, {
    profilePicUrl,
    profileName
  });

  res.json({ success: true });
};

export const isDocUploaded = async (req, res) => {
  const doc = await UserDocument.findOne({ userId: req.userId });
  res.json({ uploaded: !!doc });
};

export const uploadDocs = async (req, res) => {
  const { personImage, personGovtId, docType } = req.body;

  await UserDocument.create({
    userId: req.userId,
    personImage,
    personGovtId,
    docType
  });

  res.json({ success: true });
};

export const updateDocs = async (req, res) => {
  const { personImage, personGovtId, docType } = req.body;

  await UserDocument.findOneAndUpdate(
    { userId: req.userId },
    { personImage, personGovtId, docType }
  );

  res.json({ success: true });
};

export const isProfileVerified = async (req, res) => {
  const user = await User.findById(req.userId);
  const docs = await UserDocument.findOne({ userId: req.userId });

  const verified =
    user.isEmailVerified &&
    docs &&
    docs.approved &&
    user.approvedByAdmin;

  res.json({ isVerified: verified });
};
