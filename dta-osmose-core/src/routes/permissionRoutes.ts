import { Router } from "express";
import { getAllPermission} from "../controllers/permissionControllers";
//const authorize = require("../authorize");
import authorize from "../authorize";

const router = Router();


router.get("/", authorize("readAll-permission"), getAllPermission);

export default router;