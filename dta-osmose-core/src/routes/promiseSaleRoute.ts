import { Router } from "express";
import {getSalePromise, createSalePromise, getSalePromiseById, getSalePromiseByCustomer, deleteSalePromise } from "../controllers/promiseSaleConroller";
//const authorize = require("../authorize");
import authorize from "../authorize";

const router = Router();

router.post("/:institution/promiseSale", ...authorize("create-promiseSale"), createSalePromise);
router.get("/:institution/all", ...authorize("readAll-promiseSale"), getSalePromise);
router.get("/customer", ...authorize("readAll-salePromiseBycustomer"), getSalePromiseByCustomer);
router.get("/:id", ...authorize("view-promiseSale"), getSalePromiseById);
router.delete("/:id", ...authorize("delete-salePromise"), deleteSalePromise);

export default router;