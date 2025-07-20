
import express from "express";
import { generateInsight } from "../controllers/insight.controller.js";
const router = express.Router();

router.get("/:fileId", generateInsight);

export default router;
