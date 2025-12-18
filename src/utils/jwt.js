import jwt from "jsonwebtoken";
import { JWT_SECRET } from "../constants/env.js";

const AccessTokenOptions = {
  expiresIn: "15min",
};
const refreshTokenOptions = {
  expiresIn: "7d",
};

export const generateAccessToken = (payload) => {
  return jwt.sign(payload, JWT_SECRET, AccessTokenOptions);
};
export const generateRefreshToken = (payload) => {
  return jwt.sign(payload, JWT_SECRET, refreshTokenOptions);
};

export const verifyToken = (token) => {
  return jwt.verify(token, JWT_SECRET);
};
