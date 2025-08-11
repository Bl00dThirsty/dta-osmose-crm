"use client"

import * as React from "react"
import axios from "axios"
import { Area, AreaChart, CartesianGrid, XAxis } from "recharts"
import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  ToggleGroup,
  ToggleGroupItem,
} from "@/components/ui/toggle-group"
import { useIsMobile } from "@/hooks/use-mobile"
import DatePicker from "react-datepicker"
import "react-datepicker/dist/react-datepicker.css"
import { fr } from "date-fns/locale";
const chartConfig = {
  "Nombre vente": {
    label: "Nombre vente",
    color: "var(--primary)",
  },
  "Montant vente": {
    label: "Montant vente (€)",
    color: "var(--primary)",
  },
} satisfies ChartConfig




// 🔧 Fonctions utilitaires pour manipuler les dates en UTC
function toUTCStartOfDay(date: Date): Date {
  return new Date(Date.UTC(date.getFullYear(), date.getMonth(), date.getDate(), 0, 0, 0, 0));
}

function toUTCEndOfDay(date: Date): Date {
  return new Date(Date.UTC(date.getFullYear(), date.getMonth(), date.getDate(), 23, 59, 59, 999));
}

export function ChartAreaInteractive() {
  const isMobile = useIsMobile()
  const [timeRange, setTimeRange] = React.useState("90d")
  const [dateRange, setDateRange] = React.useState<[Date, Date]>([
    new Date("2025-01-01"),
    new Date("2025-12-31"),
  ])
  const [chartData, setChartData] = React.useState<
    { date: string; "Nombre vente": number; "Montant vente": number }[] | undefined
  >(undefined)

  const [startDate, endDate] = dateRange
  const institutionSlug = "iba"

  React.useEffect(() => {
    if (isMobile) setTimeRange("7d")
  }, [isMobile])

 React.useEffect(() => {
    if (timeRange !== "custom") {
      const referenceDate = new Date()
      let daysToSubtract = 90
      if (timeRange === "30d") daysToSubtract = 30
      else if (timeRange === "7d") daysToSubtract = 7

      const newEndDate = new Date(referenceDate)
      const newStartDate = new Date(referenceDate)
      newStartDate.setDate(referenceDate.getDate() - daysToSubtract)

      setDateRange([newStartDate, newEndDate])
    }
  }, [timeRange])

  React.useEffect(() => {
     const token = typeof window !== "undefined" ? localStorage.getItem("accessToken") : null;
   const fetchChartData = async () => {

  if (!token) {
    console.warn("⚠️ Token JWT manquant dans le localStorage.");
    return;
  }
  if (!startDate || !endDate || isNaN(startDate.getTime()) || isNaN(endDate.getTime())) {
        console.warn("⛔ startDate ou endDate invalide.")
        return
      }

  const normalizedStart = toUTCStartOfDay(startDate);
  const normalizedEnd = toUTCEndOfDay(endDate);

  try {
    const response = await axios.get(
      `http://localhost:8000/dashboard/${institutionSlug}`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
          "Cache-Control": "no-cache",
        },
        params: {
          startDate: normalizedStart.toISOString(),
            endDate: normalizedEnd.toISOString(),
        },
      }
    );

    console.log("✅ Données dashboard:", response.data);
    setChartData(response.data.chartData);
  } catch (error) {
    if (axios.isAxiosError(error)) {
      console.error("❌ Axios error:", error.response?.data || error.message);
    } else {
      console.error("❌ Unknown error:", error);
    }
  }
};

    fetchChartData()
  }, [startDate, endDate, institutionSlug])

  if (!chartData || !Array.isArray(chartData)) {
    return <div className="p-4 text-red-500">Pas de données disponibles</div>
  }

 /*const filteredData = chartData.filter((item) => {
  const itemDate = item.date;
  const from = startDate.toISOString().split("T")[0];
  const to = endDate.toISOString().split("T")[0];

  
  return itemDate >= from && itemDate <= to;
});*/

  return (
    <Card className="@container/card">
      <CardHeader>
        <CardTitle>Total des ventes</CardTitle>
        <CardDescription>
          {timeRange === "custom"
            ? "Plage personnalisée"
            : timeRange === "7d"
            ? "Derniers 7 jours"
            : timeRange === "30d"
            ? "Derniers 30 jours"
            : "Derniers 3 mois"}
        </CardDescription>
        <CardAction>
          <div className="flex flex-col gap-4">
            <ToggleGroup
              type="single"
              value={timeRange}
              onValueChange={(value) => setTimeRange(value || "90d")}
              variant="outline"
              className="hidden *:data-[slot=toggle-group-item]:!px-4 @[767px]/card:flex"
            >
              <ToggleGroupItem value="90d">3 mois</ToggleGroupItem>
              <ToggleGroupItem value="30d">30 jours</ToggleGroupItem>
              <ToggleGroupItem value="7d">7 jours</ToggleGroupItem>
              <ToggleGroupItem value="custom">Personnalisé</ToggleGroupItem>
            </ToggleGroup>

            <Select value={timeRange} onValueChange={(value) => setTimeRange(value)}>
              <SelectTrigger className="flex w-40 @[767px]/card:hidden" size="sm">
                <SelectValue placeholder="Derniers 3 mois" />
              </SelectTrigger>
              <SelectContent className="rounded-xl">
                <SelectItem value="90d">Derniers 3 mois</SelectItem>
                <SelectItem value="30d">Derniers 30 jours</SelectItem>
                <SelectItem value="7d">Derniers 7 jours</SelectItem>
                <SelectItem value="custom">Plage personnalisée</SelectItem>
              </SelectContent>
            </Select>

            {timeRange === "custom" && (
              <DatePicker
                selectsRange
                startDate={startDate}
                endDate={endDate}
                onChange={(update) => setDateRange(update as [Date, Date])}
                isClearable={false}
                dateFormat="dd/MM/yyyy"
                className="rounded-md border p-2 text-sm"
                locale={fr}
                monthsShown={isMobile ? 1 : 2}
                minDate={new Date("2025-01-01")}
                maxDate={new Date("2055-12-30")}
              />
            )}
          </div>
        </CardAction>
      </CardHeader>

      <CardContent className="px-2 pt-4 sm:px-6 sm:pt-6">
        <ChartContainer config={chartConfig} className="aspect-auto h-[250px] w-full">
          <AreaChart data={chartData}>
            <defs>
              <linearGradient id="fillNombreVente" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="var(--color-primary)" stopOpacity={1.0} />
                <stop offset="95%" stopColor="var(--color-primary)" stopOpacity={0.1} />
              </linearGradient>
              <linearGradient id="fillMontantVente" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="var(--color-primary)" stopOpacity={0.8} />
                <stop offset="95%" stopColor="var(--color-primary)" stopOpacity={0.1} />
              </linearGradient>
            </defs>
            <CartesianGrid vertical={false} />
            <XAxis
              dataKey="date"
              tickLine={false}
              axisLine={false}
              tickMargin={8}
              minTickGap={32}
              tickFormatter={(value) =>
                new Date(value).toLocaleDateString("fr-FR", {
                  month: "short",
                  day: "numeric",
                })
              }
            />
            <ChartTooltip
              cursor={false}
              content={
                <ChartTooltipContent
                  labelFormatter={(value) =>
                    new Date(value).toLocaleDateString("fr-FR", {
                      month: "short",
                      day: "numeric",
                    })
                  }
                  indicator="dot"
                />
              }
            />
            <Area
              dataKey="Montant vente"
              type="natural"
              fill="url(#fillMontantVente)"
              stroke="var(--color-primary)"
              stackId="a"
            />
            <Area
              dataKey="Nombre vente"
              type="natural"
              fill="url(#fillNombreVente)"
              stroke="var(--color-primary)"
              stackId="a"
            />
          </AreaChart>
        </ChartContainer>
      </CardContent>
    </Card>
  )
}
