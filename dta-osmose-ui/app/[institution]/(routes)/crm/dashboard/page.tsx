'use client';

import React from "react";
import Container from "../../components/ui/Container";
import { Bar, BarChart, XAxis } from "recharts"
import { ChartConfig, ChartContainer, ChartTooltip, ChartTooltipContent, ChartLegend, ChartLegendContent } from "@/components/ui/chart"
import { useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { useGetDashboardMetricsQuery } from "@/state/api";
import { SalesByCityChart } from "./_components/SalesByCityChart";


const CrmDashboardPage = () => {
  const router = useRouter();
  const { institution } = useParams() as { institution: string }
  const token = typeof window !== 'undefined' ? localStorage.getItem('accessToken') : null;

  useEffect(() => {
    if (!token) {
      router.push('/');
    }
  }, [token]);
  
  const salesStages = ["Lead", "Qualified", "Proposal Sent", "Negotiation", "Closed Won", "Closed Lost"];
  
  const crmData = { totalOpportunities: 10, closedDeals: 5, revenue: "$500,000" };
  const chartData = [
    { month: "Janvier", vente: 186, client: 80 },
    { month: "Février", vente: 305, client: 200 },
    { month: "Mars", vente: 237, client: 120 },
    { month: "Avril", vente: 73, client: 190 },
    { month: "Mai", vente: 209, client: 130 },
    { month: "Juin", vente: 214, client: 140 },
  ]

  const chartConfig = {
    vente: {
      label: "Ventes",
      color: "#2563eb",
    },
    client: {
      label: "Clients",
      color: "#60a5fa",
    },
  } satisfies ChartConfig

  const { data: dashboardData, isLoading, error } = useGetDashboardMetricsQuery({ institution });

  if (isLoading) return <div>Chargement...</div>;
  if (error) return <div>Erreur lors du chargement des données</div>;
  
  return (
    <Container
      title="Dashboard Ventes"
      description="En cours de développement... Ce composant affiche une vue d'ensemble des ventes éffectuées sur une période définie."
    >
    <div className="grid gap-4 grid-cols-1 md:grid-cols-2 lg:grid-cols-2">
      <section className="overflow-hidden rounded-[0.5rem] border-5 bg-background shadow-zinc-50">
        {/* <ChartContainer config={chartConfig} className="h-[250px] w-full">
          <BarChart accessibilityLayer data={chartData}>
            <XAxis
             dataKey="month"
             tickLine={false}
             tickMargin={10}
             axisLine={false}
             tickFormatter={(value) => value.slice(0, 3)}
            />
            <ChartTooltip content={<ChartTooltipContent />} />
            <ChartLegend content={<ChartLegendContent />} />
            <Bar dataKey="vente" fill="var(--color-vente)" radius={4} />
            <Bar dataKey="client" fill="var(--color-client)" radius={4} />
          </BarChart>
        </ChartContainer> */}
        </section>
      </div>
      <div className="grid gap-4 grid-cols-1">
        <section className="p-4 overflow-hidden rounded-[0.5rem] border-3 bg-background shadow">
          <h2 className="text-xl font-semibold mb-4">Ventes par ville</h2>
          {dashboardData?.salesByCity ? (
            <SalesByCityChart data={dashboardData.salesByCity} />
          ) : (
            <p>Aucune donnée disponible</p>
          )}
        </section>
      </div>
    </Container>
  );
};

export default CrmDashboardPage;
