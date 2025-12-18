import morgan from "morgan";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

// Fix __dirname for ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Ensure logs folder exists
const logDirectory = path.join(__dirname, "../../logs");
if (!fs.existsSync(logDirectory)) {
  fs.mkdirSync(logDirectory);
}

// Create a write stream for requests.log
const accessLogStream = fs.createWriteStream(
  path.join(logDirectory, "requests.log"),
  { flags: "a" }
);

// Export Morgan middleware
export const morganLogger = morgan("combined", { stream: accessLogStream });
