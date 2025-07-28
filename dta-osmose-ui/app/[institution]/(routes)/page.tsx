"use client";

import { Suspense } from "react";
import {
  DollarSignIcon,
  ShoppingBag,
  TrendingUp,
} from "lucide-react";
import Link from "next/link";

import Container from "../../[institution]/(routes)/components/ui/Container";
import NotionsBox from "../../[institution]/(routes)/components/dasboard/notions";
import LoadingBox from "../../[institution]/(routes)/components/dasboard/loading-box";
import {Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { useGetDashboardMetricsQuery } from "@/state/api";
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useParams } from "next/navigation"
import { DashboardCard } from "./components/dasboard/dashboard-card";
import { ChartAreaInteractive } from "./components/dasboard/chart-area-interactive";


const DashboardPage = () => {
  //const token = localStorage.getItem("accessToken");
  const { institution } = useParams() as { institution: string }
  const router = useRouter();
  const now = new Date();
  const firstDayOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
  const lastDayOfMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0);

  const [startDate, setStartDate] = useState<string>(firstDayOfMonth.toISOString().split("T")[0]);
  const [endDate, setEndDate] = useState<string>(lastDayOfMonth.toISOString().split("T")[0]);
  const token = typeof window !== 'undefined' ? localStorage.getItem('accessToken') : null;

  useEffect(() => {
    if (!token) {
      router.push(`/${institution}/sign-in`);
    }
  }, [token]);

  const userType = typeof window !== 'undefined' ? localStorage.getItem('role') : null;

const { data: dashboardMetrics } = useGetDashboardMetricsQuery({ institution, startDate, endDate });

const totalSales = Array.isArray(dashboardMetrics?.saleProfitCount)
  ? dashboardMetrics.saleProfitCount
      .filter(item => item.type === "Ventes")
      .reduce((sum, item) => sum + (item.amount || 0), 0)
  : 0;

const totalProfits = Array.isArray(dashboardMetrics?.saleProfitCount)
  ? dashboardMetrics.saleProfitCount
      .filter(item => item.type === "Profits")
      .reduce((sum, item) => sum + (item.amount || 0), 0)
  : 0;

const totalInvoices = Array.isArray(dashboardMetrics?.formattedData3)
  ? dashboardMetrics.formattedData3
      .filter(item => item.type === "nombre de facture")
      .reduce((sum, item) => sum + (item.amount || 0), 0)
  : 0;
  const renderDashboardByRole = () => {
    switch (userType) {
      case "admin":
        return <AdminDashboard dashboardMetrics={dashboardMetrics} totalSales={totalSales} totalProfits={totalProfits} totalInvoices={totalInvoices} />;
      case "staff":
        return <StaffDashboard dashboardMetrics={dashboardMetrics} totalSales={totalSales} totalInvoices={totalInvoices} />;
      case "Particulier":
        return <ClientDashboard dashboardMetrics={dashboardMetrics} totalSales={totalSales} totalProfits={totalProfits} totalInvoices={totalInvoices}  />;
      default:
        return <p>Rôle non reconnu. Veuillez contacter l'administrateur.</p>;
    }
  };
  

  return (
    <Container
      title="Dashboard"
      description="Bienvenue sur le tableau de bord"
    >
      <div className="flex space-x-4">
          <input
            type="date"
            value={startDate || ""}
            onChange={(e) => setStartDate(e.target.value)}
            className="border-5 p-1 rounded"
          />
          <input
            type="date"
            value={endDate || ""}
            onChange={(e) => setEndDate(e.target.value)}
            className="border-5 p-2 rounded"
          />
        </div>
        {renderDashboardByRole()}
        
    </Container>
  );
};

