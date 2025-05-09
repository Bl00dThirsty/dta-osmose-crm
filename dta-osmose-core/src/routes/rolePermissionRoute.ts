import { Router } from "express";
import { createRolePermission, getAllRolePermission, getSingleRolePermission, updateRolePermission, deleteSingleRolePermission} from "../controllers/rolePermissionControllers";
const authorize = require("../authorize");

const router = Router();

router.post("/", createRolePermission);
router.get("/", getAllRolePermission);
router.get('/:id', getSingleRolePermission);
router.put("/:id", updateRolePermission)
router.delete("/:id", deleteSingleRolePermission)

export default router;