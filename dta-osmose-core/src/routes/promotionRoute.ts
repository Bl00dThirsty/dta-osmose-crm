import { Router } from "express";
import { createPromotion, getActivePromotions, updateStatusPromotions, getSinglePromotions, getAllPromotion, updatePromotion, deletePromotion } from "../controllers/promotionController";
//const authorize = require("../authorize");
import authorize from "../authorize";

const router = Router();

router.post("/:institution", ...authorize("create-product"), createPromotion);
router.get("/:institution/active", getActivePromotions);
router.patch("/:id/status", updateStatusPromotions);
router.get("/:institution/promo", getAllPromotion);
router.get("/:id", getSinglePromotions);
router.put("/:id/update", ...authorize("create-product"), updatePromotion);
router.delete(
    "/:id",
    ...authorize("delete-department"),
    deletePromotion
);


export default router;