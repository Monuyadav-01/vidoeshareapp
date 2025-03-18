import mongoose from "mongoose";
import { Tweet } from "../models/tweet.model.js";
import { User } from "../models/user.model.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";

// Create Tweet
const createTweet = asyncHandler(async (req, res) => {
  const { content, image } = req.body;

  if (!content) {
    throw new ApiError(400, "Tweet content is required");
  }

  const newTweet = await Tweet.create({
    content,
    image,
    owner: req.user.id,
  });

  res
    .status(201)
    .json(new ApiResponse(201, newTweet, "Tweet created successfully"));
});

// Get User Tweets with Pagination & Aggregation
const getUserTweets = asyncHandler(async (req, res) => {
  const { userId } = req.params;
  const { page = 1, limit = 10 } = req.query;

  if (!mongoose.Types.ObjectId.isValid(userId)) {
    throw new ApiError(400, "Invalid user ID");
  }

  const skip = (parseInt(page) - 1) * parseInt(limit);

  const tweets = await Tweet.aggregate([
    { $match: { owner: new mongoose.Types.ObjectId(userId) } },
    { $sort: { createdAt: -1 } },
    { $skip: skip },
    { $limit: parseInt(limit) },
    {
      $lookup: {
        from: "users",
        localField: "owner",
        foreignField: "_id",
        as: "ownerDetails",
      },
    },
    { $unwind: "$ownerDetails" },
    {
      $project: {
        content: 1,
        image: 1,
        createdAt: 1,
        "ownerDetails.username": 1,
      },
    },
  ]);

  const totalTweets = await Tweet.countDocuments({ owner: userId });

  res.status(200).json(
    new ApiResponse(200, tweets, "User tweets fetched successfully", {
      totalItems: totalTweets,
      currentPage: parseInt(page),
      totalPages: Math.ceil(totalTweets / parseInt(limit)),
    })
  );
});

// Update Tweet
const updateTweet = asyncHandler(async (req, res) => {
  const { tweetId } = req.params;
  const { content, image } = req.body;

  if (!mongoose.Types.ObjectId.isValid(tweetId)) {
    throw new ApiError(400, "Invalid tweet ID");
  }

  const updatedTweet = await Tweet.findByIdAndUpdate(
    tweetId,
    { content, image },
    { new: true }
  );

  if (!updatedTweet) {
    throw new ApiError(404, "Tweet not found");
  }

  res
    .status(200)
    .json(new ApiResponse(200, updatedTweet, "Tweet updated successfully"));
});

// Delete Tweet
const deleteTweet = asyncHandler(async (req, res) => {
  const { tweetId } = req.params;

  if (!mongoose.Types.ObjectId.isValid(tweetId)) {
    throw new ApiError(400, "Invalid tweet ID");
  }

  const deletedTweet = await Tweet.findByIdAndDelete(tweetId);

  if (!deletedTweet) {
    throw new ApiError(404, "Tweet not found");
  }

  res
    .status(200)
    .json(new ApiResponse(200, deletedTweet, "Tweet deleted successfully"));
});

export { createTweet, getUserTweets, updateTweet, deleteTweet };
