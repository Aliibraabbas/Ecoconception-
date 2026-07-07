import { Router } from "express";
import { validate } from "../middleware/validate.js";
import { idParamSchema } from "../validators/common.validator.js";
import { createTaskSchema, listTasksQuerySchema } from "../validators/tasks.validator.js";
import * as tasksController from "../controllers/tasks.controller.js";

// mergeParams: accessible en tant que sous-route de /api/projects/:id/tasks
const router = Router({ mergeParams: true });

router.get("/", validate(idParamSchema, "params"), validate(listTasksQuerySchema, "query"), tasksController.list);
router.post("/", validate(idParamSchema, "params"), validate(createTaskSchema), tasksController.create);

export default router;
