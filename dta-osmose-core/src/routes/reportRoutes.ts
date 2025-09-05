import { Router } from "express";
import { createReport, getSingleReport, getReport, getReportByStaff, deleteReport } from "../controllers/reportController";
//const authorize = require("../authorize");
import authorize from "../authorize";

const router = Router();

router.post("/:institution", ...authorize("create-product"), createReport);
router.get("/staff", ...authorize("view-product"), getReportByStaff);
router.get("/:id", getSingleReport);
router.get("/:institution/all", getReport);
router.delete("/:id", deleteReport);


export default router;