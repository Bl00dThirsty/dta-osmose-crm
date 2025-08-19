import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer, Legend } from "recharts";
import { useGetTopProductsQuery } from "@/state/api";

export default function TopProductsChart({ institution }: { institution: string }) {
  const { data = [], isLoading } = useGetTopProductsQuery({ institution });

  const COLORS_TOP = ["#3b45d1ff", "#60a5fa"]; // top vendus
  const COLORS_LOW = ["#f472b6", "#34d399"]; // moins vendus

  if (isLoading) return <div>Chargement...</div>;
  if (!data.length) return <div>Aucune donnée disponible</div>;

  // Séparer top et low produits (par exemple top 5 et bottom 5)
  const topProducts = data.slice(0, 5);
  const lowProducts = data.slice(-5);

  const pieData = [...topProducts, ...lowProducts];

  return (
    <Card className="w-full h-80">
      <CardHeader>
        <CardTitle>Top Produits</CardTitle>
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
