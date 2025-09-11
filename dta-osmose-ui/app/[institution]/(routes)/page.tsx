"use client";

import { Suspense, useRef } from "react";
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
//import { getDynamicTrend } from "@/lib/utils";
import { getDynamicTrend } from "@/lib/trendUtils";


const DashboardPage = () => {
  //const token = localStorage.getItem("accessToken");`/${institution}/sign-in`
  const { institution } = useParams() as { institution: string }
  const router = useRouter();
  const now = new Date();
  const firstDayOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
  const lastDayOfMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0);
//Calcul des p riodes compar es
  const [previousStartDate, setPreviousStartDate] = useState(() => {
  const start = new Date(firstDayOfMonth);
  start.setMonth(start.getMonth() - 1);
  return start.toISOString().split("T")[0];
});

const [previousEndDate, setPreviousEndDate] = useState(() => {
  const end = new Date(lastDayOfMonth);
  end.setMonth(end.getMonth() - 1);
  return end.toISOString().split("T")[0];
});

// R f rencement du conteneur   imprimer
  const printRef = useRef<HTMLDivElement>(null);

  const [startDate, setStartDate] = useState<string>(firstDayOfMonth.toISOString().split("T")[0]);
  const [endDate, setEndDate] = useState<string>(lastDayOfMonth.toISOString().split("T")[0]);
  const token = typeof window !== 'undefined' ? localStorage.getItem('accessToken') : null;

  useEffect(() => {
    if (!token) {
      router.push(`/${institution}/sign-in`);
    }
  }, [token, institution]);

  const userType = typeof window !== 'undefined' ? localStorage.getItem('role') : null;

// R cup ration des m triques depuis l'API
  const { data: dashboardMetrics } = useGetDashboardMetricsQuery({ institution, startDate, endDate });

  // ? R cup ration des donn es actuelles
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
      .reduce((sum, item) => sum + (item.count || 0), 0)
  : 0;


// ? R cup ration des donn es pr c dentes
const previousSales = Array.isArray(dashboardMetrics?.previousMetrics?.saleProfitCount)
  ? dashboardMetrics.previousMetrics.saleProfitCount
      .filter(item => item.type === "Ventes")
      .reduce((sum, item) => sum + (item.amount || 0), 0)
  : 0;

const previousProfits = Array.isArray(dashboardMetrics?.previousMetrics?.saleProfitCount)
  ? dashboardMetrics.previousMetrics.saleProfitCount
      .filter(item => item.type === "Profits")
      .reduce((sum, item) => sum + (item.amount || 0), 0)
  : 0;

const previousInvoices = Array.isArray(dashboardMetrics?.previousMetrics?.formattedData3)
  ? dashboardMetrics.previousMetrics.formattedData3
      .filter(item => item.type === "nombre de facture")
      .reduce((sum, item) => sum + (item.count || 0), 0)
  : 0;


  // --- Total des avoirs et total pr c dent (ajout)
  const totalAvailableCredit = dashboardMetrics?.totalAvailableCredit ?? 0;
  const previousAvailableCredit = dashboardMetrics?.previousMetrics?.totalAvailableCredit ?? 0;

  // --- Extraction de l'objet tendance cr dits (optionnel, utile si tu veux utiliser les tendances venant du backend)
  const creditTrendObj = dashboardMetrics?.creditTrend ?? { trend: "", trendDirection: "" };

// ? Calcul des tendances
const { trend: salesTrend, trendDirection: salesTrendDirection } = getDynamicTrend(totalSales, previousSales);
const { trend: profitTrend, trendDirection: profitTrendDirection } = getDynamicTrend(totalProfits, previousProfits);
const { trend: invoiceTrend, trendDirection: invoiceTrendDirection } = getDynamicTrend(totalInvoices, previousInvoices);
const { trend: totalAvailableCreditTrend, trendDirection: totalAvailableCreditTrendDirection } = getDynamicTrend(totalAvailableCredit, previousAvailableCredit);


console.log("Institution:", institution);

