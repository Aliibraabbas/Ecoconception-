import { Router } from "express";
import { auth } from "../middleware/auth.js";
import { validate } from "../middleware/validate.js";
import { idParamSchema } from "../validators/common.validator.js";
import { updateTaskSchema } from "../validators/tasks.validator.js";
import * as tasksController from "../controllers/tasks.controller.js";

// Routes /api/tasks/:id (ressource individuelle, hors nesting projet)
const router = Router();

router.use(auth);
router.get("/:id", validate(idParamSchema, "params"), tasksController.getOne);
router.put("/:id", validate(idParamSchema, "params"), validate(updateTaskSchema), tasksController.update);
router.delete("/:id", validate(idParamSchema, "params"), tasksController.remove);

export default router;
