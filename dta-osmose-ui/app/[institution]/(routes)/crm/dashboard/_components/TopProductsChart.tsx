import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer, Legend } from "recharts";


interface TopProductsChartProps {
  data: { designation: string; totalQuantity: number }[];
  isLoading: boolean;
}

export default function TopProductsChart({ data, isLoading }: TopProductsChartProps) {
  const COLORS_TOP = ["#3b45d1", "#60a5fa"];
  const COLORS_LOW = ["#f472b6", "#34d399"];

  if (isLoading) return <div>Chargement...</div>;
  if (!data?.length) return <div>Aucune donnée disponible</div>;

  // top 5 et bottom 5
  const topProducts = data.slice(0, Math.min(5, data.length));
  const lowProducts = data.slice(-Math.min(5, data.length));

  /*const pieData = [
    ...topProducts.map((p) => ({ name: p.productName, value: p.totalQuantity })),
    ...lowProducts.map((p) => ({ name: p.productName, value: p.totalQuantity })),
  ];*/

  const pieData = [...topProducts, ...lowProducts];

  return (
    <Card className="w-full h-80">
      <CardHeader>
        <CardTitle className="text-xl font-semibold mb-4">Top Produits</CardTitle>
      </CardHeader>
      <CardContent className="h-[300px]">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={pieData}
              dataKey="value"
              nameKey="name"
              cx="50%"
              cy="50%"
              outerRadius={80}
              label
            >
              {pieData.map((entry, index) =>
                index < topProducts.length
                  ? <Cell key={`cell-${index}`} fill={COLORS_TOP[index % COLORS_TOP.length]} />
                  : <Cell key={`cell-${index}`} fill={COLORS_LOW[index % COLORS_LOW.length]} />
              )}
            </Pie>
            <Tooltip />
            <Legend />
          </PieChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
}
