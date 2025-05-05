import { Router } from "express";
import { createProduct, getProducts } from "../controllers/productController";
const authorize = require("../authorize");

const router = Router();

router.get("/", authorize("view-product"), getProducts);
router.post("/", authorize("create-product"), createProduct);

export default router;
