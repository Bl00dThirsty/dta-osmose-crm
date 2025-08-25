import { Request, Response } from "express";
import { PrismaClient } from "@prisma/client";
import { getDynamicTrend } from "../utils/trendUtils";
import { startOfMonth, endOfMonth, subMonths } from "date-fns";
import { count } from "console";

const prisma = new PrismaClient();

interface MonthlyMetrics {
  month: string;
  totalSales: number;
  totalProfit: number;
  invoiceCount: number;
}

interface MonthlyTrend {
  month: string;
  sales: number;
  salesTrend: string;
  profit: number;
  profitTrend: string;
  invoices: number;
  invoiceTrend: string;
}


export const getMonthlyTrends = async (institutionId: string, monthsBack = 6): Promise<MonthlyTrend[]> => {
  const monthlyData: MonthlyMetrics[] = [];

  for (let i = monthsBack; i >= 0; i--) {
    const monthDate = subMonths(new Date(), i);
    const start = startOfMonth(monthDate);
    const end = endOfMonth(monthDate);
    const key = start.toISOString().slice(0, 7);

    const sales = await prisma.saleInvoice.findMany({
      where: {
        institutionId,
        createdAt: { gte: start, lte: end },
      },
    });

    const totalSales = sales.reduce((sum, s) => sum + s.totalAmount, 0);
    const totalProfit = sales.reduce((sum, s: { profit: any }) => sum + s.profit, 0);
    const invoiceCount = sales.length;

    monthlyData.push({ month: key, totalSales, totalProfit, invoiceCount });
  }

  const trends: MonthlyTrend[] = [];
  for (let i = 1; i < monthlyData.length; i++) {
    const current = monthlyData[i];
    const previous = monthlyData[i - 1];

    trends.push({
      month: current.month,
      sales: current.totalSales,
      salesTrend: getDynamicTrend(current.totalSales, previous.totalSales).trend,
      profit: current.totalProfit,
      profitTrend: getDynamicTrend(current.totalProfit, previous.totalProfit).trend,
      invoices: current.invoiceCount,
      invoiceTrend: getDynamicTrend(current.invoiceCount, previous.invoiceCount).trend,
    });
  }

  return trends;
};

const generateChartData = async (startDate: Date, endDate: Date, institutionId: string) => {
  const rawSales = await prisma.saleInvoice.findMany({
    where: {
      institutionId,
      delivred: true,
      paymentStatus: "PAID",
      createdAt: { gte: startDate, lte: endDate },
    },
    select: { createdAt: true, finalAmount: true },
  });

  const grouped: Record<string, { count: number; amount: number }> = {};

  for (const sale of rawSales) {
    const date = sale.createdAt.toISOString().split("T")[0];
    if (!grouped[date]) grouped[date] = { count: 0, amount: 0 };
    grouped[date].count += 1;
    grouped[date].amount += sale.finalAmount;
  }

  const data: { date: string; "Nombre vente": number; "Montant vente": number }[] = [];
  const currentDate = new Date(startDate);

  while (currentDate <= endDate) {
    const formattedDate = currentDate.toISOString().split("T")[0];
    const entry = grouped[formattedDate] || { count: 0, amount: 0 };
    data.push({ date: formattedDate, "Nombre vente": entry.count, "Montant vente": entry.amount });
    currentDate.setDate(currentDate.getDate() + 1);
  }

  return data;
};

const getData = async (startDate: Date, endDate: Date) => {
  const allSaleInvoice = await prisma.saleInvoice.groupBy({
    orderBy: { createdAt: "asc" },
    by: ["createdAt"],
    where: {
      delivred: true,
      paymentStatus: "PAID",
      createdAt: { gte: startDate, lte: endDate },
    },
    _sum: { paidAmount: true, finalAmount: true, profit: true },
    _count: { id: true },
  });

  const formattedData1 = allSaleInvoice.map((item: any) => ({
    type: "Ventes",
    date: item.createdAt.toISOString().split("T")[0],
    amount: item._sum.paidAmount || 0,
  }));

  const formattedData2 = allSaleInvoice.map((item: any) => ({
    type: "Profits",
    date: item.createdAt.toISOString().split("T")[0],
    amount: item._sum.profit || 0,
  }));

  const formattedData3 = allSaleInvoice.map((item: any) => ({
    type: "nombre de facture",
    date: item.createdAt.toISOString().split("T")[0],
    count: item._count.id || 0,
  }));

  return { formattedData1, formattedData2, formattedData3 };
};

