import expressAsyncHandler from "express-async-handler";
import { uploadToCloudinary } from "../utils/cloudinaryUpload.js";
import UserModel from "../models/user.model.js";
import { OK } from "../constants/http.js";
import { AppAssert } from "../utils/AppAssert.js";

export const updateProfile = expressAsyncHandler(async (req, res) => {
  // Implementation for updating user profile
  const { profilePicture: base64 } = req.body;

  AppAssert(base64, "Profile picture is required", 400);
  // const file = req.files.profilePic;
  // const base64 = `data:${file.mimetype};base64,${file.data.toString("base64")}`;

  // console.log(base64);

  const userId = req.user._id;

  const result = await uploadToCloudinary(base64);

  console.log(result);

  const updatedUser = await UserModel.findByIdAndUpdate(
    userId,
    { profilePicture: result },
    { new: true }
  ).select("-password");

  res.json({ success: true, user: updatedUser });
});

export const getUsersForSidebar = expressAsyncHandler(async (req, res) => {
  const currentUserId = req.user._id;

  const filteredUsers = await UserModel.find({
    _id: { $ne: currentUserId },
  }).select("-password");

  res.status(OK).json(filteredUsers);
});
