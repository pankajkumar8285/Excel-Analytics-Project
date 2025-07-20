// backend/routes/admin.routes.js
import express from "express";
import {
  getAllUsers,
  getAllFiles,
  deleteUser,
} from "../controller/admindata.controller.js";
import {verifyAdmin} from '../middleware/adminAuth.middleware.js'

const router = express.Router();

router.route("/all-users").get( getAllUsers);
router.route("/all-files").get(  getAllFiles);
router.route("/delete-user/:id",).delete( deleteUser);

export default router;
