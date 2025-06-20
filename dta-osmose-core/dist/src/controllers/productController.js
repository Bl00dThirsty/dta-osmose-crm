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
exports.getSingleProduct = exports.importProducts = exports.createProduct = exports.getProducts = void 0;
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
const importProducts = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const institutionSlug = req.params.institution;
        const products = req.body;
        if (!Array.isArray(products) || products.length === 0) {
            res.status(400).json({ message: "Aucune donnée reçue." });
            return;
        }
        const institution = yield prisma.institution.findUnique({
            where: { slug: institutionSlug },
        });
        if (!institution) {
            res.status(404).json({ message: "Institution introuvable." });
            return;
        }
        const createdProducts = [];
        for (const row of products) {
            if (!row.EANCode)
                continue;
            const existing = yield prisma.product.findUnique({
                where: { EANCode: row.EANCode },
            });
            if (existing)
                continue;
            const product = yield prisma.product.create({
                data: {
                    id: (0, uuid_1.v4)(),
                    EANCode: row.EANCode,
                    brand: row.brand,
                    designation: row.designation,
                    quantity: Number(row.quantity) || 0,
                    purchase_price: Number(row.purchase_price) || 0,
                    sellingPriceTTC: Number(row.sellingPriceTTC) || 0,
                    restockingThreshold: Number(row.restockingThreshold) || 0,
                    warehouse: row.warehouse,
                    institution: {
                        connect: { id: institution.id },
                    },
                },
            });
            createdProducts.push(product);
        }
        res.status(201).json({ message: `${createdProducts.length} produits importés.` });
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ message: "Erreur lors de l'import." });
    }
});
exports.importProducts = importProducts;
const getSingleProduct = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id } = req.params;
        if (!id) {
            res.status(400).json({ message: "ID du produit manquant." });
            return;
        }
        const product = yield prisma.product.findUnique({
            where: { id },
        });
        if (!product) {
            res.status(404).json({ message: "Produit non trouvé." });
            return;
        }
        res.status(200).json(product);
    }
    catch (error) {
        console.error("Erreur lors de la récupération du produit :", error);
        res.status(500).json({ message: "Erreur serveur" });
    }
});
exports.getSingleProduct = getSingleProduct;
