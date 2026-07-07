import { Router } from "express";
import { auth } from "../middleware/auth.js";
import { validate } from "../middleware/validate.js";
import { updateMeSchema } from "../validators/me.validator.js";
import * as meController from "../controllers/me.controller.js";

const router = Router();

router.get("/", auth, meController.getMe);
router.put("/", auth, validate(updateMeSchema), meController.updateMe);

export default router;
