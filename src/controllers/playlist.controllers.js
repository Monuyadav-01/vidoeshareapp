import mongoose, { isValidObjectId } from "mongoose";
import { Playlist } from "../models/playlist.model.js";
import { Video } from "../models/video.model.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";

const createPlaylist = asyncHandler(async (req, res) => {
  const { name, description } = req.body;
  if (!name) throw new ApiError(400, "Playlist name is required");

  const newPlaylist = new Playlist({
    name,
    description,
    owner: req.user.id,
  });

  await newPlaylist.save();
  res
    .status(201)
    .json(new ApiResponse(201, newPlaylist, "Playlist created successfully"));
});

const getUserPlaylists = asyncHandler(async (req, res) => {
  const { userId } = req.params;

  if (!isValidObjectId(userId)) throw new ApiError(400, "Invalid user ID");

  const playlists = await Playlist.find({ owner: userId });
  res
    .status(200)
    .json(
      new ApiResponse(200, playlists, "User playlists fetched successfully")
    );
});

const getPlaylistById = asyncHandler(async (req, res) => {
  const { playlistId } = req.params;

  if (!isValidObjectId(playlistId))
    throw new ApiError(400, "Invalid playlist ID");

  const playlist = await Playlist.findById(playlistId).populate("videos");
  if (!playlist) throw new ApiError(404, "Playlist not found");

  res
    .status(200)
    .json(new ApiResponse(200, playlist, "Playlist fetched successfully"));
});

const addVideoToPlaylist = asyncHandler(async (req, res) => {
  const { playlistId, videoId } = req.params;

  if (!isValidObjectId(playlistId) || !isValidObjectId(videoId))
    throw new ApiError(400, "Invalid IDs");

  const playlist = await Playlist.findById(playlistId);
  const video = await Video.findById(videoId);

  if (!playlist || !video)
    throw new ApiError(404, "Playlist or video not found");

  if (!playlist.videos.includes(videoId)) {
    playlist.videos.push(videoId);
    await playlist.save();
  }

  res
    .status(200)
    .json(new ApiResponse(200, playlist, "Video added to playlist"));
});

const removeVideoFromPlaylist = asyncHandler(async (req, res) => {
  const { playlistId, videoId } = req.params;

  if (!isValidObjectId(playlistId) || !isValidObjectId(videoId))
    throw new ApiError(400, "Invalid IDs");

  const playlist = await Playlist.findById(playlistId);
  if (!playlist) throw new ApiError(404, "Playlist not found");

  playlist.videos = playlist.videos.filter((id) => id.toString() !== videoId);
  await playlist.save();

  res
    .status(200)
    .json(new ApiResponse(200, playlist, "Video removed from playlist"));
});

const deletePlaylist = asyncHandler(async (req, res) => {
  const { playlistId } = req.params;

  if (!isValidObjectId(playlistId))
    throw new ApiError(400, "Invalid playlist ID");

  const playlist = await Playlist.findByIdAndDelete(playlistId);
  if (!playlist) throw new ApiError(404, "Playlist not found");

  res
    .status(200)
    .json(new ApiResponse(200, {}, "Playlist deleted successfully"));
});

const updatePlaylist = asyncHandler(async (req, res) => {
  const { playlistId } = req.params;
  const { name, description } = req.body;

  if (!isValidObjectId(playlistId))
    throw new ApiError(400, "Invalid playlist ID");

  const playlist = await Playlist.findByIdAndUpdate(
    playlistId,
    { name, description },
    { new: true }
  );

  if (!playlist) throw new ApiError(404, "Playlist not found");

  res
    .status(200)
    .json(new ApiResponse(200, playlist, "Playlist updated successfully"));
});

export {
  createPlaylist,
  getUserPlaylists,
  getPlaylistById,
  addVideoToPlaylist,
  removeVideoFromPlaylist,
  deletePlaylist,
  updatePlaylist,
};
