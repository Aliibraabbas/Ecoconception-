import { Router } from "express";
import { auth } from "../middleware/auth.js";
import { validate } from "../middleware/validate.js";
import { idParamSchema } from "../validators/common.validator.js";
import {
  createProjectSchema,
  updateProjectSchema,
  listProjectsQuerySchema,
} from "../validators/projects.validator.js";
import * as projectsController from "../controllers/projects.controller.js";
import tasksRouter from "./tasks.routes.js";

const router = Router();

router.use(auth);
router.get("/", validate(listProjectsQuerySchema, "query"), projectsController.list);
router.post("/", validate(createProjectSchema), projectsController.create);
router.get("/:id", validate(idParamSchema, "params"), projectsController.getOne);
router.put("/:id", validate(idParamSchema, "params"), validate(updateProjectSchema), projectsController.update);
router.delete("/:id", validate(idParamSchema, "params"), projectsController.remove);
router.get("/:id/stats", validate(idParamSchema, "params"), projectsController.stats);
router.use("/:id/tasks", tasksRouter);

export default router;
