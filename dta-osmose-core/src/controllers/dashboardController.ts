import { Request, Response } from "express";
const { PrismaClient } = require("@prisma/client");

const prisma = new PrismaClient();

export const getDashboardMetrics = async (
    req: Request,
    res: Response
  ): Promise<void> => {
    
    try {
      const { startDate, endDate } = req.query;
      // Version optimisée dans dashboardController.ts
      const institutionSlug = req.params.institution;
      const institution = await prisma.institution.findUnique({
        where: { slug: institutionSlug },
      });
      //graphe vente par villes
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
      //Total vente, montant total, total profit
      let newStatus = 'PAID';
      const allSaleInvoice = await prisma.saleInvoice.groupBy({
        orderBy: {
          createdAt: "asc"
        },
        by: ["createdAt"],
        where: {
          delivred: true,
          paymentStatus: newStatus,
          institutionId: institution.id,
          createdAt: {
            gte: startDate ? new Date(startDate as string) : undefined,
            lte: endDate ? new Date(endDate as string) : undefined,
          },
        },
        _sum: {
          paidAmount: true,
          finalAmount: true,
          profit: true
        },
      });

      const formattedData1 = allSaleInvoice.map((item:any) => {
        return {
          type: "Ventes",
          date: item.createdAt.toISOString().split("T")[0],
          amount: item._sum.paidAmount
        };
      });
      const formattedData2 = allSaleInvoice.map((item:any) => {
        return {
          type: "Profits",
          date: item.createdAt.toISOString().split("T")[0],
          amount: item._sum.profit
        };
      });
      // const formattedData3 = allSaleInvoice.map((item:any) => {
      //   return {
      //     type: "nombre de facture",
      //     date: item.createdAt.toISOString().split("T")[0],
      //     amount: item._count.id
      //   };
      // });

      const saleProfitCount = formattedData1
      .concat(formattedData2);

      //Total des SaleInvoice
      const TotalSaleInvoice = await prisma.saleInvoice.groupBy({
        orderBy: {
          createdAt: "asc"
        },
        by: ["createdAt"],
        where: {
          delivred: true,
          //paymentStatus: newStatus,
          institutionId: institution.id,
          createdAt: {
            gte: startDate ? new Date(startDate as string) : undefined,
            lte: endDate ? new Date(endDate as string) : undefined,
          },
        },
        _count: {
          id: true
        }
      });

      const formattedData3 = TotalSaleInvoice.map((item:any) => {
        return {
          type: "nombre de facture",
          date: item.createdAt.toISOString().split("T")[0],
          amount: item._count.id
        };
      });

      //Total des utilisateurs enregistrers
      const totalUsers = await prisma.user.count();

      //total des credit
      const totalCredits = await prisma.credit.aggregate({
        where: {
          customer: {
            saleInvoice: {
              some: {
                institutionId: institution.id
              }
            }
          }
        },
        _sum: {
          amount: true,
          usedAmount: true
        }
      });
      
      const totalAvailableCredit = (totalCredits._sum.amount || 0) - (totalCredits._sum.usedAmount || 0);

      let customerStats = null;
      
      if (req.auth?.role === "Particulier") {
        const customerId = Number(req.auth.sub);
        console.log("cus", customerId);
        // Récupère toutes ses commandes
        const commandes = await prisma.saleInvoice.findMany({
          where: { customerId },
        });
        let newStatus = 'PAID';
        const commandespaye = await prisma.saleInvoice.findMany({
          where: { customerId,
            paymentStatus: newStatus,
           },
        });
        const totalAchats = commandes.reduce((acc:any, cmd:any) => acc + cmd.finalAmount, 0);
        const nombreCommandes = commandes.length;
        const nombreCommandespaye = commandespaye.length;
        const nombreCommandesImpaye = nombreCommandes - nombreCommandespaye;
      
        const credit = await prisma.credit.aggregate({
          where: {
            customerId
          },
          _sum: {
            amount: true,
            usedAmount: true
          }
        });
      
        const avoirDisponible = (credit._sum.amount || 0) - (credit._sum.usedAmount || 0);
      
        customerStats = {
          totalAchats,
          nombreCommandes,
          avoirDisponible,
          nombreCommandesImpaye
        };
      }
          
      res.json({
            popularProducts,
            salesByCity: chartData,
            saleProfitCount,
            formattedData3,
            totalUsers,
            totalAvailableCredit,
            customerStats,
      });
    } catch (error) {
      console.error('Dashboard error:', error);
      res.status(500).json({message: "Erreur lors du chargement des données du dashboard"})
    }
  }