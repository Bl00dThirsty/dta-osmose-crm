"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.prisma = void 0;
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const body_parser_1 = __importDefault(require("body-parser"));
const dotenv_1 = __importDefault(require("dotenv"));
const helmet_1 = __importDefault(require("helmet"));
const morgan_1 = __importDefault(require("morgan"));
const cookie_parser_1 = __importDefault(require("cookie-parser"));
const { PrismaClient } = require("@prisma/client");
const errorHandler_1 = require("../src/error/errorHandler");
const dashboardRoutes_1 = __importDefault(require("./routes/dashboardRoutes"));
const productRoutes_1 = __importDefault(require("./routes/productRoutes"));
const AuthRoutes_1 = __importDefault(require("./routes/AuthRoutes"));
const roleRoutes_1 = __importDefault(require("./routes/roleRoutes"));
const permissionRoutes_1 = __importDefault(require("./routes/permissionRoutes"));
const rolePermissionRoute_1 = __importDefault(require("./routes/rolePermissionRoute"));
const department_Routes_1 = __importDefault(require("./routes/department.Routes"));
const designationRoutes_1 = __importDefault(require("./routes/designationRoutes"));
const userRoutes_1 = __importDefault(require("./routes/userRoutes"));
exports.prisma = new PrismaClient();
dotenv_1.default.config();
const app = (0, express_1.default)();
app.use((0, helmet_1.default)());
app.use(helmet_1.default.crossOriginResourcePolicy({ policy: "cross-origin" }));
app.use((0, morgan_1.default)("common"));
app.use(body_parser_1.default.json());
app.use(body_parser_1.default.urlencoded({ extended: false }));
// Middleware
//app.use(cors());
app.use((0, cors_1.default)({
    origin: ['http://localhost:3000'], // <-- autorise le frontend Next.js local
    credentials: true, // <-- permet l'envoi des cookies (token de session, etc.)
}));
app.use(express_1.default.json());
app.use((0, cookie_parser_1.default)());
/* ROUTES */
app.use("/dashboard", dashboardRoutes_1.default);
app.use("/products", productRoutes_1.default);
app.use("/auth", AuthRoutes_1.default);
app.use("/role", roleRoutes_1.default);
app.use("/permission", permissionRoutes_1.default);
app.use("/role-permission", rolePermissionRoute_1.default);
app.use("/department", department_Routes_1.default);
app.use("/designation", designationRoutes_1.default);
app.use("/user", userRoutes_1.default);
// Error handling middleware
app.use(errorHandler_1.errorHandler);
const PORT = process.env.PORT || 4000;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
