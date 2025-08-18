import { Router } from "express";
import { getDashboardMetrics,getSalesDashboard } from "../controllers/dashboardController";
import authorize from "../authorize";
const router = Router();

router.get("/:institution",  authorize("view-product"), getDashboardMetrics);
router.get("/:institution/sales",  authorize("view-product"), getSalesDashboard);

export default router;
