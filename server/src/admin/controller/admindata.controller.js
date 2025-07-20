
import { asyncHandler } from "../../utils/asyncHandler.js";
import { User } from "../../models/user.model.js";
import ExcelUpload from "../../models/upload.model.js"; 
import { AdminActivity } from "../models/adminActivity.model.js";

export const getAllUsers = asyncHandler(async (req, res) => {
  const users = await User.find({ role: { $ne: "admin" } }).select("_id fullname email");
  res.status(200).json({ users });
});

export const getAllFiles = asyncHandler(async (req, res) => {
  const total = await ExcelUpload.countDocuments();
  res.status(200).json({ total });
});

export const deleteUser = asyncHandler(async (req, res) => {
  const user = await User.findById(req.params.id);
  if (!user) return res.status(404).json({ message: "User not found" });

  await user.deleteOne();

  if (!req.user || !req.user._id) {
    return res.status(401).json({ message: "Unauthorized: Admin not found" });
  }

  await AdminActivity.create({
    adminId: req.user._id,
    action: "Deleted user",
    targetUserId: user._id,
    details: `User ${user.fullname} deleted by admin.`,
  });

  res.status(200).json({ message: "User deleted successfully" });
});

