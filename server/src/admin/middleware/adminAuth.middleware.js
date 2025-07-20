import { ApiError } from "../../utils/ApiError.js";
import { asyncHandler } from "../../utils/asyncHandler.js";
import { Admin } from "../models/admin.models.js";
import jwt from "jsonwebtoken";

export const verifyAdmin = asyncHandler(async (req, res, next) => {
  const token = req.cookies?.adminAccessToken;

  if (!token) throw new ApiError(401, "Unauthorized: No token provided");

  let decoded;
  try {
    decoded = jwt.verify(token, process.env.ADMIN_ACCESS_TOKEN_SECRET);
   
  } catch (err) {
    throw new ApiError(401, "Invalid or expired token");
  }

  const admin = await Admin.findById(decoded._id);
  

  if (!admin) {
    
    throw new ApiError(401, "Admin not found");
  }

  req.admin = admin;
  next();
});
