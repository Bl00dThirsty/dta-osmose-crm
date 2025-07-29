import { Request, Response } from "express";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

const generateChartData = async (
  startDate: Date,
  endDate: Date,
  institutionId: string
) => {

   console.log("🔍 Génération des données du graphique...");
  console.log("📅 Plage de dates :", { startDate, endDate });
  console.log("🏫 Institution ID :", institutionId);

  // 1. Récupérer toutes les ventes pertinentes
  const rawSales = await prisma.saleInvoice.findMany({
    where: {
      institutionId,
      delivred: true,
      paymentStatus: "PAID",
      createdAt: {
        gte: startDate,
        lte: endDate,
      },
    },
    select: {
      createdAt: true,
      finalAmount: true,
    },
  });

  console.log("📦 Ventes récupérées depuis la base :", rawSales.length);
  console.log("🧾 Aperçu des ventes :", rawSales.slice(0, 5)); // Affiche les 5 premières


  // 2. Regrouper les ventes par date (au format yyyy-mm-dd)
  const grouped: Record<
    string,
    { count: number; amount: number }
  > = {};

  for (const sale of rawSales) {
    const date = sale.createdAt.toISOString().split("T")[0];
    if (!grouped[date]) {
      grouped[date] = { count: 0, amount: 0 };
    }
    grouped[date].count += 1;
    grouped[date].amount += sale.finalAmount;
  }


   console.log("📊 Données groupées par date :", grouped);
  // 3. Générer la liste complète des jours entre startDate et endDate
  const data: {
    date: string;
    "Nombre vente": number;
    "Montant vente": number;
  }[] = [];

  const currentDate = new Date(startDate);

  while (currentDate <= endDate) {
    const formattedDate = currentDate.toISOString().split("T")[0];
    const entry = grouped[formattedDate] || { count: 0, amount: 0 };

    data.push({
      date: formattedDate,
      "Nombre vente": entry.count,
      "Montant vente": entry.amount,
    });

    currentDate.setDate(currentDate.getDate() + 1);
  }

  console.log("📈 Données finales prêtes pour le graphique :", data);
  

  return data;
};


export const getDashboardMetrics = async (req: Request, res: Response): Promise<void> => {
  try {
    const { startDate, endDate } = req.query;
    const institutionSlug = req.params.institution;

    if (
      !startDate ||
      !endDate ||
      typeof startDate !== "string" ||
      typeof endDate !== "string"
    ) {
      res.status(400).json({ error: "Invalid or missing startDate or endDate" });
      return;
    }

    const start = new Date(startDate);
    const end = new Date(endDate);

    if (isNaN(start.getTime()) || isNaN(end.getTime())) {
      res.status(400).json({ error: "Invalid date format" });
      return;
    }

    if (start > end) {
      res.status(400).json({ error: "startDate cannot be after endDate" });
      return;
    }

    const institution = await prisma.institution.findUnique({
      where: { slug: institutionSlug },
    });

    if (!institution) {
      res.status(404).json({ error: "Institution not found" });
      return;
    }

    const chartData = await generateChartData(start, end, institution.id);

    const popularProducts = await prisma.product.findMany({
      take: 10,
      orderBy: { quantity: "desc" },
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
            some: { institutionId: institution.id },
          },
        },
      },
      _sum: {
        amount: true,
        usedAmount: true,
      },
    });

    

    const totalAvailableCredit =
      (totalCredits._sum.amount ?? 0) - (totalCredits._sum.usedAmount ?? 0);

    let customerStats = null;

    if (req.auth?.role === "Particulier") {
      const customerId = Number(req.auth.sub);
      const commandes = await prisma.saleInvoice.findMany({ where: { customerId } });

      const commandespaye = await prisma.saleInvoice.findMany({
        where: { customerId, paymentStatus: "PAID" },
      });

      const totalAchats = commandes.reduce((acc, cmd) => acc + (cmd.finalAmount || 0), 0);
      const nombreCommandes = commandes.length;
      const nombreCommandespaye = commandespaye.length;
      const nombreCommandesImpaye = nombreCommandes - nombreCommandespaye;

      const credit = await prisma.credit.aggregate({
        where: { customerId },
        _sum: { amount: true, usedAmount: true },
      });

      const avoirDisponible = (credit._sum.amount || 0) - (credit._sum.usedAmount || 0);

      customerStats = {
        totalAchats,
        nombreCommandes,
        avoirDisponible,
        nombreCommandesImpaye,
      };
    }

    res.setHeader("Content-Type", "application/json");
    res.json({
      chartData,
      saleProfitCount,
      formattedData3,
      popularProducts,
      totalUsers,
      totalAvailableCredit,
      customerStats,
    });
  } catch (error) {
    console.error("Dashboard error:", error);
    res.status(500).json({ error: "Erreur lors du chargement des données du dashboard" });
  }
};