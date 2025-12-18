import expressAsyncHandler from "express-async-handler";
import z from "zod";
import { CONFLICT, OK, UNAUTHORIZED } from "../constants/http.js";
import { AppAssert } from "../utils/AppAssert.js";
import UserModel from "../models/user.model.js";
import {
  clearAccessTokenFromCookie,
  clearRefreshTokenFromCookie,
  setAccessTokenCookie,
  setRefreshTokenCookie,
} from "../utils/cookies.js";
import {
  generateAccessToken,
  generateRefreshToken,
  verifyToken,
} from "../utils/jwt.js";

const signupSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6),
  fullName: z.string().optional(),
});

const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6),
});

export const signup = expressAsyncHandler(async (req, res) => {
  const data = signupSchema.parse(req.body);

  const user = await UserModel.findOne({ email: data.email });

  AppAssert(!user, "User with this email already exists", CONFLICT);

  const newUser = await UserModel.create(data);

  AppAssert(newUser, "Failed to create user", 500);

  const accessToken = generateAccessToken({ userId: newUser._id });
  const refreshToken = generateRefreshToken({ userId: newUser._id });
  setAccessTokenCookie(res, accessToken);
  setRefreshTokenCookie(res, refreshToken);

  return res.status(OK).json({
    success: true,
    user: newUser.omitPassword(),
  });
});

export const login = expressAsyncHandler(async (req, res) => {
  const data = loginSchema.parse(req.body);

  const user = await UserModel.findOne({ email: data.email });

  AppAssert(user, "Invalid email or password", UNAUTHORIZED);

  const isPasswordValid = await user.comparePassword(data.password);

  AppAssert(isPasswordValid, "Invalid email or password", UNAUTHORIZED);

  const accessToken = generateAccessToken({ userId: user._id });
  const refreshToken = generateRefreshToken({ userId: user._id });

  setAccessTokenCookie(res, accessToken);
  setRefreshTokenCookie(res, refreshToken);
  return res.status(OK).json({
    success: true,
    user: user.omitPassword(),
  });
});

export const logout = expressAsyncHandler(async (req, res) => {
  clearAccessTokenFromCookie(res);
  clearRefreshTokenFromCookie(res);
  return res.status(OK).json({
    success: true,
    message: "Logged out successfully",
  });
});

export const checkAuth = expressAsyncHandler((req, res) => {
  const user = req.user;
  AppAssert(user, "Error in checkAuth", UNAUTHORIZED);

  res.status(OK).json({ success: true, user });
});

export const refresh = expressAsyncHandler(async (req, res) => {
  const refreshToken = req.cookies?.refreshToken;

  AppAssert(refreshToken, "UNAUTHORIZED_NO_REFRESH", UNAUTHORIZED);
  const decoded = verifyToken(refreshToken);

  AppAssert(decoded, "Invalid refresh token", UNAUTHORIZED);

  const user = await UserModel.findById(decoded.userId);

  AppAssert(user, "User not found", UNAUTHORIZED);

  const newAccessToken = generateAccessToken({ userId: user._id });
  setAccessTokenCookie(res, newAccessToken);
  return res.status(OK).json({
    success: true,
    message: "Access token refreshed",
  });
});
