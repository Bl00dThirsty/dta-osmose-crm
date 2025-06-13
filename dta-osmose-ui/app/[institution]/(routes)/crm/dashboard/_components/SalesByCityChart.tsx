// src/app/_components/SalesByCityChart.tsx
'use client';

import { Bar, BarChart, XAxis, YAxis, Tooltip, Legend, ResponsiveContainer } from 'recharts';

interface SalesByCityChartProps {
  data: Array<{
    ville: string;
    montant: number;
    nombreVentes: number;
  }>;
}

export const SalesByCityChart = ({ data }: SalesByCityChartProps) => {
  return (
    <div className="h-[400px] w-full">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart
          data={data}
          margin={{ top: 20, right: 30, left: 20, bottom: 60 }}
        >
          <XAxis 
            dataKey="ville" 
            angle={-45} 
            textAnchor="end" 
            height={70}
            tick={{ fontSize: 12 }}
          />
          <YAxis />
          <Tooltip 
            formatter={(value, name) => {
              if (name === 'Montant total') return [`${Number(value).toLocaleString()} FCFA`, 'Montant'];
              return [value, 'Nombre de ventes'];
            }}
          />
          <Legend />
          <Bar 
            dataKey="montant" 
            name="Montant total" 
            fill="#8884d8" 
            radius={[4, 4, 0, 0]}
          />
          <Bar 
            dataKey="nombreVentes" 
            name="Nombre de ventes" 
            fill="#82ca9d" 
            radius={[4, 4, 0, 0]}
          />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};