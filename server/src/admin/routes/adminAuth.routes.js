import express from "express";
import {
  adminSignIn,
  adminSignUp,
  getCurrentAdmin,
  logOutAdmin,
  resetOtp,
  resetPassword,
  updateAdminAvatar,
} from "../controller/admin.controller.js";
import { verifyAdmin } from "../middleware/adminAuth.middleware.js";
import { uploadFile } from "../../middleware/multerfile.middleware.js";

const router = express.Router();

router.route("/register").post(adminSignUp);
router.route("/login").post(adminSignIn);
router.route("/logout").post(verifyAdmin, logOutAdmin);
router.route("/resetotp").post(verifyAdmin, resetOtp);
router.route("/reset-password").post(verifyAdmin, resetPassword);
router.route("/upload-avatar").post(uploadFile.single("avatar"),verifyAdmin, updateAdminAvatar);
router.route("/profile").get(verifyAdmin, getCurrentAdmin);


export default router;
