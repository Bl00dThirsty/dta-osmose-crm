import { Router } from "express";
import { createSingleDepartment, getAllDepartment, deleteDepartment} from "../controllers/departmentController";
import authorize from "../authorize";
const router = Router();

router.post(
    "/",
    ...authorize("create-department"),
    createSingleDepartment
  );
  router.get("/", getAllDepartment);
  router.delete(
    "/:id",
    ...authorize("delete-department"),
    deleteDepartment
  );

export default router;