import { Request, Response } from "express";
const { PrismaClient } = require("@prisma/client");

const prisma = new PrismaClient();

export const getDashboardMetrics = async (
    req: Request,
    res: Response
  ): Promise<void> => {
    try {
      // Version optimisée dans dashboardController.ts
      const sales = await prisma.saleInvoice.findMany({
        where: {
          customer: {
            ville: {
              not: null,
            },
          },
        },
        include: {
          customer: true,
        },
      });
      
      const salesByCityMap: Record<string, { montant: number; nombreVentes: number }> = {};
      
      for (const sale of sales) {
        const ville = sale.customer.ville;
      
        if (!salesByCityMap[ville]) {
          salesByCityMap[ville] = {
            montant: 0,
            nombreVentes: 0,
          };
        }
      
        salesByCityMap[ville].montant += sale.finalAmount;
        salesByCityMap[ville].nombreVentes += 1;
      }
      
      const chartData = Object.entries(salesByCityMap).map(([ville, data]) => ({
        ville,
        ...data,
      }));
      
  
        const popularProducts = await prisma.product.findMany({
            take: 10,
            orderBy: {
              quantity: "desc",
            },
          });
          res.json({
            popularProducts,
            salesByCity: chartData
          });
    } catch (error) {
      console.error('Dashboard error:', error);
      res.status(500).json({message: "Erreur lors du chargement des données du dashboard"})
    }
  }