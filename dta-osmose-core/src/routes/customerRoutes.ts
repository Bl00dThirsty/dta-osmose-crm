
import { Router } from "express";
<<<<<<< HEAD
//import { getCustomers, createCustomer } from "../controllers/customerController";

const router = Router();

//router.get("/", getCustomers);
//router.post("/", createCustomer);
=======
import { getCustomers, createCustomer, getSingleCustomer } from "../controllers/customerController";

const router = Router();

router.get("/", getCustomers);
router.post("/", createCustomer);
router.get("/:id", getSingleCustomer);
>>>>>>> origin/yvana

export default router;