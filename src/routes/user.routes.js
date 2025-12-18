import { Router } from "express";
import {
  getUsersForSidebar,
  updateProfile,
} from "../controller/user.controller.js";

const userRouter = Router();

userRouter.get("/", getUsersForSidebar);
userRouter.put("/profile", updateProfile);

export default userRouter;
