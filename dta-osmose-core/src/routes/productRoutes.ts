import { Router } from "express";
import { createProduct, getProducts, getSingleProduct, importProducts, updateSingleProduct, deleteProduct } from "../controllers/productController";
//const authorize = require("../authorize");
import authorize from "../authorize";

const router = Router();

router.get("/institutions/:institution/products", getProducts);
router.post("/institutions/:institution/products", ...authorize("create-product"), createProduct);
router.get("/institutions/:institution/products/:id", getSingleProduct);
router.post("/institutions/:institution/products/import", importProducts);
/*router.put("/:id", updateSingleProduct);
router.delete("/:id", deleteProduct)*/
router.put("/institutions/:institution/products/:id", updateSingleProduct);
router.delete("/institutions/:institution/products/:id", deleteProduct);

export default router;