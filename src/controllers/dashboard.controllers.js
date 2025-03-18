import mongoose from "mongoose";
import { Video } from "../models/video.model.js";
import { Subscription } from "../models/subscription.model.js";
import { Like } from "../models/like.model.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";

// Get channel stats (total video views, subscribers, videos, likes)
const getChannelStats = asyncHandler(async (req, res) => {
  const { channelId } = req.params;

  if (!mongoose.Types.ObjectId.isValid(channelId)) {
    throw new ApiError(400, "Invalid channel ID");
  }

  // Check if user exists
  const userExists = await Video.exists({ user: channelId });
  if (!userExists) {
    throw new ApiError(404, "Channel not found");
  }

  const totalVideos = await Video.countDocuments({ user: channelId });

  // Total video views (return 0 if no videos)
  const totalViews = await Video.aggregate([
    { $match: { user: new mongoose.Types.ObjectId(channelId) } },
    { $group: { _id: null, totalViews: { $sum: "$views" } } },
  ]);

  const totalLikes = await Like.countDocuments({
    video: { $in: await Video.find({ user: channelId }).select("_id") },
  });

  const totalSubscribers = await Subscription.countDocuments({
    channel: channelId,
  });

  return res.status(200).json(
    new ApiResponse(
      200,
      {
        totalVideos,
        totalViews: totalViews[0]?.totalViews || 0,
        totalLikes,
        totalSubscribers,
      },
      "Channel stats fetched successfully"
    )
  );
});

// Get all videos uploaded by the channel
const getChannelVideos = asyncHandler(async (req, res) => {
  const { channelId } = req.params;
  const { page = 1, limit = 10 } = req.query;

  if (!mongoose.Types.ObjectId.isValid(channelId)) {
    throw new ApiError(400, "Invalid channel ID");
  }

  // Check if user exists
  const userExists = await Video.exists({ user: channelId });
  if (!userExists) {
    throw new ApiError(404, "Channel not found");
  }

  const videos = await Video.find({ user: channelId })
    .populate("user", "username") // Only fetch username, not the whole user object
    .sort({ createdAt: -1 })
    .skip((page - 1) * limit)
    .limit(Number(limit))
    .lean();

  const totalVideos = await Video.countDocuments({ user: channelId });

  return res.status(200).json(
    new ApiResponse(
      200,
      {
        videos,
        totalPages: Math.ceil(totalVideos / limit),
        currentPage: Number(page),
      },
      "Channel videos fetched successfully"
    )
  );
});

export { getChannelStats, getChannelVideos };
