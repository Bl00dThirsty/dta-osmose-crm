import { Router } from "express";
import { getAllInventories, createInventory, getInventoryById, deleteInventory, updateInventory } from "../controllers/inventoryController";
import authorize from "../authorize";
const router = Router();

router.post("/:institution/inventory",  authorize("create-inventory"), createInventory);
router.get("/:institution/all", authorize("readAll-inventory"), getAllInventories);
router.get("/:id", authorize("view-inventory"), getInventoryById);
router.delete("/:id", authorize("delete-inventory"), deleteInventory);
router.put("/:institution/inventory/:id", authorize("update-inventory"), updateInventory)

export default router;