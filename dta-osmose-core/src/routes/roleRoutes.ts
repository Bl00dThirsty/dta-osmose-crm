import { Router } from "express";
import { createRole, getAllRole, getSingleRole, getPermissionsByRoleId, deleteRolePermission, deleteSingleRole} from "../controllers/roleControllers";
import authorize from "../authorize"; // ✅ ES6 import

const router = Router();

router.post("/", ...authorize("create-role"), createRole);
router.get("/", authorize("readAll-role"), getAllRole);
router.get("/:id", authorize("view-role"), getSingleRole);
router.get('/:id/permission', authorize("readAll-permissionByrole"), getPermissionsByRoleId);
router.delete('/:roleId/permission/:permissionId', authorize("deleteAll-rolePermission"), deleteRolePermission);

router.delete("/:id", authorize("delete-role"), deleteSingleRole)

export default router;