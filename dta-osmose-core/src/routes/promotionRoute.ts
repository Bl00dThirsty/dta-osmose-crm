import { Router } from "express";
import { createPromotion, getActivePromotions, updateStatusPromotions, getSinglePromotions, getAllPromotion, updatePromotion, deletePromotion } from "../controllers/promotionController";
//const authorize = require("../authorize");
import authorize from "../authorize";

const router = Router();

router.post("/:institution", ...authorize("create-promotion"), createPromotion);
router.get("/:institution/active", ...authorize("readAll-activePromotion"), getActivePromotions);
router.patch("/:id/status", ...authorize("update-statusPromotion"), updateStatusPromotions);
router.get("/:institution/promo", ...authorize("readAll-promotion"), getAllPromotion);
router.get("/:id", ...authorize("view-promotion"), getSinglePromotions);
router.put("/:id/update", ...authorize("update-promotion"), updatePromotion);
router.delete(
    "/:id",
    ...authorize("delete-promotion"),
    deletePromotion
);


export default router;