import { asyncHandler } from "../utils/asyncHandler.js";
import { Apierror } from "../utils/ApiError.js";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
import { User } from "../models/user.model.js";

dotenv.config();

const verifyJWT = asyncHandler(async (req, _, next) => {
  try {
    const token =
      req.cookies.accessToken ||
      req.header("Authorization")?.replace("Bearer", "");

    if (!token) {
      throw new Apierror(400, "Unauthorized request");
    }

    const decodedToken = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);

    const user = User.findById(decodedToken?._id).select(
      "-refreshToken -password"
    );

    if (!user) {
      // TODO : discuss about frontend
      throw new Apierror(401, "Invalid Access Token");
    }

    req.user = user;
    next();
  } catch (error) {
    console.log({ error: error });
    throw new Apierror(401, error?.message || "Invalid Access token");
  }
});

export { verifyJWT };
