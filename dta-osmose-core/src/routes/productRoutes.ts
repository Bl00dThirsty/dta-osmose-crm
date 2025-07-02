import { Router } from "express";
import { createProduct, getProducts, getSingleProduct, importProducts } from "../controllers/productController";
//const authorize = require("../authorize");
import authorize from "../authorize";

const router = Router();

router.get("/institutions/:institution/products", getProducts);
router.post("/institutions/:institution/products", ...authorize("create-product"), createProduct);
router.get("/institutions/:id", getSingleProduct);
router.post("/institutions/:institution/products/import", importProducts);

export default router;