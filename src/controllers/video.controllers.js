import mongoose, { isValidObjectId } from "mongoose";
import { Video } from "../models/video.model.js";
import { User } from "../models/user.model.js";
import { Apierror } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { uploadOnCloudinary } from "../utils/cloudinary.js";

const getAllVideos = asyncHandler(async (req, res) => {
  const { page = 1, limit = 10, query, sortBy, sortType, userId } = req.query;
  //TODO: get all videos based on query, sort, pagination
});

const publishAVideo = asyncHandler(async (req, res) => {
  try {
    const { title, description } = req.body;
    // TODO: get video, upload to cloudinary, create video
    if (!(title || description)) {
      throw new Apierror(400, "Enter Title and des of video");
    }
    const thumbnailLocalPath = req.files?.thumbnail?.[0]?.path || null;
    if (!thumbnailLocalPath) {
      throw new Apierror(400, "Thumbnail Local path Not find");
    }
    const thumbnail = await uploadOnCloudinary(thumbnailLocalPath);
    if (!thumbnail) {
      throw new Apierror(401, "Problem uploading Thumbnail");
    }

    const videoFileLocalPath = req.files?.videoFile?.[0].path || null;
    if (!videoFileLocalPath) {
      throw new Apierror(400, "Video Local path Not find");
    }

    const video = await uploadOnCloudinary(videoFileLocalPath);
    if (!video) {
      throw new Apierror(401, "Problem uploading Video");
    }

    const user = await User();
    const owner = user.username;

    // make video DB

    const videos = await Video.create({
      videoFile: video.url,
      thumbnail: thumbnail.url,
      title,
      description,
      isPublished: true,
      owner,
    });

    return res
      .status(200)
      .json(new ApiResponse(200, videos, "video is uploaded"));
  } catch (error) {
    throw new Apierror(401, {
      error: error.message,
    });
  }
});

const getVideoById = asyncHandler(async (req, res) => {
  const { videoId } = req.params;
  //TODO: get video by id
});

const updateVideo = asyncHandler(async (req, res) => {
  const { videoId } = req.params;
  //TODO: update video details like title, description, thumbnail
});

const deleteVideo = asyncHandler(async (req, res) => {
  const { videoId } = req.params;
  //TODO: delete video
});

const togglePublishStatus = asyncHandler(async (req, res) => {
  const { videoId } = req.params;
});

export {
  getAllVideos,
  publishAVideo,
  getVideoById,
  updateVideo,
  deleteVideo,
  togglePublishStatus,
};
