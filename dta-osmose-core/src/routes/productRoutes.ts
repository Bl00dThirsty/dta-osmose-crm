import { Router } from "express";
import { createProduct, getProducts } from "../controllers/productController";
//const authorize = require("../authorize");
import authorize from "../authorize";

const router = Router();

router.get("/institutions/:institution/products", getProducts);
router.post("/institutions/:institution/products", ...authorize("create-product"), createProduct);

export default router;


