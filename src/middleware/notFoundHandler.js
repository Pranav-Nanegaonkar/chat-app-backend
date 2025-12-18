import { NOT_FOUND } from "../constants/http.js";
import { AppError } from "../utils/AppAssert.js";

export const notFoundHandler = (req, res, next) => {
  const message = `404 Page Not Found - ${req.originalUrl}`;
  return res.status(NOT_FOUND).json({
    status: NOT_FOUND,
    type: "NOT_FOUND",
    message,
  });
};
