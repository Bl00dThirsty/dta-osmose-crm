"use client";

import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, CartesianGrid, Cell } from "recharts";

interface FavoriteProduct {
  customerId: string;
  customerName: string;
  favoriteProduct: string;
  totalBought: number;
}

interface FavoriteProductChartProps {
  data: FavoriteProduct[];
  isLoading?: boolean;
}

export default function FavoriteProductChart({ data, isLoading = false }: FavoriteProductChartProps) {
  if (isLoading) return <div>Chargement...</div>;
  if (!data?.length) return <div>Aucune donnée disponible</div>;

  const COLORS = ["#3b82f6", "#f97316", "#10b981", "#e11d48", "#8b5cf6"];

  return (
    <Card className="w-full h-[400px]">
      <CardHeader>
        <CardTitle className="text-xl font-semibold mb-4"> Produits préférés par client</CardTitle>
      </CardHeader>
      <CardContent className="h-[340px]">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart
            data={data}
            layout="vertical"
            margin={{ top: 20, right: 30, left: 100, bottom: 30 }}
          >
            <CartesianGrid horizontal={false} vertical={false} />
            {/* Axe des clients (à gauche) */}
            <YAxis
              dataKey="customerName"
              type="category"
              tick={{ fontSize: 12 }}
              width={100}
            />
            {/* Axe du nombre d’achats (en bas) */}
            <XAxis
              type="number"
              label={{
                value: "Nombre d’achats",
                position: "insideBottom",
                offset: -5,
              }}
            />
            <Tooltip
                formatter={(value: number, name, props) => {
                  const product = (props.payload as any)?.favoriteProduct ?? "Inconnu";
                  return [`${value.toLocaleString()} (Produit: ${product})`, "Achats"];
                }}
                labelFormatter={(label) => `Client: ${label}`}
              />
            <Bar
              dataKey="totalBought"
              fill="#3b82f6"
              label={{
                position: "right",
                formatter: (val: number) => val.toLocaleString(),
              }}
            >
              {data.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
}
