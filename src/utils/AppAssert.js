// utils/AppAssert.js
export class AppError extends Error {
  constructor(message, statusCode = 400) {
    super(message);
    this.statusCode = statusCode;
    this.status = `${statusCode}`.startsWith("4") ? "fail" : "error";
    this.isOperational = true;

    Error.captureStackTrace(this, this.constructor);
  }
}

/*
 * AppAssert(condition, message, statusCode)
 * Throws AppError when condition is falsy.
 */
export const AppAssert = (condition, message, statusCode = 400) => {
  if (!condition) {
    throw new AppError(message, statusCode);
  }
};
