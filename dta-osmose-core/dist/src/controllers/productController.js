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
const { PrismaClient } = require("@prisma/client");
const uuid_1 = require("uuid");
const prisma = new PrismaClient();
const getProducts = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    try {
        const search = (_a = req.query.search) === null || _a === void 0 ? void 0 : _a.toString();
        const institutionSlug = req.params.institution;
        if (!institutionSlug) {
            res.status(400).json({ message: "Institution manquante." });
            return;
        }
        // Étape 1 : Chercher l'institution à partir du slug
        const institution = yield prisma.institution.findUnique({
            where: { slug: institutionSlug },
        });
        if (!institution) {
            res.status(404).json({ message: "Institution introuvable." });
            return;
        }
        const products = yield prisma.product.findMany({
            where: Object.assign({ institutionId: institution.id }, (search && {
                designation: {
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
        const institutionSlug = req.params.institution;
        const { quantity, EANCode, brand, designation, restockingThreshold, warehouse, sellingPriceTTC, purchase_price, } = req.body;
        if (!institutionSlug) {
            res.status(400).json({ message: "Institution manquante dans l'URL." });
            return;
        }
        // 🔍 Chercher l'institution à partir du slug
        const institution = yield prisma.institution.findUnique({
            where: { slug: institutionSlug },
        });
        if (!institution) {
            res.status(404).json({ message: "Institution introuvable." });
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
                institution: {
                    connect: { id: institution.id },
                },
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
