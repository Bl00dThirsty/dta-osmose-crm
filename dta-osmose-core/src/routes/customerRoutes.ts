
import { Router } from "express";
import { getCustomers, createCustomer, getSingleCustomer, sendTokenResetPassword, resetPassword, updateSingleCustomer, deleteSingleCustomer } from "../controllers/customerController";
import authorize from "../utils/authorize";
const router = Router();

router.get("/:institution", ...authorize("readAll-customer"), getCustomers);
router.get("/:institution/customer/:id", ...authorize("view-Customer"), getSingleCustomer);
router.post("/:institution", createCustomer);
router.post("/:institution/sendTokenResetPassword", sendTokenResetPassword);
router.post("/:institution/resetPassword", resetPassword);
router.put("/:id", ...authorize("update-customer"), updateSingleCustomer)
router.delete("/:id", ...authorize("delete-customer"), deleteSingleCustomer)
export default router;