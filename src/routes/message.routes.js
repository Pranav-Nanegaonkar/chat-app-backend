import { Router } from "express";
import { getMessages, sendMessage } from "../controller/message.controller.js";

const messageRouter = Router();

messageRouter.get("/:id", getMessages);
messageRouter.post("/send/:id", sendMessage);

export default messageRouter;
