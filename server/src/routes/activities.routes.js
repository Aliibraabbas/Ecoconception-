import { Router } from "express";
import { auth } from "../middleware/auth.js";
import * as activitiesController from "../controllers/activities.controller.js";

const router = Router();

router.get("/", auth, activitiesController.list);

export default router;
