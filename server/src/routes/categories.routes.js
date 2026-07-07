import { Router } from "express";
import { auth } from "../middleware/auth.js";
import { validate } from "../middleware/validate.js";
import { idParamSchema } from "../validators/common.validator.js";
import { createCategorySchema, updateCategorySchema } from "../validators/categories.validator.js";
import * as categoriesController from "../controllers/categories.controller.js";

const router = Router();

router.use(auth);
router.get("/", categoriesController.list);
router.post("/", validate(createCategorySchema), categoriesController.create);
router.put("/:id", validate(idParamSchema, "params"), validate(updateCategorySchema), categoriesController.update);
router.delete("/:id", validate(idParamSchema, "params"), categoriesController.remove);

export default router;
