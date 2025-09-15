import { Router } from "express";
import { createProduct, getProducts, getSingleProduct, importProducts, updateSingleProduct, deleteProduct } from "../controllers/productController";
//const authorize = require("../authorize");
import authorize from "../authorize";

const router = Router();

router.get("/institutions/:institution/products", ...authorize("readAll-product"), getProducts);
router.post("/institutions/:institution/products", ...authorize("create-product"), createProduct);
router.get("/institutions/:id", ...authorize("view-product"), getSingleProduct);
router.post("/institutions/:institution/products/import", ...authorize("import-product"), importProducts);
router.put("/:id", ...authorize("update-singleProduct"), updateSingleProduct);
router.delete("/:id", ...authorize("delete-product"), deleteProduct)

export default router;