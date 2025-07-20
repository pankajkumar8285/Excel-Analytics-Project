
import { AdminActivity } from "../model/adminActivity.model.js";

export const logAdminAction = async ({ adminId, action, targetUserId, details = "" }) => {
  try {
    await AdminActivity.create({ adminId, action, targetUserId, details });
  } catch (err) {
    console.error("Activity log error:", err);
  }
};

export const getAdminActivityLogs = async (req, res) => {
  try {
    const logs = await AdminActivity.find()
      .populate("adminId", "fullname email")
      .populate("targetUserId", "fullname email")
      .sort({ createdAt: -1 })
      .limit(100);
    res.status(200).json({ logs });
  } catch (err) {
    res.status(500).json({ message: "Failed to fetch logs" });
  }
};
