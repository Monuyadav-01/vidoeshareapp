import mongoose, { isValidObjectId } from "mongoose";
import { Video } from "../models/video.model.js";
import { User } from "../models/user.model.js";
import { Apierror } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import {
  uploadFileOnCloudinary,
  deleteVideoOnCloudinary,
} from "../utils/cloudinary.js";

const getAllVideos = asyncHandler(async (req, res) => {
  const { page = 1, limit = 10, query, sortBy, sortType, userId } = req.query;
  //TODO: get all videos based on query, sort, pagination
});

const publishAVideo = async (req, res) => {
  try {
    const { title, duration, description } = req.body;

    if (!title || !description || !duration) {
      return res
        .status(400)
        .json({ message: "Title, description, and duration are required" });
    }

    // Validate owner ID
    const ownerId = mongoose.Types.ObjectId.isValid(req.user.id)
      ? new mongoose.Types.ObjectId(req.user.id)
      : null;

    if (!ownerId) {
      return res.status(400).json({ message: "Invalid owner ID" });
    }

    // Get file paths from request
    const videoLocalPath = req.files?.["videoFile"]?.[0]?.path;
    const thumbnailLocalPath = req.files?.["thumbnail"]?.[0]?.path;

    if (!videoLocalPath) {
      return res.status(400).json({ message: "Video file path is missing" });
    }
    if (!thumbnailLocalPath) {
      return res
        .status(400)
        .json({ message: "Thumbnail file path is missing" });
    }

    // Upload files to Cloudinary (use await)
    const videoUpload = await uploadFileOnCloudinary(videoLocalPath);
    const thumbnailUpload = await uploadFileOnCloudinary(thumbnailLocalPath);

    if (!videoUpload) {
      return res.status(400).json({ message: "Error while uploading video" });
    }
    if (!thumbnailUpload) {
      return res
        .status(400)
        .json({ message: "Error while uploading thumbnail" });
    }

    // Create new video record
    const newVideo = new Video({
      videoFile: videoUpload.url,
      thumbnail: thumbnailUpload.url,
      title,
      description,
      duration,
      owner: ownerId,
    });

    const video = await newVideo.save();

    return res.status(201).json(video);
  } catch (error) {
    console.error("Error:", error.message);
    res.status(500).json({ message: "Failed to publish video" });
  }
};

const getVideoById = asyncHandler(async (req, res) => {
  const { videoId } = req.params;

  try {
    // Validate video ID format
    if (!mongoose.Types.ObjectId.isValid(videoId)) {
      return res.status(400).json({ message: "Invalid video ID" });
    }

    const video = await Video.findById(videoId);
    if (!video) {
      return res.status(404).json({ message: "Video not found" });
    }

    return res.status(200).json({
      success: true,
      statusCode: 200,
      data: video,
      message: "Video found successfully",
    });
  } catch (error) {
    console.error("Error fetching video:", error.message);
    return res.status(500).json({ message: "Failed to retrieve video" });
  }
});

const updateVideo = asyncHandler(async (req, res) => {
  const { videoId } = req.params;
  //TODO: update video details like title, description, thumbnail
  const { title, description, thumbnail } = req.body;
  try {
    if (!mongoose.Types.ObjectId.isValid(videoId)) {
      return res.status(400).json({ message: "Invalid video ID" });
    }
    if (!title || !description) {
      throw new Apierror(400, "Title and description is required");
    }
    const thumbnailLocalPath = req.files?.["thumbnail"]?.[0]?.path;
    if (thumbnailLocalPath) {
      throw new Apierror(
        400,
        "thumbnail local path not found while updating video"
      );
    }
    const thumbnailUpload = await uploadFileOnCloudinary(thumbnailLocalPath);
    if (thumbnailUpload) {
      throw new Apierror(400, "error while updating thumbnail on cloudinary");
    }
    const video = await Video.findByIdAndUpdate(
      videoId,
      {
        $set: {
          title,
          description,
          thumbnail: thumbnail.url,
        },
      },
      { new: true }
    );
    return res
      .status(200)
      .json(new ApiResponse(200, user, "Account Details updated successfully"));
  } catch (error) {
    throw new Apierror(
      400,

      {
        error: error.message,
        message: "Error while updating video things",
      }
    );
  }
});

const deleteVideo = asyncHandler(async (req, res) => {
  const { videoId } = req.params;

  try {
    // Validate video ID format
    if (!mongoose.Types.ObjectId.isValid(videoId)) {
      return res.status(400).json({ message: "Invalid video ID" });
    }

    const video = await Video.findByIdAndDelete(videoId);
    if (!video) {
      return res.status(404).json({ message: "Video not found" });
    }

    return res.status(200).json({
      success: true,
      data: video,
      message: "Video deleted successfully",
    });
  } catch (error) {
    console.error("Error deleting video:", error.message);
    return res.status(500).json({ message: "Failed to delete video" });
  }
});

const togglePublishStatus = asyncHandler(async (req, res) => {
  const { videoId } = req.params;
  if (!videoId) {
    throw new Apierror(401, "VideoId not found");
  }
  const videoPublishStatus = req.body;
  if (videoPublishStatus === false) {
    throw new Apierror(401, "video status is false");
  }
});

export {
  getAllVideos,
  publishAVideo,
  getVideoById,
  updateVideo,
  deleteVideo,
  togglePublishStatus,
};
