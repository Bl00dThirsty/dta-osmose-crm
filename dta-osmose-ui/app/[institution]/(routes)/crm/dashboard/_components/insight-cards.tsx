"use client";

import { XAxis, Label, Pie, PieChart, Bar, BarChart, CartesianGrid, LabelList, YAxis, Tooltip, Cell, ResponsiveContainer } from "recharts";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { ChartContainer, ChartTooltip, ChartTooltipContent, ChartLegend } from "@/components/ui/chart";

import {
  projectRevenueChartData,
  projectRevenueChartConfig,
} from "./crm.confg";
import { ReactNode } from "react";



interface Product {
  name: string;
  value: number;
}

interface InsightCardsProps {
  topProducts: Product[];
  lowProducts: Product[];
  isLoading: boolean;
}

const chartConfig = {
  dummy: {
    label: "Dummy",
    color: "transparent",
  },
} as const;

export function InsightCards({ topProducts, lowProducts, isLoading }: InsightCardsProps) {
  const COLORS = ["var(--chart-1)", "var(--chart-2)", "var(--chart-3)", "var(--chart-4)", "var(--chart-5)"];
  const COLORS_LOW = ["#ca4343ff", "#d32a2aff", "#d82d2dff", "#d62727ff", "#bb0404ff"];

  if (isLoading) return <div>Chargement...</div>;
  if (!topProducts?.length && !lowProducts?.length) return <div>Aucune donnée disponible</div>;

  // Fusionner les deux tableaux pour le PieChart
  const pieData = [...topProducts, ...lowProducts];

  console.log("Top Products:", topProducts);
  console.log("Low Products:", lowProducts);
  console.log("Data envoyée au PieChart:", pieData);

  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-5">
      <Card className="col-span-1 xl:col-span-2">
        <CardHeader>
          <CardTitle>Top Produits</CardTitle>
        </CardHeader>

        <CardContent className="flex flex-row" style={{ height: 300 }}>
          {/* PieChart */}
          <div style={{ width: "70%", height: "100%" }}>
            <ChartContainer config={chartConfig} className="mx-auto aspect-square max-h-[250px]">
              <PieChart>
                <ChartTooltip cursor={false} content={<ChartTooltipContent hideLabel />} />
                <Pie
                  data={pieData}
                  nameKey="name"
                  dataKey="value"
                  innerRadius={60}
                  outerRadius={100}
                  cornerRadius={2}
                >
                  {pieData.map((entry, index) =>
                    index < topProducts.length
                      ? <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      : <Cell key={`cell-${index}`} fill={COLORS_LOW[index % COLORS_LOW.length]} />
                  )}
                </Pie>
              </PieChart>
            </ChartContainer>
          </div>

                    {/* Légende scrollable */}
          <div className="w-[40%] flex flex-col gap-3 pl-4 text-xs max-h-[250px] overflow-y-auto">
            <div className="font-medium mb-1">Produits les plus vendus</div>
            {topProducts.map((item, index) => (
              <div
                key={`top-${index}`}
                className="flex items-center justify-between text-[0.75rem]"
              >
                <span className="truncate">{item.name}</span>
                <span className="tabular-nums">{item.value}</span>
                <span
                  className="w-2.5 h-2.5 rounded-full ml-2"
                  style={{ background: COLORS[index % COLORS.length] }}
                />
              </div>
            ))}

            <div className="font-medium mt-2 mb-1">Produits les moins vendus</div>
            {lowProducts.map((item, index) => (
              <div
                key={`low-${index}`}
                className="flex items-center justify-between text-[0.75rem]"
              >
                <span className="truncate">{item.name}</span>
                <span className="tabular-nums">{item.value}</span>
                <span
                  className="w-2.5 h-2.5 rounded-full ml-2"
                  style={{ background: COLORS_LOW[index % COLORS_LOW.length] }}
                />
              </div>
            ))}
          </div>
        </CardContent>

        <CardFooter className="gap-2">
          <Button size="sm" variant="outline" className="basis-1/2">
            Voir le Rapport
          </Button>
          <Button size="sm" variant="outline" className="basis-1/2">
            Télécharger CSV
          </Button>
        </CardFooter>
      </Card>

      <Card className="col-span-1 xl:col-span-3">
        <CardHeader>
          <CardTitle>Recettes du projet VS Objectif</CardTitle>
        </CardHeader>
        <CardContent className="size-full max-h-52">
          <ChartContainer config={projectRevenueChartConfig} className="size-full">
            <BarChart accessibilityLayer data={projectRevenueChartData} layout="vertical">
              <CartesianGrid horizontal={false} />
              <YAxis
                dataKey="name"
                type="category"
                tickLine={false}
                tickMargin={10}
                axisLine={false}
                tickFormatter={(value) => value.slice(0, 3)}
                hide
              />
              <XAxis dataKey="actual" type="number" hide />
              <ChartTooltip cursor={false} content={<ChartTooltipContent indicator="line" />} />
              <Bar stackId="a" dataKey="actual" layout="vertical" fill="var(--color-actual)">
                <LabelList
                  dataKey="name"
                  position="insideLeft"
                  offset={8}
                  className="fill-primary-foreground text-xs"
                />
                <LabelList
                  dataKey="actual"
                  position="insideRight"
                  offset={8}
                  className="fill-primary-foreground text-xs tabular-nums"
                />
              </Bar>
              <Bar
                stackId="a"
                dataKey="remaining"
                layout="vertical"
                fill="var(--color-remaining)"
                radius={[0, 6, 6, 0]}
              >
                <LabelList
                  dataKey="remaining"
                  position="insideRight"
                  offset={8}
                  className="fill-primary-foreground text-xs tabular-nums"
                />
              </Bar>
            </BarChart>
          </ChartContainer>
        </CardContent>
        <CardFooter>
          <p className="text-muted-foreground text-xs">Progrès moyen : 78 % · 2 projets au-dessus de l'objectif</p>
        </CardFooter>
      </Card>
    </div>
  );
}
