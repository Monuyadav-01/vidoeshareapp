import { Router } from "express";
import {
  deleteVideo,
  getAllVideos,
  getVideoById,
  publishAVideo,
  togglePublishStatus,
  updateVideo,
} from "../controllers/video.controllers.js";
import { verifyJWT } from "../middlewares/auth.middleware.js";
import { upload } from "../middlewares/multer.middleware.js";

const videorouter = Router();
videorouter.use(verifyJWT); // Apply verifyJWT middleware to all routes in this file

videorouter
  .route("/")
  .get(verifyJWT, getAllVideos)
  .post(
    verifyJWT,
    upload.fields([
      {
        name: "videoFile",
        maxCount: 1,
      },
      {
        name: "thumbnail",
        maxCount: 1,
      },
    ]),
    publishAVideo
  );
videorouter
  .route("/:videoId")
  .get(verifyJWT, getVideoById)
  .delete(verifyJWT, deleteVideo)
  .patch(upload.single("thumbnail"), verifyJWT, updateVideo);

videorouter
  .route("/toggle/publish/:videoId")
  .patch(verifyJWT, togglePublishStatus);

export default videorouter;
