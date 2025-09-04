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

      {/* BarChart Vente par pharmacie */}
   <Card className="col-span-1 ">
  <CardHeader>
    <CardTitle>Vente par pharmacie</CardTitle>
  </CardHeader>
  <CardContent className="size-full max-h-52">
    <ChartContainer config={projectRevenueChartConfig} className="size-full">
      <ResponsiveContainer width="100%" height={250}>
      <BarChart 
      data={pharmacyData} 
      layout="vertical" 
      barSize={25}  // largeur des barres            
      barCategoryGap={5}    // espace entre les catégories (pharmacies)
      barGap={0}
      margin={{ top: 10, right: 12, bottom: 10, left: 12 }}             // espace entre les barres empilées
      >
        {/* Grille horizontale seulement */}
        <CartesianGrid horizontal={false} vertical={false} />

        {/* Axe Y (pharmacies) */}
        <YAxis
          dataKey="name"
          type="category"
          hide
        />

        {/* Axe X caché */}
        <XAxis type="number" hide />

        {/* Tooltip */}
       <Tooltip
  cursor={{ fill: "rgba(0,0,0,0.05)" }}
  contentStyle={{
    backgroundColor: "var(--card-bg)",
    borderRadius: 8,
    padding: 8,
  }}
  itemStyle={{ color: "var(--text-primary)" }}
  formatter={(value: number, name: string) =>
    name === "totalAmount"
      ? [`${value.toLocaleString()} €`, "Montant total"]
      : [`${value} unités`, "Quantité vendue"]
  }
/>

        {/* Montant (€) */}
        <Bar stackId="a" dataKey="totalAmount" layout="vertical" fill="var(--chart-1)">
          <LabelList
            dataKey="name"
            position="insideLeft"
            offset={8}
            className="fill-primary-foreground text-xs"
          />
          <LabelList
            dataKey="totalAmount"
            position="insideRight"
            offset={8}
            formatter={(val: number) => `${val.toLocaleString()} €`}
            className="fill-primary-foreground text-xs tabular-nums"
          />
        </Bar>

        {/* Quantité */}
        <Bar 
        stackId="a" 
        dataKey="totalQuantity" 
        layout="vertical" 
        fill="var(--chart-2)" 
        radius={[0, 6, 6, 0]}
        >
          <LabelList
            dataKey="totalQuantity"
            position="insideRight"
            offset={8}
            formatter={(val: number) => `${val} `}
            className="fill-primary-foreground text-xs tabular-nums"
          />
        </Bar>
      </BarChart>
      </ResponsiveContainer>
    </ChartContainer>
  </CardContent>
  <CardFooter>
    <p className="text-muted-foreground text-xs">
      Montant total (€) et quantités vendues par pharmacie
    </p>
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