// Fonction d impression
  const handlePrint = () => {
    if (printRef.current) {
      window.print();
    }
  };


  const renderDashboardByRole = () => {
    switch (userType) {
      case "admin":
        return <AdminDashboard
         institution={institution}
           dashboardMetrics={dashboardMetrics}
            totalSales={totalSales}
            totalProfits={totalProfits}
            totalInvoices={totalInvoices}
            salesTrend={salesTrend}
            salesTrendDirection={salesTrendDirection}
            profitTrend={profitTrend}
            profitTrendDirection={profitTrendDirection}
            invoiceTrend={invoiceTrend}
            invoiceTrendDirection={invoiceTrendDirection}
            totalAvailableCreditTrend={totalAvailableCreditTrend}
          totalAvailableCreditTrendDirection={totalAvailableCreditTrendDirection}
          chartData={dashboardMetrics?.chartData || []}
          />;
      case "staff":
        return <StaffDashboard
          dashboardMetrics={dashboardMetrics}
          totalSales={totalSales}
          totalInvoices={totalInvoices}
          salesTrend={salesTrend}
          salesTrendDirection={salesTrendDirection}
          invoiceTrend={invoiceTrend}
          invoiceTrendDirection={invoiceTrendDirection}
         totalAvailableCreditTrend={totalAvailableCreditTrend}
          totalAvailableCreditTrendDirection={totalAvailableCreditTrendDirection}
          chartData={dashboardMetrics?.chartData || []}
        />;
      case "Particulier":
        return <ClientDashboard dashboardMetrics={dashboardMetrics} 
     totalSales={totalSales} 
     totalProfits={totalProfits} 
     totalInvoices={totalInvoices} 
     totalAvailableCreditTrend={totalAvailableCreditTrend}   
     totalAvailableCreditTrendDirection={totalAvailableCreditTrendDirection} 
  />;
      default:
        return <p>R le non reconnu. Veuillez contacter l'administrateur.</p>;
    }
  };

  
  

  return (
    <Container
      title="Dashboard"
      description="Bienvenue sur le tableau de bord"
    >
      <div className="flex space-x-4 print:hidden mb-4">
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
        <button
          onClick={handlePrint}
          className="ml-auto bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded"
        >
          Imprimer le dashboard
        </button>
      </div>
      
       <div className="hidden print:block p-4" ref={printRef}>
  <h2 className="text-xl font-bold mb-4">Rapport du Dashboard</h2>

  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
    {/* B n fices */}
    <div>
      <strong>B n fices :</strong><br />
      {(totalProfits ?? 0).toLocaleString("fr-FR", {
        style: "currency",
        currency: "EUR",
      })} <br />
      {(Math.round((totalProfits ?? 0) * 655.957)).toLocaleString("fr-FR")} F CFA
    </div>

    {/* Nombre de ventes (factures) */}
    <div>
      <strong>Nombre de ventes :</strong><br />
      {totalInvoices?.toLocaleString() ?? "0"}
    </div>

    {/* Total des ventes */}
    <div>
      <strong>Total des ventes :</strong><br />
      {(totalSales ?? 0).toLocaleString("fr-FR", {
        style: "currency",
        currency: "EUR",
      })} <br />
      {(Math.round((totalSales ?? 0) * 655.957)).toLocaleString("fr-FR")} F CFA
    </div>

    {/* Total des avoirs */}
    <div>
      <strong>Total des avoirs :</strong><br />
      {(totalAvailableCredit ?? 0).toLocaleString("fr-FR", {
        style: "currency",
        currency: "EUR",
      })} <br />
      {(Math.round((totalAvailableCredit ?? 0) * 655.957)).toLocaleString("fr-FR")} F CFA
    </div>

    {/* Utilisateurs enregistr s */}
    <div>
      <strong>Utilisateurs enregistr s :</strong><br />
      {dashboardMetrics?.totalUsers?.toLocaleString() ?? "0"}
    </div>
  </div>

</div>

      <div className="print:hidden">
        {renderDashboardByRole()}
      </div>
    </Container>
  );
};

