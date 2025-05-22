import { Request, Response } from "express";
const { PrismaClient } = require("@prisma/client");

const prisma = new PrismaClient();

export const getDashboardMetrics = async (
    req: Request,
    res: Response
  ): Promise<void> => {
    try {
        const popularProducts = await prisma.product.findMany({
            take: 10,
            orderBy: {
              quantity: "desc",
            },
          });
          res.json({
            popularProducts,
          });
    } catch (error) {
        res.status(500).json({message: "Erreur lors du chargement des données du dashboard"})
    }
  }