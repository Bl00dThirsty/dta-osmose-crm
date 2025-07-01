import { Router } from "express";
import { getDashboardMetrics } from "../controllers/dashboardController";
import authorize from "../authorize";
const router = Router();

router.get("/:institution",  authorize("view-product"), getDashboardMetrics);

export default router;
