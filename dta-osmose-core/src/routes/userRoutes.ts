import { Router } from "express";
import { getAllUser, getSingleUser, updateSingleUser, deleteSingleUser} from "../controllers/userController";

const router = Router();

router.get("/", getAllUser);
router.get("/:id", getSingleUser);
router.put("/:id", updateSingleUser)
router.patch("/:id", deleteSingleUser)

export default router;