import { Router } from "express";
import { updateSetting, getSetting} from "../controllers/settingController";
import authorize from "../authorize";
const router = Router();


  router.put("/:id", authorize("update-setting"), updateSetting);
  router.get( "/:institution", authorize("view-setting"), getSetting);

export default router;