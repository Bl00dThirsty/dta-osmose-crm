"use client";

import React from "react";
import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  ResponsiveContainer,
  Bar,
  BarChart,
  XAxis,
  YAxis,
  Line,
  LineChart,
  CartesianGrid,
  LabelList,
} from "recharts";

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart";
import { projectRevenueChartConfig } from "./crm.confg";
import { GitCommitVertical, TrendingUp } from "lucide-react";

interface ProductsChartProps {
  salesByPharmacy?: {
    totalSales: number;
    pharmacyId: string;
    pharmacyName: string;
    totalQuantity: number;
    totalAmount: number;
  }[];
  salesByProduct?: {
    totalSales: number;
    productId: string;
    productName: string;
    totalQuantity: number;
    totalAmount: number;
  }[];
  favoriteProductsByCustomer?: {
    customerId: string;
    customerName: string;
    favoriteProduct: string;
    totalBought: number;
  }[];
  isLoading: boolean;
}

export default function ProductsChart({
  salesByProduct = [],
  salesByPharmacy = [],
  favoriteProductsByCustomer = [],
  isLoading,
}: ProductsChartProps) {
  if (isLoading) return <div>Chargement...</div>;

  if (!salesByProduct.length && !salesByPharmacy.length && !favoriteProductsByCustomer.length)
    return <div>Aucune donnée disponible</div>;

  const COLORS = [
    "var(--chart-1)", // bleu
    "var(--chart-2)", // vert
    "var(--chart-3)", // orange
    "var(--chart-4)", // rouge
    "var(--chart-5)", // violet
  ];

  // ---------------- PieChart Vente par produit ----------------
  const salesByProductSafe = salesByProduct.map((p) => ({
    ...p,
    totalSales: p.totalSales ?? 0,
    totalQuantity: p.totalQuantity ?? 0,
  }));

  // ---------------- BarChart Vente par pharmacie ----------------
  const pharmacyData = salesByPharmacy.map((p) => ({
    name: p.pharmacyName ?? "N/A",
    totalAmount: p.totalSales ?? 0,
    totalQuantity: p.totalQuantity ?? 0,
  }));

  // ---------------- LineChart Produits préférés par client ----------------
  const allProducts = Array.from(
    new Set(favoriteProductsByCustomer.map((p) => p.favoriteProduct))
  );
  const clients = favoriteProductsByCustomer.map((c) => c.customerName);

  const chartData = allProducts.map((product) => {
    const entry: Record<string, string | number> = { product };
    favoriteProductsByCustomer.forEach((c) => {
      entry[c.customerName] =
        c.favoriteProduct === product ? c.totalBought : 0;
    });
    return entry;
  });
  // ---------------- DEBUG LOGS ----------------
  console.log("[ProductsChart] salesByProduct:", salesByProduct);
  console.log(" [ProductsChart] salesByPharmacy:", salesByPharmacy);
  console.log(" [ProductsChart] favoriteProductsByCustomer:", favoriteProductsByCustomer);

  return (
    <div className="grid gap-6 md:grid-cols-3">
      {/* PieChart Vente par produit */}
      <Card>
        <CardHeader>
          <CardTitle>Vente par produit</CardTitle>
          <CardDescription>
            Montant total et quantités par produit
          </CardDescription>
        </CardHeader>
        <CardContent className="flex justify-center">
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Tooltip
                formatter={(value, name, entry: any) => {
                  const qty = entry?.payload?.totalQuantity ?? 0;
                  const amount = entry?.payload?.totalSales ?? 0;
                  return [`${amount.toLocaleString()} € | ${qty} unités`, entry?.payload?.productName];
                }}
              />
              <Pie
                data={salesByProductSafe}
                dataKey="totalSales"
                nameKey="productName"
                cx="50%"
                cy="50%"
                outerRadius={100}
                paddingAngle={0}     // supprime les espaces blancs
                stroke="none"        // supprime la bordure autour des secteurs
              >
                {salesByProductSafe.map((_, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
            </PieChart>
          </ResponsiveContainer>
        </CardContent>
        <CardFooter>
          <p className="text-muted-foreground text-xs">
            Montant total et quantités vendues par produit
          </p>
        </CardFooter>
      </Card>

   {/* LineChart Vente par pharmacie */}
<Card className="col-span-1">
  <CardHeader>
    <CardTitle>Vente par pharmacie</CardTitle>
    <CardDescription>
      Montant total (€) et quantités par pharmacie
    </CardDescription>
  </CardHeader>
  <CardContent className="size-full">
    <ChartContainer
      config={{
        totalAmount: { label: "Montant (€)", color: "var(--chart-1)" },
      }}
      className="size-full"
    >
      <ResponsiveContainer width="100%" height={250}>
        <LineChart data={pharmacyData} margin={{ left: 12, right: 12 }}>
          <CartesianGrid vertical={false} stroke="var(--border)" />
          <XAxis
            dataKey="name"
            tick={false} // <-- supprime les noms en abscisse
            axisLine={false}
          />
          <YAxis hide />
          <ChartTooltip
            cursor={false}
            content={
              <ChartTooltipContent
                formatter={(value, name, entry: any) => {
                  const qty = entry?.payload?.totalQuantity ?? 0;
                  const amount = entry?.payload?.totalAmount ?? 0;
                  return [`${amount.toLocaleString()} € | ${qty} unités`];
                }}
              />
            }
          />
          <Line
            type="monotone"
            dataKey="totalAmount"
            stroke="var(--chart-1)"
            strokeWidth={2}
            dot={({ cx, cy, payload }) => {
              const r = 20;
              return (
                <GitCommitVertical
                  key={payload.name}
                  x={cx - r / 2}
                  y={cy - r / 2}
                  width={r}
                  height={r}
                  fill="hsl(var(--background))"
                  stroke="var(--chart-1)"
                />
              );
            }}
          />
        </LineChart>
      </ResponsiveContainer>
    </ChartContainer>
  </CardContent>
  <CardFooter className="flex-col items-start gap-2 text-sm">
    <div className="flex gap-2 leading-none font-medium">
      Tendance des ventes par pharmacie <TrendingUp className="h-4 w-4" />
    </div>
    <div className="text-muted-foreground leading-none">
      Montant total (€) et quantités vendues
    </div>
  </CardFooter>
</Card>


      {/* LineChart Produits préférés par client */}
      <Card>
        <CardHeader>
          <CardTitle>Produits préférés par client</CardTitle>
          <CardDescription>Produit le plus acheté par client</CardDescription>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={chartData} margin={{ top: 10, right: 12, bottom: 10, left: 12 }}>
              <CartesianGrid vertical={false} stroke="var(--border)" />
              <XAxis dataKey="product" tickLine={false} axisLine={false} tick={{ fill: "var(--text-secondary)", fontSize: 12 }} />
              <YAxis tickLine={false} axisLine={false} tick={{ fill: "var(--text-secondary)", fontSize: 12 }} />
              <Tooltip
                contentStyle={{ backgroundColor: "var(--card-bg)", borderRadius: 8, padding: 8 }}
                itemStyle={{ color: "var(--text-primary)" }}
              />
              {clients.map((name, i) => (
                <Line
                  key={name}
                  dataKey={name}
                  stroke={COLORS[i % COLORS.length]}
                  strokeWidth={2}
                  dot={false}
                />
              ))}
            </LineChart>
          </ResponsiveContainer>
        </CardContent>
        <CardFooter className="flex gap-2 text-sm">
          <div className="text-muted-foreground leading-none">
            Basé sur le produit le plus acheté par chaque client
          </div>
        </CardFooter>
      </Card>
    </div>
  );
}
