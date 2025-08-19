import { Router } from "express";
import { getDashboardMetrics,getSalesDashboard,getTopProducts } from "../controllers/dashboardController";
import authorize from "../authorize";
const router = Router();

router.get("/:institution",  authorize("view-product"), getDashboardMetrics);
router.get("/:institution/sales",  authorize("view-product"), getSalesDashboard);
router.get("/:institution/top-products", authorize("view-product"), getTopProducts);

export default router;
