"use client";

import { useMemo, useState } from "react";
import { Clock } from "lucide-react";
import { FunnelChart, Funnel, LabelList, Cell } from "recharts";

import { Card, CardHeader, CardTitle, CardContent, CardFooter, CardDescription } from "@/components/ui/card";
import { ChartContainer } from "@/components/ui/chart";
import { Checkbox } from "@/components/ui/checkbox";
import { Progress } from "@/components/ui/progress";
import { formatCurrency, cn } from "@/lib/utils";

import { actionItems } from "./crm.confg";

interface OperationalCardsProps {
  salesByCity: {
    cityName: string;
    totalSales: number;
    totalQuantity: number;
    invoiceCount: number;
    percentage: number;
    growth: string;
    isPositive: boolean;
  }[];
  pipeline?: {
    stage: string;
    value: number;
    trend: number;
  }[];
  isLoading: boolean;
}

const funnelChartConfig = {
  funnel: {
    label: "Pipeline",
  },
} as const;

 // Ordre logique du pipeline
const stageOrder = [
  "LEAD_CAPTURED",
  "CAPTURED",
  "CONTACTED",
  "QUALIFIED",
  "PROPOSAL_SENT",
  "NEGOTIATION",
  "CLOSED_WON",
  "CLOSED_LOST",
];

export function OperationalCards({ salesByCity, pipeline = [], isLoading }: OperationalCardsProps) {
  const totalSales = salesByCity.reduce((sum, city) => sum + city.totalSales, 0);
  const pipelineLoading = !pipeline || pipeline.length === 0;

  // Couleurs thématiques pour le Funnel
  const funnelChartColors = [
   "var(--chart-1)", "var(--chart-2)", "var(--chart-3)", "var(--chart-4)", "var(--chart-5)"
  ];

  const totalTrend = useMemo(
    () => pipeline.reduce((acc, p) => acc + p.trend, 0),
    [pipeline]
  );
// Tri dans l’ordre défini ci-dessus
const sortedPipeline = useMemo(() => {
  return [...pipeline].sort(
    (a, b) => stageOrder.indexOf(a.stage) - stageOrder.indexOf(b.stage)
  );
}, [pipeline]);
   console.log("Pipeline Data:", sortedPipeline);

  return (
    <div className="grid grid-cols-1 gap-4 *:data-[slot=card]:shadow-xs sm:grid-cols-2 xl:grid-cols-3">
      {/* -------- Pipeline Commercial -------- */}
      <Card>
        <CardHeader>
          <CardTitle>Pipeline Commercial</CardTitle>
        </CardHeader>
        <CardContent className="size-full">
          {pipelineLoading ? (
            <p className="text-sm text-muted-foreground">Chargement...</p>
          ) : (
        <ChartContainer className="w-full h-64" config={funnelChartConfig}>
              <FunnelChart width={400} height={300}>
                <Funnel
                  data={sortedPipeline}
                  dataKey="value"
                  nameKey="stage"
                  isAnimationActive={true}
                 
                >
                  {sortedPipeline.map((entry, index) => (
                    <Cell
                      key={`cell-${index}`}
                      fill={funnelChartColors[index % funnelChartColors.length]}
                    />
                  ))}
                  {/* Nom de l’étape à droite */}
                  <LabelList
                    dataKey="stage"
                    position="right"
                    offset={10}
                    className="fill-foreground"
                  />
                  {/* Valeur à gauche */}
                  <LabelList
                    dataKey="value"
                    position="left"
                    offset={10}
                    className="fill-foreground"
                  />
                </Funnel>
              </FunnelChart>
            </ChartContainer>
          )}
        </CardContent>
        <CardFooter>
          <p className="text-muted-foreground text-xs">
            {pipeline.length > 0
              ? `Variation totale : ${pipeline.reduce((acc, p) => acc + p.trend, 0).toFixed(1)} % depuis le mois dernier.`
              : "Aucune donnée disponible."}
          </p>
        </CardFooter>
      </Card>
     <Card>
        <CardHeader>
          <CardTitle>Vente par Ville</CardTitle>
          <CardDescription className="font-medium tabular-nums">
            {formatCurrency(totalSales, { noDecimals: true })}
          </CardDescription>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <p className="text-sm text-muted-foreground">Chargement...</p>
          ) : (
            <div className="space-y-2.5">
              {salesByCity.map((city: any) => (
                <div key={city.cityName} className="space-y-0.5">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium">{city.cityName}</span>
                    <div className="flex items-baseline gap-1">
                      <span className="text-sm font-semibold tabular-nums">
                        {formatCurrency(city.totalSales, { noDecimals: true })}
                      </span>
                      <span className="text-xs font-medium tabular-nums">
                       ({city.totalQuantity} ventes)
                     </span>
                      <span
                        className={cn(
                          "text-xs font-medium tabular-nums",
                          city.isPositive ? "text-green-500" : "text-destructive"
                        )}
                      >
                        {city.growth}
                      </span>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Progress value={city.percentage} />
                    <span className="text-muted-foreground text-xs font-medium tabular-nums">
                      {city.percentage}%
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
        <CardFooter>
          <div className="text-muted-foreground flex justify-between gap-1 text-xs">
            <span>{salesByCity.length} villes surveillées</span>
            <span>•</span>
            <span>{salesByCity.filter((r: any) => r.isPositive).length} villes en croissance</span>
          </div>
        </CardFooter>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Mesures à prendre</CardTitle>
        </CardHeader>
        <CardContent>
          <ul className="space-y-2.5">
            {actionItems.map((item) => (
              <li key={item.id} className="space-y-2 rounded-md border px-3 py-2">
                <div className="flex items-center gap-2">
                  <Checkbox defaultChecked={item.checked} />
                  <span className="text-sm font-medium">{item.title}</span>
                  <span
                    className={cn(
                      "w-fit rounded-md px-2 py-1 text-xs font-medium",
                      item.priority === "High" && "text-destructive bg-destructive/20",
                      item.priority === "Medium" && "bg-yellow-500/20 text-yellow-500",
                      item.priority === "Low" && "bg-green-500/20 text-green-500",
                    )}
                  >
                    {item.priority}
                  </span>
                </div>
                <div className="text-muted-foreground text-xs font-medium">{item.desc}</div>
                <div className="flex items-center gap-1">
                  <Clock className="text-muted-foreground size-3" />
                  <span className="text-muted-foreground text-xs font-medium">{item.due}</span>
                </div>
              </li>
            ))}
          </ul>
        </CardContent>
      </Card>
    </div>
  );
}
