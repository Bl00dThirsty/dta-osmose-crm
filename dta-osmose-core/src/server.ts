import express from 'express';
import cors from 'cors';
//import multer from "multer";
//import * as XLSX from "xlsx";
import fs from "fs";
import bodyParser from 'body-parser';
import dotenv from "dotenv";
import helmet from "helmet";
import morgan from "morgan";
import cookieParser from 'cookie-parser';
import http from "http";
import { initWebSocketServer } from "./websocketNotification";
const { PrismaClient } = require("@prisma/client");
import { errorHandler } from './error/errorHandler';
import dashboardRoutes from './routes/dashboardRoutes';
import productRoutes from './routes/productRoutes';
import AuthRoutes from './routes/AuthRoutes';
import roleRoutes from './routes/roleRoutes';
import permissionRoutes from './routes/permissionRoutes';
import rolePermissionRoutes from './routes/rolePermissionRoute';
import departmentRoutes from './routes/department.Routes';
import designationRoute from './routes/designationRoutes';
import userRoutes from './routes/userRoutes';
import customerRoutes from './routes/customerRoutes';
import saleRoutes from './routes/saleRoutes';
import settingRoutes from './routes/settingRoutes';
import claimRoutes from './routes/claimRoute';
import NotificationRoutes from './routes/notificationRoutes'
import InventoryRoutes from './routes/inventoryRoutes'

export const prisma = new PrismaClient();

dotenv.config();
const app = express();

//const upload = multer({ dest: "uploads/" });

app.use(helmet());
app.use(helmet.crossOriginResourcePolicy({ policy: "cross-origin"}));
app.use(morgan("common"));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));
// Middleware
//app.use(cors());
app.use(cors({
  origin: 'http://localhost:3000', // <-- autorise le frontend Next.js local
  credentials: true, // <-- permet l'envoi des cookies (token de session, etc.)
}));

//app.use(express.json());
app.use(express.json({ limit: '10mb' }));
app.use(cookieParser());

/* ROUTES */
app.use("/dashboard", dashboardRoutes);
app.use("/", productRoutes);
app.use("/customer", customerRoutes)
app.use("/auth", AuthRoutes);
app.use("/role", roleRoutes);
app.use("/permission", permissionRoutes);
app.use("/role-permission", rolePermissionRoutes);
app.use("/department", departmentRoutes);
app.use("/designation", designationRoute);
app.use("/user", userRoutes);
app.use("/sale", saleRoutes);
app.use("/setting", settingRoutes);
app.use("/claim", claimRoutes);
app.use("/notification", NotificationRoutes);
app.use("/inventory", InventoryRoutes)

// Error handling middleware
app.use(errorHandler);

const server = http.createServer(app);
initWebSocketServer(server);

const PORT = process.env.PORT || 4000;
server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});




// process.on("uncaughtException", (err) => {
//   console.error("❌ Erreur non interceptée:", err);
// });

// process.on("unhandledRejection", (reason, promise) => {
//   console.error("❌ Rejection non gérée:", reason);
// });


