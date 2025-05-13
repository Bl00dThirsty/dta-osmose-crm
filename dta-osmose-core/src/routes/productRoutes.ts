import { Router } from "express";
import { createProduct, getProducts } from "../controllers/productController";

const router = Router();

router.get("/institutions/:institution/products", getProducts);
router.post("/institutions/:institution/products", createProduct);

export default router;
