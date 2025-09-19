import { Router } from "express";
import { createRolePermission, getAllRolePermission, getSingleRolePermission, updateRolePermission, deleteSingleRolePermission} from "../controllers/rolePermissionControllers";
import authorize from "../authorize";

const router = Router();

router.post("/", authorize("create-rolePermission"), createRolePermission);
router.get("/", authorize("readAll-rolePermission"), getAllRolePermission);
router.get('/:id', authorize("view-rolePermission"), getSingleRolePermission);
router.put("/:id", authorize("update-rolePermission"), updateRolePermission)
router.delete("/:id", authorize("delete-rolePermission"), deleteSingleRolePermission)

export default router;