import { Router } from "express";
import { auth } from "../middleware/auth.js";
import { validate } from "../middleware/validate.js";
import { idParamSchema } from "../validators/common.validator.js";
import * as notificationsController from "../controllers/notifications.controller.js";

const router = Router();

router.use(auth);
router.get("/", notificationsController.list);
router.put("/read-all", notificationsController.markAllRead);
router.put("/:id/read", validate(idParamSchema, "params"), notificationsController.markRead);

export default router;
