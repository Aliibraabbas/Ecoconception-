import { Router } from "express";
import * as ecoBenchmarkController from "../controllers/eco-benchmark.controller.js";

const router = Router();

router.get("/", ecoBenchmarkController.getEcoBenchmark);

export default router;
