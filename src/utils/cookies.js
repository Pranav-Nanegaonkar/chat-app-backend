import { NODE_ENV } from "../constants/env.js";

// Cookie options for production environment
export const accessTokenCookieDev = {
  httpOnly: true, // Prevent JavaScript access (protects against XSS)
  secure: NODE_ENV === "development" ? false : true, //  Off in development (localhost is not HTTPS)
  sameSite: NODE_ENV === "development" ? "lax" : "none", // Allows redirects + works in dev environment
  path: "/", // Cookie is valid for entire site
  maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
};

export const refreshTokenCookieDev = {
  httpOnly: true,
  secure: NODE_ENV === "development" ? false : true, // false
  sameSite: NODE_ENV === "development" ? "lax" : "none", // lax
  path: "/api/auth/refresh", //  restrict usage to refresh endpoint
  maxAge: 7 * 24 * 60 * 60 * 1000,
};

// Cookie options for production environment
// export const cookieOptionsProd = {
//   httpOnly: true, // Prevent JavaScript access (protects against XSS)
//   secure: true, //  Only sent over HTTPS
//   sameSite: "none", // Allows cross-site requests (needed for some production setups)
// };

export const setAccessTokenCookie = (res, value) => {
  res.cookie("accessToken", value, accessTokenCookieDev);
};
export const setRefreshTokenCookie = (res, value) => {
  res.cookie("refreshToken", value, refreshTokenCookieDev);
};

export const clearAccessTokenFromCookie = (res) => {
  res.clearCookie("accessToken", accessTokenCookieDev);
};

export const clearRefreshTokenFromCookie = (res) => {
  res.clearCookie("refreshToken", refreshTokenCookieDev);
};

export const REFRESH_PATH = "/api/auth/refresh";
