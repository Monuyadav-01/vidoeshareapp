import { v2 as cloudinary } from "cloudinary";
import fs from "fs";
import dotenv from "dotenv";
import { Apierror } from "./ApiError.js";
import { asyncHandler } from "./asyncHandler.js";
dotenv.config();
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

const uploadFileOnCloudinary = async (localFilePath) => {
  try {
    if (!localFilePath) return null;

    // Upload file
    const response = await cloudinary.uploader.upload(localFilePath, {
      resource_type: "auto",
    });

    // Delete file only if upload was successful
    if (response) {
      fs.unlinkSync(localFilePath);
    }

    return response;
  } catch (error) {
    console.error("Cloudinary Upload Error:", error.message);
    if (fs.existsSync(localFilePath)) {
      fs.unlinkSync(localFilePath); // Only delete if file exists
    }
    return null;
  }
};

const deleteOldCloudinaryImage = asyncHandler(async (publicId) => {
  try {
    if (!publicId) {
      throw new Apierror(400, "Error finding public id");
    }
    const response = cloudinary.uploader.destroy(publicId);
    console.log("old image deleted", response);
    return response;
  } catch (error) {
    console.log("Error", error.message);
    return null;
  }
});
const deleteVideoOnCloudinary = asyncHandler(async (publicId) => {
  try {
    if (!publicId) {
      throw new Apierror(400, "Error finding public id");
    }
    const response = cloudinary.uploader.destroy(publicId);
    console.log("Video is deleted", response);
    return response;
  } catch (error) {
    console.log("Error", error.message);
    return null;
  }
});
export { uploadFileOnCloudinary, deleteVideoOnCloudinary };
