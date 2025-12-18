// src/utils/logger.js
import winston from "winston";

const logger = winston.createLogger({
  level: "info", // default log level
  format: winston.format.combine(
    winston.format.timestamp({
      format: "YYYY-MM-DD HH:mm:ss"
    }),
    winston.format.errors({ stack: true }),
    winston.format.json()
  ),
  transports: [
    // Print to console (dev)
    new winston.transports.Console({
      format: winston.format.combine(
        winston.format.colorize(),
        winston.format.simple()
      )
    }),

    // Save all logs to a file
    new winston.transports.File({
      filename: "logs/app.log",
    }),

    // Save only errors
    new winston.transports.File({
      filename: "logs/error.log",
      level: "error",
    })
  ],
});

export default logger;
