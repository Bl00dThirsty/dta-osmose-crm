
import { Router } from "express";
import { getCustomers, createCustomer, getSingleCustomer } from "../controllers/customerController";

const router = Router();

router.get("/", getCustomers);
router.post("/", createCustomer);
router.get("/:id", getSingleCustomer);

export default router;