export const getDashboardMetrics = async (req: Request, res: Response): Promise<void> => {
  try {
    const { startDate, endDate } = req.query;
    const institutionSlug = req.params.institution;

    if (!startDate || !endDate || typeof startDate !== "string" || typeof endDate !== "string") {
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

    const institution = await prisma.institution.findUnique({ where: { slug: institutionSlug } });
    if (!institution) {
      res.status(404).json({ error: "Institution not found" });
      return;
    }

    const chartData = await generateChartData(start, end, institution.id);
    const popularProducts = await prisma.product.findMany({ take: 10, orderBy: { quantity: "desc" } });
    const monthlyTrends = await getMonthlyTrends(institution.id);

    const { formattedData1, formattedData2, formattedData3 } = await getData(start, end);

    const duration = end.getTime() - start.getTime();
    const previousEnd = new Date(start.getTime());
    const previousStart = new Date(start.getTime() - duration);

    const {
      formattedData1: previousFormatted1,
      formattedData2: previousFormatted2,
      formattedData3: previousFormatted3,
    } = await getData(previousStart, previousEnd);

    const sum = (arr: any[], key: "amount" | "count" = "amount") => arr.reduce((acc, item) => acc + (item[key] || 0), 0);


    const salesTrend = getDynamicTrend(sum(formattedData1), sum(previousFormatted1));
    const profitTrend = getDynamicTrend(sum(formattedData2), sum(previousFormatted2));
    const invoiceTrend = getDynamicTrend(sum(formattedData3, "count"), sum(previousFormatted3, "count"));


    const saleProfitCount = [...formattedData1, ...formattedData2];

    const totalUsers = await prisma.user.count();
    const totalCredits = await prisma.credit.aggregate({
      where: {
        customer: { saleInvoice: { some: { institutionId: institution.id } } },
      },
      _sum: { amount: true, usedAmount: true },
    });

    const totalAvailableCredit = (totalCredits._sum.amount ?? 0) - (totalCredits._sum.usedAmount ?? 0);

    let customerStats = null;
    let creditTrend = null;
    if (req.auth?.role === "Particulier") {
      const customerId = Number(req.auth.sub);
      const commandes = await prisma.saleInvoice.findMany({ where: { customerId } });
      const commandespaye = await prisma.saleInvoice.findMany({ where: { customerId, paymentStatus: "PAID" } });

      const totalAchats = commandes.reduce((acc, cmd) => acc + (cmd.finalAmount || 0), 0);
      const nombreCommandes = commandes.length;
      const nombreCommandespaye = commandespaye.length;
      const nombreCommandesImpaye = nombreCommandes - nombreCommandespaye;

      // Avoir disponible période précédente
const previousCredits = await prisma.credit.aggregate({
  where: {
    customer: { saleInvoice: { some: { institutionId: institution.id, createdAt: { gte: previousStart, lte: previousEnd } } } },
  },
  _sum: { amount: true, usedAmount: true },
});
const previousAvailableCredit = (previousCredits._sum.amount ?? 0) - (previousCredits._sum.usedAmount ?? 0);

 const creditTrend = getDynamicTrend(totalAvailableCredit, previousAvailableCredit);

      customerStats = {
        totalAchats,
        nombreCommandes,
        previousAvailableCredit,
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
      creditTrend,
      customerStats,
      salesTrend,
      profitTrend,
      invoiceTrend,
      monthlyTrends,
      previousMetrics: {
        saleProfitCount: previousFormatted1.concat(previousFormatted2),
        formattedData3: previousFormatted3,
      },
    });
  } catch (error) {
    console.error("Dashboard error:", error);
    res.status(500).json({ error: "Erreur lors du chargement des données du dashboard" });
  }
};

// --------------------- DASHBOARD VENTES ---------------------
export const getSalesDashboard = async (req: Request, res: Response): Promise<void> => {
  try {
    const { startDate, endDate,customerId,customerIds } = req.query;
    const institutionSlug = req.params.institution;

    if (!startDate || !endDate || typeof startDate !== "string" || typeof endDate !== "string") {
      res.status(400).json({ error: "Invalid or missing startDate or endDate" });
      return;
    }

    const start = new Date(startDate);
    const end = new Date(endDate);

    const institution = await prisma.institution.findUnique({ where: { slug: institutionSlug } });
    if (!institution) {
      res.status(404).json({ error: "Institution not found" });
      return;
    }


    // --- Filtre client ---
    let customerFilter: any = {};
    if (customerIds && typeof customerIds === "string") {
      const ids = customerIds
        .split(",")
        .map(id => Number(id))
        .filter(id => !isNaN(id));
      if (ids.length > 0) customerFilter.customerId = { in: ids };
    } else if (customerId && typeof customerId === "string") {
      const id = Number(customerId);
      if (!isNaN(id)) customerFilter.customerId = id;
    }

    // Récupérer tous les clients de type "Pharmacie"
const customers = await prisma.customer.findMany({
  where: { institutionId: institution.id, type_customer: "Pharmacie" },
  select: { id: true, name: true },
});


    // --- Ventes par produit ---
    const saleItems = await prisma.saleItem.findMany({
      where: { invoice: { institutionId: institution.id, createdAt: { gte: start, lte: end }, paymentStatus: "PAID", delivred: true, ...customerFilter, } },
      select: { productId: true, quantity: true, totalPrice: true },
    });

    const salesByProductMap: Record<string, { totalQuantity: number; totalSales: number }> = {};
    saleItems.forEach(item => {
      if (!salesByProductMap[item.productId]) salesByProductMap[item.productId] = { totalQuantity: 0, totalSales: 0 };
      salesByProductMap[item.productId].totalQuantity += item.quantity;
      salesByProductMap[item.productId].totalSales += item.totalPrice;
    });

    const productIds = Object.keys(salesByProductMap);
    const products = await prisma.product.findMany({ where: { id: { in: productIds } }, select: { id: true, designation: true } });
    const productMap = products.reduce<Record<string, string>>((acc, prod) => { acc[prod.id] = prod.designation; return acc; }, {});
    const salesByProduct = productIds.map(pid => ({
      productId: pid,
      productName: productMap[pid] || "Produit inconnu",
      totalQuantity: salesByProductMap[pid].totalQuantity,
      totalSales: salesByProductMap[pid].totalSales,
    }));

    // --- Ventes par pharmacie ---
     const invoices = await prisma.saleInvoice.findMany({
      where: {
        institutionId: institution.id,
        paymentStatus: "PAID",
        delivred: true,
        createdAt: { gte: start, lte: end },
        customer: { type_customer: "Pharmacie" }, ...customerFilter, // filtre seulement les pharmacies
      },
      include: { customer: true, items: true },
    });

    const salesByPharmacyMap: Record<number, { invoiceCount: number; totalSales: number; totalQuantity: number; pharmacyName: string; city: string }> = {};
    invoices.forEach(inv => {
      if (!inv.customer) return;
      const id = inv.customer.id;
      const name = inv.customer.name;
      const city = inv.customer.ville || "Ville inconnue";
      if (!salesByPharmacyMap[id]) salesByPharmacyMap[id] = { invoiceCount: 0, totalSales: 0, totalQuantity: 0, pharmacyName: name, city };
      salesByPharmacyMap[id].invoiceCount += 1;
      salesByPharmacyMap[id].totalSales += inv.finalAmount ?? 0;
      salesByPharmacyMap[id].totalQuantity += inv.items.reduce((sum, it) => sum + it.quantity, 0);
    });
    const salesByPharmacy = Object.values(salesByPharmacyMap);

   // ---------------------- Ventes par ville ----------------------
    const salesByCityMap: Record<string, { invoiceCount: number; totalSales: number; totalQuantity: number }> = {};
    salesByPharmacy.forEach(ph => {
      if (!salesByCityMap[ph.city]) salesByCityMap[ph.city] = { invoiceCount: 0, totalSales: 0, totalQuantity: 0 };
      salesByCityMap[ph.city].invoiceCount += ph.invoiceCount;
      salesByCityMap[ph.city].totalSales += ph.totalSales;
      salesByCityMap[ph.city].totalQuantity += ph.totalQuantity;
    });
    const salesByCity = Object.entries(salesByCityMap).map(([city, data]) => ({ cityName: city, ...data }));


// ------------------ TOP PRODUITS ------------------
    const productSales = await prisma.saleItem.groupBy({
    by: ["productId"],
    _sum: { quantity: true },
    orderBy: { _sum: { quantity: "desc" } },
    take: 10, // top 10 produits
  });

    const topProducts = await Promise.all(
      productSales.map(async (sale) => {
        const product = await prisma.product.findUnique({
          where: { id: sale.productId! },
          select: { designation: true },
        });
        return {
          name: product?.designation ?? "Inconnu",
          value: sale._sum.quantity ?? 0,
        };
      })
    );

    const sortedTopProducts = topProducts.sort((a, b) => b.value - a.value);

    // ------------------ TOP CLIENTS ------------------
    const groupedCustomers = await prisma.saleInvoice.groupBy({
      by: ["customerId"],
      _sum: { totalAmount: true },
      _count: { id: true },
      orderBy: { _sum: { totalAmount: "desc" } },
      take: 10,
    });

    const customersWithData = await Promise.all(
      groupedCustomers.map(async (sale) => {
        const customer = await prisma.customer.findUnique({
          where: { id: sale.customerId },
          select: { id: true, name: true, email: true },
        });
        return {
          customerId: sale.customerId,
          customerName: customer?.name ?? "Inconnu",
          customerEmail: customer?.email ?? "",
          totalAmount: sale._sum?.totalAmount ?? 0,
          invoiceCount: sale._count?.id ?? 0,
        };
      })
    );

    const sixMonthsAgo = subMonths(new Date(), 6);
    const salesHistory = await prisma.saleInvoice.groupBy({
      by: ["customerId", "createdAt"],
      where: { createdAt: { gte: sixMonthsAgo } },
      _sum: { totalAmount: true },
    });

    const historyByCustomer: Record<string, { month: string; total: number }[]> = {};
    salesHistory.forEach((sale) => {
      const monthKey = new Date(sale.createdAt).toLocaleString("default", { month: "short", year: "numeric" });
      if (!historyByCustomer[sale.customerId]) historyByCustomer[sale.customerId] = [];
      historyByCustomer[sale.customerId].push({ month: monthKey, total: sale._sum?.totalAmount ?? 0 });
    });

    const topCustomers = customersWithData.map((c) => ({
      ...c,
      history: historyByCustomer[c.customerId] ?? [],
    }));

   // ---------------------- Produits préférés par client ----------------------
   const withCustomer = await prisma.saleItem.findMany({
  where: {
    invoice: {
      institutionId: institution.id,
      createdAt: { gte: start, lte: end },
      paymentStatus: "PAID",
      delivred: true, ...customerFilter,
    },
  },
  select: {
    productId: true,
    quantity: true,
    invoice: { select: { customerId: true } },
  },
});

// 1️⃣ Regrouper les produits préférés par client
const preferredByCustomer: Record<string, { productId: string; total: number }> = {};
withCustomer.forEach((row) => {
  const customerId = row.invoice?.customerId;
  if (!customerId) return;

  const current = preferredByCustomer[customerId];
  if (!current || row.quantity > current.total) {
    preferredByCustomer[customerId] = { productId: row.productId, total: row.quantity };
  }
});

// 2️⃣ Récupérer les IDs
const preferredCustomerIds = Object.keys(preferredByCustomer).map(id => Number(id)); // convertir en number
const favoriteProductIds = Object.values(preferredByCustomer).map((d) => d.productId);

// 3️⃣ Récupérer les données clients et produits
const [favCustomers, favProducts] = await Promise.all([
  prisma.customer.findMany({
    where: { id: { in: preferredCustomerIds } },
    select: { id: true, name: true },
  }),
  prisma.product.findMany({
    where: { id: { in: favoriteProductIds } },
    select: { id: true, designation: true },
  }),
]);

// 4️⃣ Créer des maps pour un accès rapide
const favCustomersMap = favCustomers.reduce<Record<string, string>>((acc, c) => {
  acc[c.id] = c.name;
  return acc;
}, {});

const favProductsMap = favProducts.reduce<Record<string, string>>((acc, p) => {
  acc[p.id] = p.designation;
  return acc;
}, {});

// 5️⃣ Construire le tableau final
const favoriteProductsByCustomer = Object.entries(preferredByCustomer).map(([customerId, data]) => ({
  customerId,
  customerName: favCustomersMap[customerId] ?? "Inconnu",
  favoriteProduct: favProductsMap[data.productId] ?? "Inconnu",
  totalBought: data.total,
}));

console.log(favoriteProductsByCustomer);



    // ------------------ RÉPONSE ------------------
    res.json({
      salesByProduct,
      salesByPharmacy,
      salesByCity,
      topProducts: sortedTopProducts,
      topCustomers,
      favoriteProductsByCustomer,
      customers,
    });
  } catch (error) {
    console.error("Dashboard ventes error:", error);
    res.status(500).json({ error: "Erreur lors du chargement des données de ventes" });
  }
};

