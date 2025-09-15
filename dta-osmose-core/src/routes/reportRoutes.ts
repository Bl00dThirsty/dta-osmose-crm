import { Router } from "express";
import { createReport, getSingleReport, getReport, getReportByStaff, deleteReport } from "../controllers/reportController";
//const authorize = require("../authorize");
import authorize from "../authorize";

const router = Router();

router.post("/:institution", ...authorize("create-report"), createReport);
router.get("/staff", ...authorize("readAll-reportBystaff"), getReportByStaff);
router.get("/:id", ...authorize("view-report"), getSingleReport);
router.get("/:institution/all", ...authorize("readAll-report"), getReport);
router.delete("/:id", ...authorize("delete-report"), deleteReport);


export default router;