export default DashboardPage;
//const { institution } = useParams() as { institution: string }
const AdminDashboard = ({ dashboardMetrics, totalSales, totalProfits, totalInvoices }: any) => (
<div className="@container/main flex flex-1 flex-col gap-2">
  <div className="flex flex-col gap-4 py-4 md:gap-6 md:py-6">
    <div className="*:data-[slot=card]:from-primary/5 *:data-[slot=card]:to-card dark:*:data-[slot=card]:bg-card grid grid-cols-1 gap-4 px-4 *:data-[slot=card]:bg-gradient-to-t *:data-[slot=card]:shadow-xs lg:px-6 @xl/main:grid-cols-2 @5xl/main:grid-cols-4">

  <DashboardCard
    title="Bénéfices"
    description="Bénéfices nets"
    value={`${totalProfits?.toLocaleString() ?? "0"} F CFA`}
    trend="+5.78%"
    trendDirection="up"
    footerTop="Tendance positive"
    footerBottom="Comparé au mois dernier"
  />

  <DashboardCard
    title="Nombre de ventes"
    description="Factures générées"
    value={totalInvoices?.toLocaleString() ?? "0"}
    trend="+3.1%"
    trendDirection="up"
    footerTop="Croissance stable"
    footerBottom="30 derniers jours"
  />

  <DashboardCard
    title="Total des ventes"
    description="Montant total"
    value={`${totalSales?.toLocaleString() ?? "0"} F CFA`}
    trend="+5.2%"
    trendDirection="up"
    footerTop="En hausse ce mois-ci"
    footerBottom="Basé sur les ventes mensuelles"
  />

  <DashboardCard
    title="Les Avoirs"
    description="Total des avoirs"
    value={`${dashboardMetrics?.totalAvailableCredit?.toLocaleString() ?? "0"} F CFA`}
    trend="+1.8%"
    trendDirection="up"
    footerTop="Utilisation modérée"
    footerBottom="Valeur cumulée"
  />

  <DashboardCard
    title="Employés"
    description="Utilisateurs enregistrés"
    value={dashboardMetrics?.totalUsers?.toLocaleString() ?? "0"}
    trend="+2.4%"
    trendDirection="up"
    footerTop="Recrutements récents"
    footerBottom="Inclut les utilisateurs actifs"
  />
    </div>
    <div className="px-4 lg:px-6">
          <ChartAreaInteractive institutionSlug="iba" />
    </div>
  </div>
</div>
);

        const StaffDashboard = ({ dashboardMetrics, totalSales, totalInvoices }: any) => (
          <div className="@container/main flex flex-1 flex-col gap-2">
          <div className="flex flex-col gap-4 py-4 md:gap-6 md:py-6">
          <div className="*:data-[slot=card]:from-primary/5 *:data-[slot=card]:to-card dark:*:data-[slot=card]:bg-card grid grid-cols-1 gap-4 px-4 *:data-[slot=card]:bg-gradient-to-t *:data-[slot=card]:shadow-xs lg:px-6 @xl/main:grid-cols-2 @5xl/main:grid-cols-4">

                <DashboardCard
                  title="Total des ventes"
                  description="Montant total"
                  value={`${totalSales?.toLocaleString() ?? "0"} F CFA`}
                  trend="+5.2%"
                  trendDirection="up"
                  footerTop="En hausse ce mois-ci"
                  footerBottom="Basé sur les ventes mensuelles"
                />

                <DashboardCard
                  title="Nombre de ventes"
                  description="Factures générées"
                  value={totalInvoices?.toLocaleString() ?? "0"}
                  trend="+3.1%"
                  trendDirection="up"
                  footerTop="Croissance stable"
                  footerBottom="30 derniers jours"
                />
          </div>
          </div>
          </div>
        );
       const ClientDashboard = ({ dashboardMetrics }: any) => (
           <div className="@container/main flex flex-1 flex-col gap-2">
            <div className="flex flex-col gap-4 py-4 md:gap-6 md:py-6">
            <div className="*:data-[slot=card]:from-primary/5 *:data-[slot=card]:to-card dark:*:data-[slot=card]:bg-card grid grid-cols-1 gap-4 px-4 *:data-[slot=card]:bg-gradient-to-t *:data-[slot=card]:shadow-xs lg:px-6 @xl/main:grid-cols-2 @5xl/main:grid-cols-4">

            {/* Mes Avoirs disponibles */}
            <DashboardCard
              title="Mes Avoirs disponibles"
              description="Total des crédits disponibles"
              value={`${dashboardMetrics?.customerStats?.avoirDisponible?.toLocaleString() ?? "0"} FCFA`}

              // For example:
              // trend="+5%"
              // trendDirection="up"
              // footerTop="Mis à jour le 09/07/2025"
              // footerBottom="Crédit client"
            />

            {/* Total des Achats */}
            <DashboardCard
              title="Total des Achats"
              description="Montant total des Achats"
              value={`${dashboardMetrics?.customerStats?.totalAchats?.toLocaleString() ?? "0"} FCFA`}
              // Ajoute trend, trendDirection, footerTop, footerBottom si nécessaire
            />

            {/* Nombre de Commandes */}
            <DashboardCard
              title="Nombre de Commandes"
              description="Nombre total de commandes passées"
              value={`${dashboardMetrics?.customerStats?.nombreCommandes?.toLocaleString() ?? "0"}`}
              // Ajoute trend, trendDirection, footerTop, footerBottom si nécessaire
            />

            {/* Nombre de Commandes Impayées */}
            <DashboardCard
              title="Nombre de Commandes Impayées"
              description="Total des commandes en attente de paiement"
              value={`${dashboardMetrics?.customerStats?.nombreCommandesImpaye?.toLocaleString() ?? "0"}`}
              // Ajoute trend, trendDirection, footerTop, footerBottom si nécessaire
            />
  </div>
  </div>
  </div>
);
/*const DashboardCard = ({
  href,
  title,
  children,
}: {
  href?: string;
  title: string;
  children: React.ReactNode;
}) => (
  <Link href={href || "#"}>
    <Suspense fallback={<LoadingBox />}>
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-1">
          <CardTitle className="text-lg font-semibold">{title}</CardTitle>
        </CardHeader>
        <hr />
        <CardContent>
          {children}
        </CardContent>
        <hr />
        <CardFooter>
          <h1>résumé des infos</h1>
        </CardFooter>
      </Card>
    </Suspense>
  </Link>
);*/

