import cloudinary from "../config/cloudinary.js";


export const uploadToCloudinary = async (base64Image) => {
  try {
    if (!base64Image) throw new Error("No base64 image provided");

    const result = await cloudinary.uploader.upload(base64Image, {
      folder: "chat-app",
      resource_type: "auto",
    });

    if (!result || !result.secure_url) {
      throw new Error("Invalid Cloudinary response");
    }

    return result.secure_url;
  } catch (err) {
    console.error("Cloudinary upload error:", err);
    throw new Error("Cloudinary upload failed: " + err.message);
  }
};
