import expressAsyncHandler from "express-async-handler";
import MessageModel from "../models/message.model.js";
import { BAD_REQUEST, CREATED, OK } from "../constants/http.js";
import z from "zod";
import { uploadToCloudinary } from "../utils/cloudinaryUpload.js";
import { AppAssert } from "../utils/AppAssert.js";
import mongoose from "mongoose";
import { getReciverSocketId, io } from "../utils/socket.js";

const sendMessageSchema = z.object({
  text: z.string().optional(),
  image: z.string().optional().nullable(),
});

export const getMessages = expressAsyncHandler(async (req, res) => {
  const userToChatId = req.params?.id;

  AppAssert(
    mongoose.Types.ObjectId.isValid(userToChatId),
    "Invalid Mongo ID",
    BAD_REQUEST
  );

  const myId = req.user._id;

  const messages = await MessageModel.find({
    $or: [
      { senderId: myId, receiverId: userToChatId },
      { senderId: userToChatId, receiverId: myId },
    ],
  }).sort({ createdAt: 1 });

  res.status(OK).json(messages);
});

export const sendMessage = expressAsyncHandler(async (req, res) => {
  const { text, image } = sendMessageSchema.parse(req.body);
  const receiverId = req.params?.id;

  AppAssert(
    mongoose.Types.ObjectId.isValid(receiverId),
    "Invalid Mongo ID",
    BAD_REQUEST
  );
  const senderId = req.user._id;

  let imageUrl;
  if (image) {
    // base64 image
    const uploadResponce = await uploadToCloudinary(image);
    imageUrl = uploadResponce;
  }

  const newMessage = new MessageModel({
    senderId,
    receiverId,
    text,
    image: imageUrl,
  });

  await newMessage.save();

  // donetodo: realtime functionality using socket io
  const reciverSocketId = getReciverSocketId(receiverId);
  if (reciverSocketId) {
    io.to(reciverSocketId).emit("newMessage", newMessage);
  }

  res.status(CREATED).json(newMessage);
});
