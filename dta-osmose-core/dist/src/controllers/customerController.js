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
exports.getSingleCustomer = exports.createCustomer = exports.getCustomers = void 0;
const { PrismaClient } = require("@prisma/client");
const uuid_1 = require("uuid");
const prisma = new PrismaClient();
const getCustomers = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    try {
        const search = (_a = req.query.search) === null || _a === void 0 ? void 0 : _a.toString();
        const customers = yield prisma.customer.findMany({
            where: {
                name: {
                    contains: search,
                },
            },
        });
        res.json(customers);
    }
    catch (error) {
        res.status(500).json({ message: "Erreur lors de la recherche du produit" });
    }
});
exports.getCustomers = getCustomers;
const createCustomer = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { customId, name, phone, nameresponsable, email, ville, website, status, type_customer, role, quarter, region } = req.body;
        const customer = yield prisma.customer.create({
            data: {
                id: (0, uuid_1.v4)(),
                customId,
                name,
                phone,
                nameresponsable,
                email,
                ville,
                website,
                status,
                type_customer,
                role,
                quarter,
                region
            },
        });
        res.status(201).json(customer);
    }
    catch (error) {
        res.status(500).json({});
    }
});
exports.createCustomer = createCustomer;
const getSingleCustomer = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const id = parseInt(req.params.id);
        if (isNaN(id)) {
            res.status(400).json({ message: "ID invalide" });
            return;
        }
        const singlecustomer = yield prisma.customer.findUnique({
            where: { id },
        });
        if (!singlecustomer) {
            res.status(404).json({ message: "client non trouvé" });
            return;
        }
    }
    catch (error) {
        console.error("Erreur lors de la récupération du client :", error);
        res.status(500).json({ message: "Erreur serveur" });
    }
});
exports.getSingleCustomer = getSingleCustomer;
