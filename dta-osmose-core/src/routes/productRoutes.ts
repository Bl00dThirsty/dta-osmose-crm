import { Router } from "express";
import { createProduct, getProducts, getSingleProduct } from "../controllers/productController";
//const authorize = require("../authorize");
import authorize from "../authorize";

const router = Router();

router.get("/institutions/:institution/products", getProducts);
router.post("/institutions/:institution/products", ...authorize("create-product"), createProduct);
router.get("/institutions/:id", getSingleProduct);

export default router;


