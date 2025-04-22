import express from 'express';
import cors from 'cors';
import bodyParser from 'body-parser';
import dotenv from "dotenv";
import helmet from "helmet";
import morgan from "morgan";
import cookieParser from 'cookie-parser';
import { PrismaClient } from '@prisma/client';
import { errorHandler } from '../src/error/errorHandler';
import dashboardRoutes from './routes/dashboardRoutes';
import productRoutes from './routes/productRoutes';

export const prisma = new PrismaClient();

dotenv.config();
const app = express();
app.use(helmet());
app.use(helmet.crossOriginResourcePolicy({ policy: "cross-origin"}));
app.use(morgan("common"));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));
// Middleware
app.use(cors());
app.use(express.json());
app.use(cookieParser());

/* ROUTES */
app.use("/dashboard", dashboardRoutes);
app.use("/products", productRoutes)

// Error handling middleware
app.use(errorHandler);

const PORT = process.env.PORT || 4000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
