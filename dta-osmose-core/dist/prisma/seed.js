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
const { PrismaClient } = require("@prisma/client");
const fs_1 = __importDefault(require("fs"));
const path_1 = __importDefault(require("path"));
const bcrypt = require("bcrypt");
require("dotenv").config();
const prisma = new PrismaClient();
const saltRounds = 10;
function deleteAllData(orderedFileNames) {
    return __awaiter(this, void 0, void 0, function* () {
        const modelNames = orderedFileNames.map((fileName) => {
            const modelName = path_1.default.basename(fileName, path_1.default.extname(fileName));
            return modelName.charAt(0) + modelName.slice(1);
        });
        for (const modelName of modelNames) {
            const model = prisma[modelName];
            if (model) {
                yield model.deleteMany({});
                console.log(`Cleared data from ${modelName}`);
            }
            else {
                console.error(`Model ${modelName} not found. Please ensure the model name is correctly specified.`);
            }
        }
    });
}
// async function seedUsers() {
//   const authFilePath = path.join(__dirname, "seedData", "auth.json");
//   const rawData = fs.readFileSync(authFilePath, "utf-8");
//   const users = JSON.parse(rawData);
//   for (const user of users) {
//     if (user.password) {
//       user.password = await bcrypt.hash(user.password, saltRounds);
//     }
//     // Créer utilisateur (ex: dans la table `user`)
//     await prisma.user.deleteMany({});
//     await prisma.user.create({
//       data: {
//         ...user,
//       },
//     });
//     console.log(`Seeded user: ${user.email}`);
//   }
// }
const permissions = [
    "create-product",
    "view-product",
    "create-user",
];
const roles = ["admin", "staff", "manager", "Particulier"];
const adminPermissions = [...permissions];
const staffPermissions = [...permissions];
const managerPermissions = [
    "view-product",
];
const particularPermissions = [...managerPermissions];
const rolePermissionsMap = {
    admin: adminPermissions,
    staff: staffPermissions,
    manager: managerPermissions,
    Particulier: particularPermissions
};
function createPermissions() {
    return __awaiter(this, void 0, void 0, function* () {
        for (const name of permissions
            .concat(managerPermissions)
            .concat(particularPermissions)) {
            const exists = yield prisma.permission.findUnique({ where: { name } });
            if (!exists) {
                yield prisma.permission.create({ data: { name } });
            }
        }
    });
}
function createRoles() {
    return __awaiter(this, void 0, void 0, function* () {
        for (const roleName of roles) {
            const exists = yield prisma.role.findUnique({ where: { name: roleName } });
            if (!exists) {
                yield prisma.role.create({ data: { name: roleName } });
            }
        }
    });
}
function assignRolePermissions() {
    return __awaiter(this, void 0, void 0, function* () {
        for (const [roleName, perms] of Object.entries(rolePermissionsMap)) {
            const role = yield prisma.role.findUnique({ where: { name: roleName } });
            if (!role)
                continue;
            for (const permName of perms) {
                const permission = yield prisma.permission.findUnique({ where: { name: permName } });
                if (!permission)
                    continue;
                const exists = yield prisma.rolePermission.findUnique({
                    where: {
                        role_id_permission_id: {
                            role_id: role.id,
                            permission_id: permission.id
                        }
                    }
                });
                if (!exists) {
                    yield prisma.rolePermission.create({
                        data: {
                            role_id: role.id,
                            permission_id: permission.id
                        }
                    });
                }
            }
        }
    });
}
function createUsers() {
    return __awaiter(this, void 0, void 0, function* () {
        const users = [
            {
                userName: "admin",
                firstName: "admin",
                lastName: "admin",
                email: "admin@gmail.com",
                password: yield bcrypt.hash("admin", saltRounds),
                role: "admin",
            },
            {
                userName: "staff",
                firstName: "staff",
                lastName: "staff",
                email: "staff@gmail.com",
                password: yield bcrypt.hash("staff", saltRounds),
                role: "staff",
            },
            {
                userName: "manager",
                firstName: "manager",
                lastName: "manager",
                email: "manager@gmail.com",
                password: yield bcrypt.hash("manager", saltRounds),
                role: "manager",
            }
        ];
        for (const user of users) {
            const exists = yield prisma.user.findUnique({ where: { email: user.email } });
            if (!exists) {
                // Vérifie si le rôle existe
                const roleExists = yield prisma.role.findUnique({ where: { name: user.role } });
                if (!roleExists) {
                    console.warn(`Role "${user.role}" not found, skipping user "${user.email}"`);
                    continue;
                }
                yield prisma.user.create({ data: user });
                console.log(`User ${user.email} created with role ${user.role}`);
            }
        }
    });
}
function main() {
    return __awaiter(this, void 0, void 0, function* () {
        yield createPermissions();
        yield createRoles();
        yield assignRolePermissions();
        yield createUsers();
        const dataDirectory = path_1.default.join(__dirname, "seedData");
        const orderedFileNames = [
            "product.json",
            //"customer.json",
            // "expenseSummary.json",
            // "sales.json",
            // "salesSummary.json",
            // "purchases.json",
        ];
        yield deleteAllData(orderedFileNames);
        for (const fileName of orderedFileNames) {
            const filePath = path_1.default.join(dataDirectory, fileName);
            const jsonData = JSON.parse(fs_1.default.readFileSync(filePath, "utf-8"));
            const modelName = path_1.default.basename(fileName, path_1.default.extname(fileName));
            const model = prisma[modelName];
            if (!model) {
                console.error(`No Prisma model matches the file name: ${fileName}`);
                continue;
            }
            for (const data of jsonData) {
                yield model.create({
                    data,
                });
            }
            console.log(`Seeded ${modelName} with data from ${fileName}`);
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
