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
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { useGetDashboardMetricsQuery } from "@/state/api";
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useParams } from "next/navigation"


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
  const {data: dashboardMetrics} = useGetDashboardMetricsQuery({ institution, startDate, endDate });
  const totalSales = dashboardMetrics?.saleProfitCount
  .filter(item => item.type === "Ventes")
  .reduce((sum, item) => sum + (item.amount || 0), 0);

const totalProfits = dashboardMetrics?.saleProfitCount
  .filter(item => item.type === "Profits")
  .reduce((sum, item) => sum + (item.amount || 0), 0);

const totalInvoices = dashboardMetrics?.formattedData3
  .filter(item => item.type === "nombre de facture")
  .reduce((sum, item) => sum + (item.amount || 0), 0);

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
  <div className="grid gap-4 grid-cols-1 md:grid-cols-2 lg:grid-cols-3">

        <Suspense fallback={<LoadingBox />}>
        
        <DashboardCard title="Produits">
          <>
          <div className="overflow-auto h-full">
            {dashboardMetrics?.popularProducts?.map((product:any) => (
              <div key={product.id} className="flex intems-center justify-between gap-3 px-5 py7 border-b">
                <div className="flex items-center gap-3">
                <div className="flex flex-col justify-between gap-1">
                  <div className="font-semibold text-sm text-gray-700">{product.designation}</div>
                  <div className="flex text-sm items-center">
                      <span className="font-bold text-blue-500 text-xs">
                        €{product.sellingPriceTTC}
                      </span>
                    </div>
                </div>
                </div>
                <div className="text-xs flex items-center">
                  <button className="p-2 rounded-full bg-blue-100 text-blue-600 mr-2">
                    <ShoppingBag className="w-4 h-4" />
                  </button>
                  {Math.round(product.quantity / 10)} vendu
                </div>  
              </div>
            ))}
          </div>
          </>
        </DashboardCard>
        </Suspense>
        <Suspense fallback={<LoadingBox />}>
          <DashboardCard title="Bénéfices">
          <div className="text-2xl font-medium">
          <div>
            {/* BODY HEADER */}
            <div className="flex justify-between items-center mb-6 px-7 mt-5">
              <div className="text-lg font-medium">
                <p className="text-xs text-gray-400">Valeur</p>
                <span className="text-2xl font-extrabold">{totalProfits?.toLocaleString() ?? "0"} FCFA</span>
                <span className="text-green-500 text-sm ml-2">
                  <TrendingUp className="inline w-4 h-4 mr-1" />
                  5.78%
                </span>
              </div>
            </div>
            {/* CHART */}
            
          </div>
            </div>
          </DashboardCard>
        </Suspense>
        {/* //href={`/${institution}/sales/all`}  */}
        <DashboardCard title="Nombre de ventes">
  <div className="px-7 mt-5">
    <p className="text-xs text-gray-400">Factures générées</p>
    <span className="text-2xl font-extrabold text-yellow-600">
      {totalInvoices?.toLocaleString() ?? "0"}
    </span>
  </div>
</DashboardCard>

<DashboardCard title="Total des ventes">
  <div className="px-7 mt-5">
    <p className="text-xs text-gray-400">Montant total</p>
    <span className="text-2xl font-extrabold text-blue-600">
      {totalSales?.toLocaleString() ?? "0"} F CFA
    </span>
  </div>
</DashboardCard>

        <DashboardCard title="Les Avoirs">
        <div className="px-7 mt-5">
          <p className="text-xs text-gray-400">Total des avoirs</p>
          <span className="text-2xl font-extrabold text-blue-600">
            {dashboardMetrics?.totalAvailableCredit?.toLocaleString() ?? "0"} F CFA
          </span>
        </div>
        </DashboardCard>
        
        <DashboardCard
          
          title="Employés"
        >
          {/* {dashboardMetrics?.popularUsers.map((user) => ( */}
          <div className="px-7 mt-5">
    <p className="text-xs text-gray-400">Total utilisateurs</p>
    <span className="text-2xl font-extrabold text-blue-600">
      {dashboardMetrics?.totalUsers.toLocaleString() ?? "0"} 
    </span>
  </div>
          {/* ))} */}
        </DashboardCard>

        
      </div>
        );

        const StaffDashboard = ({ dashboardMetrics, totalSales, totalInvoices }: any) => (
          <div className="grid gap-4 grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
            <DashboardCard title="Total des ventes">
              <div className="text-2xl font-medium">
                <p className="text-xs text-gray-400">Montant total</p>
                <span className="text-2xl font-extrabold text-blue-600">
                  {totalSales?.toLocaleString() ?? "0"} FCFA
                </span>
              </div>
            </DashboardCard>
        
            <DashboardCard title="Nombre de factures">
              <div className="text-2xl font-medium">
                <p className="text-xs text-gray-400">Factures générées</p>
                <span className="text-2xl font-extrabold text-yellow-600">
                  {totalInvoices?.toLocaleString() ?? "0"}
                </span>
              </div>
            </DashboardCard>
          </div>
        );

        const ClientDashboard = ({ dashboardMetrics, totalSales, totalProfits, totalInvoices }: any) => (
          
            
          <div className="grid gap-4 grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
           
            <DashboardCard title="Mes Avoirs disponibles">
              <div className="px-7 mt-5">
                <p className="text-xs text-gray-400">Total des crédits disponibles</p>
                <span className="text-2xl font-extrabold text-green-500">
                  {dashboardMetrics?.customerStats?.avoirDisponible?.toLocaleString() ?? "0"} FCFA
                </span>
              </div>
            </DashboardCard>
            <DashboardCard title="Total des Achats">
              <div className="px-7 mt-5">
                <p className="text-xs text-gray-400">Montant total des Achats</p>
                  <span className="text-2xl font-extrabold text-blue-600">
                  {dashboardMetrics?.customerStats?.totalAchats?.toLocaleString() ?? "0"} FCFA
                  </span>
              </div>
            </DashboardCard>
            <DashboardCard title="Nombre de Commandes">
              <div className="px-7 mt-5">
                <p className="text-xs text-gray-400">Nombre de commandes</p>
                  <span className="text-2xl font-extrabold text-yellow-600">
                  {dashboardMetrics?.customerStats?.nombreCommandes?.toLocaleString() ?? "0"}
                  </span>
              </div>
            </DashboardCard>
            <DashboardCard title="Nombre de Commandes Impayées">
              <div className="px-7 mt-5">
                <p className="text-xs text-gray-400">Nombre de commandes Impayées</p>
                  <span className="text-2xl font-extrabold text-yellow-600">
                  {dashboardMetrics?.customerStats?.nombreCommandesImpaye?.toLocaleString() ?? "0"}
                  </span>
              </div>
            </DashboardCard>
          </div>
        );

const DashboardCard = ({
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
);

