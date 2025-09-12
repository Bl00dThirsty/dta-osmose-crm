'use client';

import React, { useState, useEffect, useRef } from "react";
import { useRouter, useParams } from "next/navigation";
import { useGetCustomersQuery, useGetDashboardSalesQuery } from "@/state/api";
import { OverviewCards } from "./_components/overview-cards";
import { InsightCards } from "./_components/insight-cards";
import { OperationalCards } from "./_components/operational-cards";
import TopCustomersChart from "./_components/TopCustumersChart";
import ProductsChart from "./_components/ProductsChart";
import { Calendar } from "@/components/ui/calendar";

import { CalendarIcon } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import { DatePicker } from "./_components/date-picker";



// --- Page principale du Dashboard ---
const CrmDashboardPage = () => {
  const router = useRouter();
  const { institution } = useParams() as { institution: string };
  const token = typeof window !== "undefined" ? localStorage.getItem("accessToken") : null;
  const [date, setDate] = React.useState<Date | undefined>(new Date())

  const [startDate, setStartDate] = useState<Date>(() => {
    const date = new Date();
    date.setDate(date.getDate() - 7);
    return date;
  });
  const [endDate, setEndDate] = useState<Date>(new Date());

  const printRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!token) router.push("/sign-in");
  }, [token]);

  const { data: customersData } = useGetCustomersQuery();
  const [customerId, setCustomerId] = useState<string | null>(null);
  const { data: dashboardData, isLoading, error } = useGetDashboardSalesQuery(
    {
      institution,
      startDate: startDate.toISOString().split("T")[0],
      endDate: endDate.toISOString().split("T")[0],
      customerId: customerId ?? undefined
    },
    { skip: !startDate || !endDate, refetchOnMountOrArgChange: true }
  );

  const salesByCityFormatted = (dashboardData?.salesByCity || []).map(city => ({
    cityName: city.cityName,
    totalSales: city.totalSales ?? 0,
    totalQuantity: city.totalQuantity ?? 0,
    invoiceCount: city.invoiceCount ?? 0,
    percentage: city.percentage ?? 0,
    growth: city.growth ?? "+0%",
    isPositive: city.isPositive ?? true,
  }));

  if (isLoading) return <div>Chargement...</div>;
  if (error) return <div>Erreur lors du chargement des données</div>;

  return (
    <div className="flex flex-col gap-4 md:gap-6">
      {/* Calendriers StartDate / EndDate */}
      <div className="mb-4 flex gap-4">
         <DatePicker label="" date={startDate} onSelect={(d) => d && setStartDate(d)} />
        <DatePicker label="" date={endDate} onSelect={(d) => d && setEndDate(d)} />
      </div>

      <OverviewCards />

      <InsightCards
        topProducts={(dashboardData?.topProducts || []).map((p: any) => ({
          name: p.name ?? p.designation ?? "Inconnu",
          value: p.value ?? p.totalQuantity ?? 0,
        }))}
        lowProducts={(dashboardData?.lowProducts || []).map((p: any) => ({
          name: p.name ?? p.designation ?? "Inconnu",
          value: p.value ?? p.totalQuantity ?? 0,
        }))}
        isLoading={isLoading}
      />

      <OperationalCards salesByCity={salesByCityFormatted} isLoading={isLoading} />
      <TopCustomersChart data={dashboardData?.topCustomers || []} isLoading={isLoading} />
      <ProductsChart
        salesByProduct={dashboardData?.salesByProduct || []}
        salesByPharmacy={dashboardData?.salesByPharmacy || []}
        favoriteProductsByCustomer={dashboardData?.favoriteProductsByCustomer || []}
        isLoading={isLoading}
      />
    </div>
  );
};

export default CrmDashboardPage;
