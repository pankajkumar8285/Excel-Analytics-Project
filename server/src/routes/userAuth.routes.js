import express from "express";
import {
  editProfile,
  getCurrentUser,
  logoutUser,
  resetOtp,
  resetPassword,
  uploadAvatar,
  userSignIn,
  userSingnUp,
} from "../controllers/userAuth.controller.js";
import { uploadFile } from "../middleware/multerfile.middleware.js";
import { verifyUser } from "../middleware/auth.middleware.js";

const router = express.Router();

router.route("/register").post(userSingnUp);

router.route("/login").post(userSignIn);
router.route("/logout").post(verifyUser, logoutUser);
router.route("/reset-otp").post(resetOtp);
router.route("/reset-password").post(resetPassword);
router.route("/get-user").get(verifyUser, getCurrentUser);
router.route("/editprofile").put(verifyUser, editProfile);
router
  .route("/upload-avatar")
  .post(verifyUser, uploadFile.single("avatar"), uploadAvatar);

export default router;
