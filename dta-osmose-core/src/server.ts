import express from 'express';
import cors from 'cors';
import bodyParser from 'body-parser';
import dotenv from "dotenv";
import helmet from "helmet";
import morgan from "morgan";
import cookieParser from 'cookie-parser';
const { PrismaClient } = require("@prisma/client");
import { errorHandler } from '../src/error/errorHandler';
import dashboardRoutes from './routes/dashboardRoutes';
import productRoutes from './routes/productRoutes';
import AuthRoutes from './routes/AuthRoutes';
import roleRoutes from './routes/roleRoutes';
import permissionRoutes from './routes/permissionRoutes';
import rolePermissionRoutes from './routes/rolePermissionRoute';
import departmentRoutes from './routes/department.Routes';
import designationRoute from './routes/designationRoutes';
import userRoutes from './routes/userRoutes'

export const prisma = new PrismaClient();

dotenv.config();
const app = express();
app.use(helmet());
app.use(helmet.crossOriginResourcePolicy({ policy: "cross-origin"}));
app.use(morgan("common"));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));
// Middleware
//app.use(cors());
app.use(cors({
  origin: ['http://localhost:3000'], // <-- autorise le frontend Next.js local
  credentials: true, // <-- permet l'envoi des cookies (token de session, etc.)
}));

app.use(express.json());
app.use(cookieParser());

/* ROUTES */
app.use("/dashboard", dashboardRoutes);
app.use("/products", productRoutes);
app.use("/auth", AuthRoutes);
app.use("/role", roleRoutes);
app.use("/permission", permissionRoutes);
app.use("/role-permission", rolePermissionRoutes);
app.use("/department", departmentRoutes);
app.use("/designation", designationRoute);
app.use("/user", userRoutes)

// Error handling middleware
app.use(errorHandler);

const PORT = process.env.PORT || 4000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
