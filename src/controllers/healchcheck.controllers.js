import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import mongoose from "mongoose";

const healthcheck = asyncHandler(async (req, res) => {
  const dbStatus =
    mongoose.connection.readyState === 1 ? "Connected" : "Disconnected";

  return res.status(200).json(
    new ApiResponse(
      200,
      {
        status: "OK",
        uptime: `${Math.floor(process.uptime())}s`,
        serverTime: new Date().toISOString(),
        database: dbStatus,
      },
      "Health check passed successfully"
    )
  );
});

export { healthcheck };
