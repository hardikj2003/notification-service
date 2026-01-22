import { Router } from "express";
import {
  getPreferences,
  updatePreferences,
} from "../controllers/PreferenceController.js";

const router = Router();

// GET & PUT /api/v1/notifications/preferences
router.get("/", getPreferences);
router.put("/", updatePreferences);

export default router;
