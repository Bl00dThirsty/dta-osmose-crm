import { Router } from "express";
import { createRole, getAllRole, getSingleRole, getPermissionsByRoleId, deleteRolePermission, deleteSingleRole} from "../controllers/roleControllers";
const authorize = require("../authorize");

const router = Router();

router.post("/", createRole);
router.get("/", getAllRole);
router.get("/:id", getSingleRole);
router.get('/:id/permission', getPermissionsByRoleId);
router.delete('/:roleId/permission/:permissionId', deleteRolePermission);

router.patch("/:id", deleteSingleRole)

export default router;