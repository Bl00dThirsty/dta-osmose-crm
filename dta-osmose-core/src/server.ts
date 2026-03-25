import express from 'express';
import cors from 'cors';
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
import promotionRoutes from "./routes/promotionRoute";
import PromiseSaleRoutes from "./routes/promiseSaleRoute";
import ReportRoutes from "./routes/reportRoutes"
import { startReminderScheduler } from "./utils/reminderScheduler";

export const prisma = new PrismaClient();

dotenv.config();
const app = express();

app.use(helmet());
app.use(helmet.crossOriginResourcePolicy({ policy: "cross-origin"}));
app.use(morgan("common"));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));
app.use(cors({
  origin: 'http://localhost:3000',
  credentials: true,
}));

app.use(express.json({ limit: '100mb' }));
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
app.use("/inventory", InventoryRoutes);
app.use("/promotions", promotionRoutes);
app.use("/salepromise", PromiseSaleRoutes);
app.use("/report",  ReportRoutes)

// Error handling middleware
app.use(errorHandler);

// Création du serveur HTTP principal pour Express
const server = http.createServer(app);

// Création d'un serveur HTTP séparé pour Socket.IO
const wsServer = http.createServer();

// Initialisation de Socket.IO sur le serveur séparé
initWebSocketServer(wsServer);

// Démarrer le reminder scheduler
startReminderScheduler();

// Ports différents
const HTTP_PORT = process.env.PORT || 4000;
const WS_PORT = process.env.WS_PORT || 4001;

// Démarrer le serveur HTTP principal (Express)
server.listen(HTTP_PORT, () => {
  console.log(`🚀 HTTP Server running on port ${HTTP_PORT}`);
});

// Démarrer le serveur WebSocket séparé
wsServer.listen(WS_PORT, () => {
  console.log(`🔌 WebSocket Server running on port ${WS_PORT}`);
});

// Gestion propre de l'arrêt
process.on('SIGTERM', () => {
  console.log('SIGTERM signal received: closing HTTP server');
  server.close(() => {
    console.log('HTTP server closed');
  });
  wsServer.close(() => {
    console.log('WebSocket server closed');
  });
});