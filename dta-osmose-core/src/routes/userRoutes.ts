import { Router } from "express";
import { getAllUser, getSingleUser, updateSingleUser, deleteSingleUser} from "../controllers/userController";
import authorize from "../authorize";

const router = Router();

router.get("/", authorize("readAll-user"), getAllUser);
router.get("/:id", authorize("view-user"), getSingleUser);
router.put("/:id", authorize("update-user"), updateSingleUser)
router.delete("/:id", authorize("delete-user"), deleteSingleUser)

export default router;