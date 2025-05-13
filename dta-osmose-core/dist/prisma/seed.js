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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const client_1 = require("@prisma/client");
const fs_1 = __importDefault(require("fs"));
const path_1 = __importDefault(require("path"));
const prisma = new client_1.PrismaClient();
function deleteAllData() {
    return __awaiter(this, void 0, void 0, function* () {
        yield prisma.product.deleteMany({});
        yield prisma.institution.deleteMany({});
        console.log("Toutes les données ont été supprimées.");
    });
}
function main() {
    return __awaiter(this, void 0, void 0, function* () {
        yield deleteAllData();
        // Création manuelle des institutions
        const iba = yield prisma.institution.create({
            data: {
                id: "iba",
                name: "IBA",
            },
        });
        const asermpharma = yield prisma.institution.create({
            data: {
                id: "asermpharma",
                name: "Asermpharma",
            },
        });
        console.log("Institutions créées.");
        const dataDirectory = path_1.default.join(__dirname, "seedData");
        const productsPath = path_1.default.join(dataDirectory, "product.json");
        if (fs_1.default.existsSync(productsPath)) {
            const jsonData = JSON.parse(fs_1.default.readFileSync(productsPath, "utf-8"));
            for (const data of jsonData) {
                yield prisma.product.create({
                    data: Object.assign(Object.assign({}, data), { institution: iba.id }),
                });
            }
            console.log("Produits importés.");
        }
        else {
            console.error("Fichier product.json introuvable.");
        }
    });
}
main()
    .catch((e) => {
    console.error(e);
})
    .finally(() => __awaiter(void 0, void 0, void 0, function* () {
    yield prisma.$disconnect();
}));
