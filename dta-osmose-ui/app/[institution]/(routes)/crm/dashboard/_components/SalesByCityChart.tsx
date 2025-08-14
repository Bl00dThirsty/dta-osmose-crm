
'use client';

import React from "react";
import { BarChart, Bar, XAxis, YAxis, Tooltip, Legend, LabelList } from "recharts";
import { ChartContainer, ChartConfig } from "@/components/ui/chart";

interface BarItem {
  dataKey: string;
  name: string;
  color: string;
}

interface SalesBarChartProps {
  data: any[];
  xKey: string;
  bars: BarItem[];
}

export const SalesBarChart: React.FC<SalesBarChartProps> = ({ data, xKey, bars }) => {
  // Génération dynamique de chartConfig pour ChartContainer
  const chartConfig: ChartConfig = bars.reduce((acc, bar) => {
    acc[bar.dataKey] = { label: bar.name, color: bar.color };
    return acc;
  }, {} as Record<string, { label: string; color: string }>);

  return (
    <ChartContainer config={chartConfig} className="min-h-[100px] w-full">
      <BarChart data={data} margin={{ top: 20, right: 30, left: 0, bottom: 5 }}>
        <XAxis dataKey={xKey} tick={{ fontSize: 12 }} />
        <YAxis />
        <Tooltip formatter={(value: number) => value.toLocaleString()} />
        <Legend />
        {bars.map(bar => (
          <Bar
            key={bar.dataKey}
            dataKey={bar.dataKey}
            fill={`var(--color-${bar.dataKey})`} // utilisation des couleurs de ChartContainer
            radius={[4, 4, 0, 0]}
            name={bar.name}
          >
            <LabelList
              dataKey={bar.dataKey}
              position="top"
              formatter={(value: number) => value.toLocaleString()}
            />
          </Bar>
        ))}
      </BarChart>
    </ChartContainer>
  );
};
