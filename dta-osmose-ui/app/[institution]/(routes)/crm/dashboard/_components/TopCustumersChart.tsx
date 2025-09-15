"use client";

import React from "react";
import { TrendingUp } from "lucide-react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from "recharts";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

interface CustomerHistory {
  count: number;
  month: string; // format "MMM yyyy" (comme généré par ton controller)
  total: number;
}

interface TopCustomer {
  customerId: string;
  customerName: string;
  customerEmail: string | null;
  totalAmount: number;
  invoiceCount: number;
  history?: CustomerHistory[];
}

interface TopCustomersChartProps {
  data?: TopCustomer[];
  isLoading?: boolean;
}

const COLORS = [
  "var(--chart-1)", // bleu
  "var(--chart-2)", // vert
  "var(--chart-3)", // orange
  "var(--chart-4)", // rouge
  "var(--chart-5)", // violet
];

interface MergedHistoryItem {
  month: string;
  [clientName: string]: number | string;
}

export default function TopCustomersChart({
  data = [],
  isLoading = false,
}: TopCustomersChartProps) {
  if (isLoading) return <div>Chargement...</div>;
  if (!data.length) return <div>Aucune donnée disponible</div>;
  // Générer historiques des 6 derniers mois fixes
const mergedHistory: MergedHistoryItem[] = [];
const today = new Date();
const months: string[] = [];

for (let i = 5; i >= 0; i--) {
  const d = new Date(today.getFullYear(), today.getMonth() - i, 1);
  const monthKey = d.toLocaleString("default", { month: "short", year: "numeric" }); 
  months.push(monthKey);
  mergedHistory.push({ month: monthKey });
}

// Remplir les données de chaque client
data.forEach((customer) => {
  const historyMap: Record<string, number> = {};
  const invoicesMap: Record<string, number> = {};
  (customer.history ?? []).forEach((h) => {
    historyMap[h.month] = h.total;
    invoicesMap[h.month] = h.count ?? 0;
  });

  mergedHistory.forEach((m) => {
    m[customer.customerName] = historyMap[m.month] ?? 0; // 0 si aucune vente
    m[`${customer.customerName}_count`] = invoicesMap[m.month] ?? 0; // Nombre de ventes
  });
});
// DEBUG console.log
console.log("=== DEBUG: Merged History (LineChart) ===");
mergedHistory.forEach((m) => {
  console.log(m);
  });

  console.log("PieChart data (top clients):", data);
  console.log("Merged History (LineChart):", mergedHistory);

  // PieChart top clients
  const pieData = data.map((c, i) => ({
    name: c.customerName,
    value: c.totalAmount ?? 0,
    invoices: c.invoiceCount ?? 0,
    fill: COLORS[i % COLORS.length],
  }));
  

  return (
    <div className="grid gap-6 md:grid-cols-2">
      {/* ---------------- PieChart Top Clients ---------------- */}
      <Card className="flex flex-col">
        <CardHeader className="items-center pb-0">
          <CardTitle>Top Clients</CardTitle>
          <CardDescription>
            Montant total et nombre de factures
          </CardDescription>
        </CardHeader>
        <CardContent className="flex-1 pb-0">
          <div className="mx-auto" style={{ width: 300, height: 300 }}>
            <PieChart width={300} height={300}>
              <Tooltip
                formatter={(value, name, entry: any) =>
                  `${Number(value).toLocaleString()} € • ${entry.payload.invoices} factures`
                }
              />
              <Pie
                data={pieData}
                dataKey="value"
                nameKey="name"
                cx="50%"
                cy="50%"
                outerRadius={100}
                paddingAngle={0}     // supprime les espaces blancs
                stroke="none"        // supprime la bordure autour des secteurs
              >
                {pieData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.fill} />
                ))}
              </Pie>
            </PieChart>
          </div>
        </CardContent>
        <CardFooter className="flex-col gap-2 text-sm">
          <div className="flex items-center gap-2 leading-none font-medium">
            Top clients du mois <TrendingUp className="h-4 w-4" />
          </div>
          <div className="text-muted-foreground leading-none">
            Montant total et nombre de factures pour chaque client
          </div>
        </CardFooter>
      </Card>

      {/* ---------------- LineChart Historique ---------------- */}
      <Card className="shadow-md rounded-2xl">
        <CardHeader>
          <CardTitle className="text-xl font-semibold mb-4">
            Historique d’achats (6 mois)
          </CardTitle>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart
              data={mergedHistory}
              margin={{ top: 5, right: 20, bottom: 5, left: 0 }}
            >
              <XAxis
                dataKey="month"
                tick={{ fill: "var(--text-primary)", fontSize: 12 }}
              />
              <YAxis tick={{ fill: "var(--text-primary)", fontSize: 12 }} />
              <Tooltip
                contentStyle={{
                  backgroundColor: "var(--card-bg)",
                  borderRadius: 8,
                }}
                itemStyle={{ color: "var(--text-primary)" }}
                formatter={(value, name, entry: any) => {
                  const count = entry.payload[`${name}_count`] ?? 0;
                  return `${Number(value).toLocaleString('fr-FR')} € (${count} ventes)`;
                }}
              />
              {/*<Legend />*/}
              {data.map((c, i) => (
                <Line
                  key={c.customerId}
                  type="monotone"
                  dataKey={c.customerName}
                  stroke={COLORS[i % COLORS.length]}
                  strokeWidth={2}
                  dot={{ r: 4 }}
                  activeDot={{ r: 6 }}
                />
              ))}
            </LineChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>
    </div>
  );
}
