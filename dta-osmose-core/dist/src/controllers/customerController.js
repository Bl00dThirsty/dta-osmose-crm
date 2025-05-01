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
exports.createCustomer = exports.getCustomers = void 0;
const client_1 = require("@prisma/client");
const uuid_1 = require("uuid");
const prisma = new client_1.PrismaClient();
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
        res.status(500).json({ message: "Erreur lors de la recherche de l'utilisateur" });
    }
});
exports.getCustomers = getCustomers;
const createCustomer = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { name, phone, ville, region, nameresponsable, email, website, status, type_customer } = req.body;
        const now = new Date();
        const month = now.getMonth() + 1;
        const year = now.getFullYear();
        const newCustomer = yield prisma.$transaction((tx) => __awaiter(void 0, void 0, void 0, function* () {
            let counter = yield tx.customerCounter.findUnique({
                where: {
                    month_year: {
                        month,
                        year,
                    },
                },
            });
            if (!counter) {
                counter = yield tx.customerCounter.create({
                    data: {
                        month,
                        year,
                        count: 1,
                    },
                });
            }
            else {
                counter = yield tx.customerCounter.update({
                    where: {
                        month_year: {
                            month,
                            year,
                        },
                    },
                    data: {
                        count: {
                            increment: 1,
                        },
                    },
                });
            }
            const counterStr = String(counter.count).padStart(3, '0');
            const monthStr = String(month).padStart(2, '0');
            const customId = `CLIENT-${counterStr}${monthStr}${year}`;
            const customer = yield tx.customer.create({
                data: {
                    id: (0, uuid_1.v4)(),
                    customId,
                    name,
                    phone,
                    ville,
                    region,
                    nameresponsable,
                    email,
                    website,
                    status,
                    type_customer,
                },
            });
            return customer;
        }));
        res.status(201).json(newCustomer);
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Erreur lors de la création du client' });
    }
});
exports.createCustomer = createCustomer;
