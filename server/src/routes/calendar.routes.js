import { Router } from "express";
import { auth } from "../middleware/auth.js";
import * as calendarController from "../controllers/calendar.controller.js";

const router = Router();

router.get("/", auth, calendarController.getCalendar);

export default router;
