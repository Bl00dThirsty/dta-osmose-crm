"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const productController_1 = require("../controllers/productController");
//const authorize = require("../authorize");
const authorize_1 = __importDefault(require("../authorize"));
const router = (0, express_1.Router)();
router.get("/", ...(0, authorize_1.default)("view-product"), productController_1.getProducts);
router.post("/", ...(0, authorize_1.default)("create-product"), productController_1.createProduct);
exports.default = router;
