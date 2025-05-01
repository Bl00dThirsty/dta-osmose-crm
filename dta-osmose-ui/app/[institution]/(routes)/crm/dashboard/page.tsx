'use client';


import React from "react";
import Container from "../../components/ui/Container";
import CRMKanban from "./_components/CRMKanban";
import { Bar, BarChart, XAxis } from "recharts"
import { ChartConfig, ChartContainer, ChartTooltip, ChartTooltipContent, ChartLegend, ChartLegendContent } from "@/components/ui/chart"

const CrmDashboardPage = () => {
  
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
  
  return (
    <Container
      title="Dashboard Ventes"
      description="En cours de développement... Ce composant affiche une vue d'ensemble des ventes éffectuées sur une période définie."
    >
    <div className="grid gap-4 grid-cols-1 md:grid-cols-2 lg:grid-cols-2">
      <section className="overflow-hidden rounded-[0.5rem] border bg-background shadow-zinc-50">
      <ChartContainer config={chartConfig} className="h-[250px] w-full">
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
        </ChartContainer>
        </section>
      </div>
    </Container>
  );
};

export default CrmDashboardPage;
