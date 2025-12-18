import z from "zod";
import {
  BAD_REQUEST,
  INTERNAL_SERVER_ERROR,
  UNAUTHORIZED,
} from "../constants/http.js";
import { NODE_ENV } from "../constants/env.js";
import { AppError } from "../utils/AppAssert.js";
import logger from "../utils/logger.js";
import jwt from "jsonwebtoken";
import {
  clearAccessTokenFromCookie,
  clearRefreshTokenFromCookie,
  REFRESH_PATH,
} from "../utils/cookies.js";

function getErrorLocation(stack) {
  if (!stack) return null;

  const lines = stack.split("\n");

  // Pick the first .js or .ts line
  const relevantLine = lines.find(
    (line) => line.includes(".js:") || line.includes(".ts:")
  );

  if (!relevantLine) return null;

  const match =
    relevantLine.match(/\((.*\.(ts|js)):(\d+):(\d+)\)/) ||
    relevantLine.match(/at (.*\.(ts|js)):(\d+):(\d+)/);

  if (!match) return null;

  return {
    file: match[1],
    line: Number(match[3]),
    column: Number(match[4]),
  };
}

function getAppErrorLocation(stack) {
  const lines = stack.split("\n").map((l) => l.trim());

  // Find the first line that contains your project src/
  const targetLine = lines.find(
    (line) =>
      line.includes("src/controller") || line.includes("auth.controller")
  );

  if (!targetLine) return null;

  const regex = /file:\/\/\/(.*?):(\d+):(\d+)/;
  const match = targetLine.match(regex);

  if (!match) return null;

  return {
    file: match[1].replace(/\\/g, "/"),
    line: Number(match[2]),
    column: Number(match[3]),
  };
}

function handleZodError(res, error) {
  const errors = error.issues.map((issue) => ({
    path: issue.path.join("."),
    message: issue.message,
  }));

  return res.status(BAD_REQUEST).json({
    status: BAD_REQUEST,
    type: "ZOD_VALIDATION_ERROR",
    message: error.message,
    errors,
    stack:
      NODE_ENV === "development" ? getErrorLocation(error.stack) : undefined,
  });
}

function handleAppError(res, error) {
  return res.status(error.statusCode).json({
    status: error.statusCode,
    type: "APP_ERROR",
    message: error.message,
    stack: NODE_ENV === "development" ? error.stack : undefined,
  });
}

function handleJwtError(res, error) {
  // JWT expired
  if (error instanceof jwt.TokenExpiredError) {
    return res.status(UNAUTHORIZED).json({
      status: UNAUTHORIZED,
       type: "jwt_expired",
      message: "UNAUTHORIZED",
    });
  }

  // Invalid JWT
  if (error instanceof jwt.JsonWebTokenError) {
    return res.status(UNAUTHORIZED).json({
      status: UNAUTHORIZED,
      type: "jwt_invalid",
      message: "UNAUTHORIZED",
    });
  }

  // Not usable yet (nbf)
  if (err instanceof jwt.NotBeforeError) {
    return res.status(401).json({
      status: "401",
      type: "jwt_not_active",
      message: "Token not active yet.",
    });
  }
}

const globalErrorHandler = (error, req, res, next) => {
  console.log(`PATH: ${req.path}`, error);

  if (req.path === REFRESH_PATH) {
    clearRefreshTokenFromCookie(res);
    clearAccessTokenFromCookie(res);
  }

  // ZOD VALIDATION errors
  if (error instanceof z.ZodError) {
    return handleZodError(res, error);
  }

  // APP ERROR (AppAssert / AppError)
  if (error instanceof AppError) {
    return handleAppError(res, error);
  }

  // JWT ERROR
  if (
    error instanceof jwt.TokenExpiredError ||
    error instanceof jwt.JsonWebTokenError ||
    error instanceof jwt.NotBeforeError
  ) {
    return handleJwtError(res, error);
  }

  // logger
  // logger.error({
  //   message: error.message,
  //   stack: error.stack,
  //   route: req.originalUrl,
  // });

  // UNKNOWN / INTERNAL ERROR
  return res.status(INTERNAL_SERVER_ERROR).json({
    status: INTERNAL_SERVER_ERROR,
    type: "INTERNAL_ERROR",
    message: error.message || "Something went wrong",
    stack:
      NODE_ENV === "development" ? getErrorLocation(error.stack) : undefined,
  });
};

export default globalErrorHandler;
