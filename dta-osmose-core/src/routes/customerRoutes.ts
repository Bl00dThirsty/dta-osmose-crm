
import { Router } from "express";
import { getCustomers, createCustomer, getSingleCustomer, sendTokenResetPassword, resetPassword, updateSingleCustomer, deleteSingleCustomer } from "../controllers/customerController";

const router = Router();

router.get("/", getCustomers);
router.post("/:institution/sendTokenResetPassword", sendTokenResetPassword);
router.post("/:institution/resetPassword", resetPassword);
router.post("/", createCustomer);
router.get("/:id", getSingleCustomer);
router.put("/:id", updateSingleCustomer)
router.delete("/:id", deleteSingleCustomer)
export default router;