import { Router } from "express";
import { createDesignation, getAllDesignation, deleteDesignation} from "../controllers/designationController";
import authorize from "../authorize";
const router = Router();

router.post(
    "/",
    ...authorize("create-department"),
    createDesignation
  );
  router.get("/", getAllDesignation);
  router.delete(
    "/:id",
    ...authorize("delete-department"),
    deleteDesignation
  );

export default router;