export default DashboardPage;
//const { institution } = useParams() as { institution: string }
const AdminDashboard = ({institution, dashboardMetrics,
  totalSales,
  totalProfits,
  totalInvoices,
  salesTrend,
  salesTrendDirection,
  profitTrend,
  profitTrendDirection,
  invoiceTrend,
  invoiceTrendDirection,
  totalAvailableCreditTrend,
  totalAvailableCreditTrendDirection,
  }: any) => (
<div className="@container/main flex flex-1 flex-col gap-2">
  <div className="flex flex-col gap-4 py-4 md:gap-6 md:py-6">
    <div className="*:data-[slot=card]:from-primary/5 *:data-[slot=card]:to-card dark:*:data-[slot=card]:bg-card grid grid-cols-1 gap-4 px-4 *:data-[slot=card]:bg-gradient-to-t *:data-[slot=card]:shadow-xs lg:px-6 @xl/main:grid-cols-2 @5xl/main:grid-cols-4">

  <DashboardCard
    title="Bénéfices"
    description="Bénéfices nets"
  value={
    <>
      <span className="text-sm">
        {(totalProfits ?? 0).toLocaleString("fr-FR", {
          style: "currency",
          currency: "EUR",
        })}
      </span>
      <br />
      <span className="text-sm">
        {(Math.round((totalProfits ?? 0) * 655.957)).toLocaleString("fr-FR")} F CFA
      </span>
    </>
  }
          trend={profitTrend}
          trendDirection={profitTrendDirection}
          footerTop="Comparaison dynamique"
          footerBottom="Par rapport à la période précédente"
  />

  <DashboardCard
    title="Nombre de ventes"
    description="Factures générées"
    value={totalInvoices?.toLocaleString() ?? "0"}
          trend={invoiceTrend}
          trendDirection={invoiceTrendDirection}
          footerTop="Comparaison dynamique"
          footerBottom="30 jours précédents"
  />

  <DashboardCard
  title="Total des ventes"
  description="Montant total"
  value={
    <>
      <span className="text-sm">
        {(totalSales ?? 0).toLocaleString("fr-FR", {
          style: "currency",
          currency: "EUR",
        })}
      </span>
      <br />
      <span className="text-sm">
        {(Math.round((totalSales ?? 0) * 655.957)).toLocaleString("fr-FR")} F CFA
      </span>
    </>
  }
          trend={salesTrend}
          trendDirection={salesTrendDirection}
          footerTop="Comparaison dynamique"
          footerBottom="Basé sur la période précédente"
/>



  <DashboardCard
    title="Les Avoirs"
    description="Total des avoirs"
  value={
    <>
      <span className="text-sm">
        {(dashboardMetrics?.totalAvailableCredit ?? 0).toLocaleString("fr-FR", {
          style: "currency",
          currency: "EUR",
        })}
      </span>
      <br />
      <span className="text-sm">
        {(Math.round((dashboardMetrics?.totalAvailableCredit ?? 0) * 655.957)).toLocaleString("fr-FR")} F CFA
      </span>
    </>
  }
     trend={totalAvailableCreditTrend}  // ? tendance dynamique calcul e
     trendDirection={totalAvailableCreditTrendDirection}
     footerTop="Comparaison dynamique"
     footerBottom="Par rapport à la période précédente"
  />

  <DashboardCard
    title="Employ s"
    description="Utilisateurs enregistrés"
    value={dashboardMetrics?.totalUsers?.toLocaleString() ?? "0"}
    footerTop="Recrutements récents"
    footerBottom="Inclut les utilisateurs actifs"
  />
    </div>
    <div className="px-4 lg:px-6">
          <ChartAreaInteractive institutionSlug={institution} />
    </div>
  </div>
</div>
);

        const StaffDashboard = ({ dashboardMetrics,
  totalSales,
  totalInvoices,
  salesTrend,
  salesTrendDirection,
  invoiceTrend,
  invoiceTrendDirection, }: any) => (
          <div className="@container/main flex flex-1 flex-col gap-2">
          <div className="flex flex-col gap-4 py-4 md:gap-6 md:py-6">
          <div className="*:data-[slot=card]:from-primary/5 *:data-[slot=card]:to-card dark:*:data-[slot=card]:bg-card grid grid-cols-1 gap-4 px-4 *:data-[slot=card]:bg-gradient-to-t *:data-[slot=card]:shadow-xs lg:px-6 @xl/main:grid-cols-2 @5xl/main:grid-cols-4">

                <DashboardCard
                  title="Total des ventes"
                  description="Montant total"
                  value={
                  <>
                    <span className="text-sm">
                      {(totalSales ?? 0).toLocaleString("fr-FR", {
                        style: "currency",
                        currency: "EUR",
                      })}
                    </span>
                    <br />
                    <span className="text-sm">
                      {(Math.round((totalSales ?? 0) * 655.957)).toLocaleString("fr-FR")} F CFA
              </span>
            </>
          }
          trend={salesTrend}
          trendDirection={salesTrendDirection}
          footerTop="Comparaison dynamique"
          footerBottom="Par rapport à la période précédente"
                />

                <DashboardCard
                  title="Nombre de ventes"
                  description="Factures générées"
                  trend={invoiceTrend}
                  trendDirection={invoiceTrendDirection}
                  footerTop="Comparaison dynamique"
                  footerBottom="Par rapport à la période précédente" value={undefined}                />
          </div>
          </div>
          </div>
        );
       const ClientDashboard = ({ dashboardMetrics,totalAvailableCreditTrend,
  totalAvailableCreditTrendDirection  }: any) => (
           <div className="@container/main flex flex-1 flex-col gap-2">
            <div className="flex flex-col gap-4 py-4 md:gap-6 md:py-6">
            <div className="*:data-[slot=card]:from-primary/5 *:data-[slot=card]:to-card dark:*:data-[slot=card]:bg-card grid grid-cols-1 gap-4 px-4 *:data-[slot=card]:bg-gradient-to-t *:data-[slot=card]:shadow-xs lg:px-6 @xl/main:grid-cols-2 @5xl/main:grid-cols-4">

            {/* Mes Avoirs disponibles */}
            <DashboardCard
              title="Mes Avoirs disponibles"
              description="Total des crédits disponibles"
               value={
                  <>
                    <span className="text-sm">
                      {(dashboardMetrics?.customerStats?.avoirDisponible ?? 0).toLocaleString("fr-FR", {
                        style: "currency",
                        currency: "EUR",
                      })}
                    </span>
                    <br />
                    <span className="text-sm">
        {(Math.round((dashboardMetrics?.totalAvailableCredit ?? 0) * 655.957)).toLocaleString("fr-FR")} F CFA
      </span>
    </>
  }
     trend={totalAvailableCreditTrend}  // ? tendance dynamique calcul e
     trendDirection={totalAvailableCreditTrendDirection}
     footerTop="Comparaison dynamique"
     footerBottom="Par rapport à la période précédente"
  />

            {/* Total des Achats */}
            <DashboardCard
              title="Total des Achats"
              description="Montant total des Achats"

              value={
                  <>
                    <span className="text-sm">
                      {(dashboardMetrics?.customerStats?.totalAchats ?? 0).toLocaleString("fr-FR", {
                        style: "currency",
                        currency: "EUR",
                      })}
                    </span>
                    <br />
                    <span className="text-sm">
                      {(Math.round((dashboardMetrics?.customerStats?.totalAchats ?? 0) * 655.957)).toLocaleString("fr-FR")} F CFA
                    </span>
                  </>
                }

              // Ajoute trend, trendDirection, footerTop, footerBottom si n cessaire
            />

            {/* Nombre de Commandes */}
            <DashboardCard
              title="Nombre de Commandes"
              description="Nombre total de commandes passées"
              value={`${dashboardMetrics?.customerStats?.nombreCommandes?.toLocaleString() ?? "0"}`}
              // Ajoute trend, trendDirection, footerTop, footerBottom si n cessaire
            />

            {/* Nombre de Commandes Impay es */}
            <DashboardCard
              title="Nombre de Commandes Impayées"
              description="Total des commandes en attente de paiement"
              value={`${dashboardMetrics?.customerStats?.nombreCommandesImpaye?.toLocaleString() ?? "0"}`}
              // Ajoute trend, trendDirection, footerTop, footerBottom si n cessaire
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
      <Card className="w-75 justify-between space-x-2">
        <CardHeader className="flex flex-row items-center justify-between space-y-1">
          <CardTitle className="text-lg font-semibold">{title}</CardTitle>
        </CardHeader>
        <hr />
        <CardContent>
          {children}
        </CardContent>
        <hr />
        <CardFooter>
          <h1>r sum  des infos</h1>
        </CardFooter>
      </Card>
    </Suspense>
  </Link>
);*/


