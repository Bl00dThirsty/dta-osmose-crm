import { Router } from "express";
import { createRole, getAllRole, getSingleRole, deleteSingleRole} from "../controllers/roleControllers";
const authorize = require("../authorize");

const router = Router();

router.post("/", createRole);
router.get("/", getAllRole);
router.get('/:id', getSingleRole);
router.patch("/:id", deleteSingleRole)

export default router;