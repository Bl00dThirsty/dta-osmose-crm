import { Router } from "express";
import { createDesignation, getAllDesignation, deleteDesignation} from "../controllers/designationController";
import authorize from "../authorize";
const router = Router();

router.post(
    "/",
    ...authorize("create-designation"),
    createDesignation
  );
  router.get("/", ...authorize("readAll-designation"), getAllDesignation);
  router.delete(
    "/:id",
    ...authorize("delete-designation"),
    deleteDesignation
  );

export default router;