import express from "express";
import dotenv from "dotenv";
import helmet from "helmet";
import morgan from "morgan";
import compression from "compression";
import cookieParser from "cookie-parser";
import cors from "cors";
import authRouter from "./routes/auth.routes.js";
import { connectDB } from "./config/db.js";
import globalErrorHandler from "./middleware/globalErrorHandler.js";
import { CLIENT_URL, NODE_ENV, PORT } from "./constants/env.js";
import { notFoundHandler } from "./middleware/notFoundHandler.js";
import userRouter from "./routes/user.routes.js";
import fileUpload from "express-fileupload";
import { isLoggedIn } from "./middleware/auth.middleware.js";
import messageRouter from "./routes/message.routes.js";
import logger from "./utils/logger.js";
import { morganLogger } from "./utils/morganLogger.js";
import { app, server } from "./utils/socket.js";


// import path from "path";
// const __dirname = path.resolve();

dotenv.config();

// Connect to Database
connectDB();

// Middleware
app.use(helmet());
app.use(
  cors({
    origin: [CLIENT_URL, "https://qn4jvf18-5173.inc1.devtunnels.ms"],
    methods: ["GET", "POST", "PUT", "DELETE"],
    credentials: true,
  })
);
app.use(morgan("dev"));
// app.use(morganLogger);
app.use(compression());
app.use(cookieParser());
app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ limit: "10mb", extended: true }));
app.use(fileUpload());

app.get("/", (req, res) => {
  res.send("Server is running");
});

// Routes
app.use("/api/auth", authRouter);
app.use("/api/user", isLoggedIn, userRouter);
app.use("/api/message", isLoggedIn, messageRouter);

app.use(globalErrorHandler);
app.use(notFoundHandler);

// if (NODE_ENV !== "development") {
//   app.use(express.static(path.join(__dirname, "../../client/dist")));

//   app.get("*", (req, res) => {
//     res.sendFile(path.join(__dirname, "../../client", "dist", "index.html"));
//   });
// }

server.listen(PORT, () => {
  // logger.info("Server started on port 7000");
  console.log(`Server is running on port http://localhost:${PORT}`);
});
