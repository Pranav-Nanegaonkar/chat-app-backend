import expressAsyncHandler from "express-async-handler";
import { AppAssert } from "../utils/AppAssert.js";
import { UNAUTHORIZED } from "../constants/http.js";
import { verifyToken } from "../utils/jwt.js";
import UserModel from "../models/user.model.js";

export const isLoggedIn = expressAsyncHandler(async (req, res, next) => {
  // Middleware to check if user is logged in
  const accessToken = req.cookies?.accessToken;

  AppAssert(accessToken, "UNAUTHORIZED", UNAUTHORIZED);

  const decoded = verifyToken(accessToken);
  AppAssert(decoded, "Invalid access token", UNAUTHORIZED);

  const user = await UserModel.findById(decoded.userId).select("-password");

  AppAssert(user, "User not found", UNAUTHORIZED);

  req.user = user;

  next();
});
