import { Router } from "express";
import {getSalePromise, createSalePromise, getSalePromiseById, getSalePromiseByCustomer, deleteSalePromise } from "../controllers/promiseSaleConroller";
//const authorize = require("../authorize");
import authorize from "../authorize";

const router = Router();

router.post("/:institution/promiseSale", ...authorize("view-product"), createSalePromise);
router.get("/:institution/all", getSalePromise);
router.get("/customer", ...authorize("view-product"), getSalePromiseByCustomer);
router.get("/:id", getSalePromiseById);
router.delete("/:id", deleteSalePromise);

export default router;