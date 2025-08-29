import { Router } from "express";
import {getSalePromise, createSalePromise, getSalePromiseById, getSalePromiseByCustomer, deleteSalePromise } from "../controllers/promiseSaleConroller";
//const authorize = require("../authorize");
import authorize from "../authorize";

const router = Router();

router.get("/:institution/all", getSalePromise);
router.get("/:id", getSalePromiseById);
router.get("/customer", ...authorize("view-product"), getSalePromiseByCustomer);
router.post("/:institution/promiseSale", ...authorize("create-product"), createSalePromise);
router.delete("/:id", deleteSalePromise);

export default router;