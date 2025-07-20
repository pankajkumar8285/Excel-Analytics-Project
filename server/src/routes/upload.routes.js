import express from "express";
import upload from '../middleware/multer.middleware.js';
import { getFileStats, getRecentActivity, getUploadHistory, getUploadsPerDay, uploadExcel } from "../controllers/upload.controller.js";
import { verifyUser } from "../middleware/auth.middleware.js";
import { get } from "http";

const router = express.Router();

// POST /api/upload
router.route('/upload').post(verifyUser,upload.single("file"), uploadExcel)
router.route('/data').get(verifyUser,getFileStats)
router.route('/recent').get(verifyUser,getRecentActivity)
router.route('/history').get(verifyUser,getUploadHistory)
router.route('/getuploads').get(verifyUser,getUploadsPerDay)

export default router;
