import { Router } from "express";
import {
  createTemplate,
  listTemplates,
} from "../controllers/TemplateController.js";

const router = Router();

router.post("/", createTemplate); // POST /api/v1/notifications/templates
router.get("/", listTemplates); // GET /api/v1/notifications/templates

export default router;
