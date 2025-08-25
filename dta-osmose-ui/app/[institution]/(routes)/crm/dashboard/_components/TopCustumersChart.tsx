'use client';

import React from "react";
import {LineChart, Line, XAxis, YAxis, Tooltip,Legend,ResponsiveContainer,} from "recharts";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface CustomerHistory {
  date: string;
  amount: number;
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

export default function TopCustomersChart({ data = [], isLoading = false }: TopCustomersChartProps) {
  if (isLoading) return <div>Chargement...</div>;
  if (!data.length) return <div>Aucune donnée disponible</div>;

   /// Fusionner les historiques pour un graphique multi-clients
const mergedHistory: { month: string; [key: string]: number | string }[] = [];

// 1️⃣ Créer un set de tous les mois des 6 derniers mois
const today = new Date();
const monthsSet = new Set<string>();
for (let i = 5; i >= 0; i--) {
  const date = new Date(today.getFullYear(), today.getMonth() - i, 1);
  const monthKey = date.toLocaleDateString("fr-FR", { month: "short", year: "numeric" });
  monthsSet.add(monthKey);
  mergedHistory.push({ month: monthKey });
}

// 2️⃣ Remplir les valeurs pour chaque client
data.forEach((customer: TopCustomer) => {
  const historyMap: Record<string, number> = {};
  (customer.history ?? []).forEach((h: CustomerHistory) => {
    if (!h.date || h.amount == null) return;
    const monthKey = new Date(h.date).toLocaleDateString("fr-FR", { month: "short", year: "numeric" });
    historyMap[monthKey] = (historyMap[monthKey] || 0) + h.amount;
  });

  // 3️⃣ Ajouter les montants dans mergedHistory
  mergedHistory.forEach((m) => {
    m[customer.customerName] = historyMap[m.month] ?? 0; // 0 si aucune vente ce mois
  });
});

// 4️⃣ Tri déjà garanti car on a créé mergedHistory dans l’ordre des 6 derniers mois


  return (
    <div className="grid gap-6 md:grid-cols-2">
      {/* Tableau Top Clients */}
      <Card>
        <CardHeader>
          <CardTitle className="text-xl font-semibold mb-4"> Top Clients</CardTitle>
        </CardHeader>
        <CardContent>
          <table className="w-full text-sm">
            <thead>
              <tr className="text-left border-b">
                <th>Client</th>
                <th>Email</th>
                <th>Factures</th>
                <th>Total (€)</th>
              </tr>
            </thead>
            <tbody>
              {data.map((c) => (
                <tr key={c.customerId} className="border-b">
                  <td>{c.customerName}</td>
                  <td>{c.customerEmail || "-"}</td>
                  <td>{c.invoiceCount ?? 0}</td>
                  <td>{(c.totalAmount ?? 0).toLocaleString()} €</td>
                </tr>
              ))}
            </tbody>
          </table>
        </CardContent>
      </Card>
      {/* Graphique historique (LineChart) */}
      <Card className="shadow-md rounded-2xl">
        <CardHeader>
          <CardTitle className="text-xl font-semibold mb-4">📈 Historique d’achats (6 mois)</CardTitle>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={mergedHistory}>
              <XAxis dataKey="month" />
              <YAxis />
              <Tooltip />
              <Legend />
              {data.map((c, i) => (
                <Line
                  key={c.customerId}
                  type="monotone"
                  dataKey={c.customerName}
                  stroke={`hsl(${(i * 70) % 360}, 70%, 50%)`}
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
