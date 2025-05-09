import { Router } from "express";
import { getAllPermission} from "../controllers/permissionControllers";
const authorize = require("../authorize");

const router = Router();


router.get("/", getAllPermission);

export default router;