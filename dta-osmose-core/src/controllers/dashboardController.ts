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

      const allSaleInvoice = await prisma.saleInvoice.groupBy({
        orderBy: {
          createdAt: "asc"
        },
        by: ["createdAt"],
        where: {
          delivred: true
        },
        _sum: {
          totalAmount: true,
          finalAmount: true,
          profit: true
        },
        _count: {
          id: true
        }
      });

      const formattedData1 = allSaleInvoice.map((item:any) => {
        return {
          type: "Ventes",
          date: item.date.toISOString().split("T")[0],
          amount: item._sum.finalAmount
        };
      });
      const formattedData2 = allSaleInvoice.map((item:any) => {
        return {
          type: "Profits",
          date: item.date.toISOString().split("T")[0],
          amount: item._sum.profit
        };
      });
      const formattedData3 = allSaleInvoice.map((item:any) => {
        return {
          type: "nombre de facture",
          date: item.date.toISOString().split("T")[0],
          amount: item._count.id
        };
      });

      const saleProfitCount = formattedData1
      .concat(formattedData2)
      .concat(formattedData3);
          
      res.json({
            popularProducts,
            salesByCity: chartData,
            saleProfitCount
      });
    } catch (error) {
      console.error('Dashboard error:', error);
      res.status(500).json({message: "Erreur lors du chargement des données du dashboard"})
    }
  }