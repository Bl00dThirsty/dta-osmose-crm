
import { Router } from "express";
import { getCustomers, createCustomer, getSingleCustomer, sendTokenResetPassword, resetPassword, updateSingleCustomer, deleteSingleCustomer } from "../controllers/customerController";
import authorize from "../authorize";
const router = Router();

router.get("/", ...authorize("readAll-customer"), getCustomers);
router.post("/:institution/sendTokenResetPassword", sendTokenResetPassword);
router.post("/:institution/resetPassword", resetPassword);
router.post("/", createCustomer);
router.get("/:id", ...authorize("view-Customer"), getSingleCustomer);
router.put("/:id", ...authorize("update-customer"), updateSingleCustomer)
router.delete("/:id", ...authorize("delete-customer"), deleteSingleCustomer)
export default router;