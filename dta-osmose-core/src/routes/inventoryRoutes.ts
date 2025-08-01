import { Router } from "express";
import { getAllInventories, createInventory, getInventoryById, deleteInventory, updateInventory } from "../controllers/inventoryController";
import authorize from "../authorize";
const router = Router();

router.post("/:institution/inventory",  createInventory);
router.get("/:institution/all", getAllInventories);
router.get("/:id", getInventoryById);
router.delete("/:id", deleteInventory);
router.put("/:institution/inventory/:id", updateInventory)

export default router;