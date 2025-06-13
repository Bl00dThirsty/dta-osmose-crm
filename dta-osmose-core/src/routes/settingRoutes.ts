import { Router } from "express";
import { updateSetting, getSetting} from "../controllers/settingController";
import authorize from "../authorize";
const router = Router();


  router.put("/:id", updateSetting);
  router.get( "/:institution", getSetting);

export default router;