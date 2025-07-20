
import mongoose from "mongoose";

const adminActivitySchema = new mongoose.Schema(
  {
    adminId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    action: { type: String, required: true },
    targetUserId: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    details: { type: String },
  },
  { timestamps: true }
);

export const AdminActivity = mongoose.model("AdminActivity", adminActivitySchema);
