import { Router } from "express";
import {
  login,
  logout,
  signup,
  refresh,
  checkAuth,
} from "../controller/auth.controller.js";
import { isLoggedIn } from "../middleware/auth.middleware.js";

const authRouter = Router();

authRouter.post("/signup", signup);

authRouter.post("/login", login);
authRouter.post("/logout", logout);
authRouter.get("/check", isLoggedIn, checkAuth);
authRouter.get("/refresh", refresh);

export default authRouter;
