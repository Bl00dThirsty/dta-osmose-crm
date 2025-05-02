"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.createProduct = exports.getProducts = void 0;
const client_1 = require("@prisma/client");
const uuid_1 = require("uuid");
const prisma = new client_1.PrismaClient();
const getProducts = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a, _b;
    try {
        const search = (_a = req.query.search) === null || _a === void 0 ? void 0 : _a.toString();
        const institution = (_b = req.query.institution) === null || _b === void 0 ? void 0 : _b.toString();
        if (!institution) {
            res.status(400).json({ message: "Institution manquante." });
            return;
        }
        const products = yield prisma.product.findMany({
            where: Object.assign({ institution }, (search && {
                name: {
                    contains: search,
                    mode: "insensitive",
                },
            })),
        });
        res.json(products);
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ message: "Erreur lors de la recherche du produit" });
    }
});
exports.getProducts = getProducts;
const createProduct = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { quantity, EANCode, brand, designation, restockingThreshold, warehouse, sellingPriceTTC, purchase_price, institution, } = req.body;
        if (!institution) {
            res.status(400).json({ message: "Institution manquante." });
            return;
        }
        const product = yield prisma.product.create({
            data: {
                id: (0, uuid_1.v4)(),
                quantity,
                EANCode,
                brand,
                designation,
                restockingThreshold,
                warehouse,
                sellingPriceTTC,
                purchase_price,
                institution,
            },
        });
        res.status(201).json(product);
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ message: "Erreur lors de la création du produit." });
    }
});
exports.createProduct = createProduct;
