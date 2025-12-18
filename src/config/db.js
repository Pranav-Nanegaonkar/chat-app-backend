import mongoose from "mongoose";
import { MONGO_URI } from "../constants/env.js";
import logger from "../utils/logger.js";

export const connectDB = async () => {
  try {
    await mongoose.connect(MONGO_URI);
    // logger.info("Connected to MongoDB");
    console.log("Connected to MongoDB");
  } catch (error) {
    console.error("Error connecting to MongoDB:", error);
    process.exit(1);
  }
};
