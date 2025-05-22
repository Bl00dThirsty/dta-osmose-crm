<<<<<<< HEAD
"use client";

import { Suspense } from "react";
import {
  DollarSignIcon,
  ShoppingBag,
  TrendingUp,
} from "lucide-react";
import Link from "next/link";

import Container from "./components/ui/Container";
import NotionsBox from "./components/dasboard/notions";
import LoadingBox from "./components/dasboard/loading-box";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { useGetDashboardMetricsQuery } from "@/state/api";

const DashboardPage = () => {
  const {data: dashboardMetrics} = useGetDashboardMetricsQuery();
  

  return (
    <Container
      title="Dashboard"
      description="Bienvenu sur le dashboard ici vous avez une vue d'ensemble de l'entreprise"
    >
  <div className="grid gap-4 grid-cols-1 md:grid-cols-2 lg:grid-cols-3">

        <Suspense fallback={<LoadingBox />}>
        <DashboardCard title="Produits">
          <>
          <div className="overflow-auto h-full">
            {dashboardMetrics?.popularProducts.map((product) => (
              <div key={product.id} className="flex intems-center justify-between gap-3 px-5 py7 border-b">
                <div className="flex items-center gap-3">
                <div className="flex flex-col justify-between gap-1">
                  <div className="font-semibold text-sm text-gray-700">{product.name}</div>
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
          <DashboardCard title="Revenu Attendu">
          <div className="text-2xl font-medium">
          <div>
            {/* BODY HEADER */}
            <div className="flex justify-between items-center mb-6 px-7 mt-5">
              <div className="text-lg font-medium">
                <p className="text-xs text-gray-400">Valeur</p>
                <span className="text-2xl font-extrabold">€ 100K</span>
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

        <DashboardCard href="/admin/users" title="Utilisateurs actifs">
        <div className="text-2xl font-medium"></div>
        </DashboardCard>
        <DashboardCard
          href="/employees"
          title="Employés"
        >
          <div className="text-2xl font-medium"></div>
        </DashboardCard>
        <DashboardCard
          href="/crm/accounts"
          title="Comptes"
        >
          <div className="text-2xl font-medium"></div>
        </DashboardCard>
        <DashboardCard
          href="/crm/opportunities"
          title="Opportunités"
        >
          <div className="text-2xl font-medium"></div>
        </DashboardCard>
        
      </div>
    </Container>
  );
};

export default DashboardPage;

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

=======
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
import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useParams } from "next/navigation"


const DashboardPage = () => {
  //const token = localStorage.getItem("accessToken");
  const { institution } = useParams() as { institution: string }
  const router = useRouter();
  const token = typeof window !== 'undefined' ? localStorage.getItem('accessToken') : null;

  useEffect(() => {
    if (!token) {
      router.push(`/${institution}/sign-in`);
    }
  }, [token]);

  
  const {data: dashboardMetrics} = useGetDashboardMetricsQuery();
  

  return (
    <Container
      title="Dashboard"
      description="Bienvenu sur le dashboard ici vous avez une vue d'ensemble de l'entreprise"
    >
  <div className="grid gap-4 grid-cols-1 md:grid-cols-2 lg:grid-cols-3">

        <Suspense fallback={<LoadingBox />}>
        <DashboardCard title="Produits">
          <>
          <div className="overflow-auto h-full">
            {dashboardMetrics?.popularProducts.map((product) => (
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
          <DashboardCard title="Revenu Attendu">
          <div className="text-2xl font-medium">
          <div>
            {/* BODY HEADER */}
            <div className="flex justify-between items-center mb-6 px-7 mt-5">
              <div className="text-lg font-medium">
                <p className="text-xs text-gray-400">Valeur</p>
                <span className="text-2xl font-extrabold">€ 100K</span>
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

        <DashboardCard href="/admin/users" title="Utilisateurs actifs">
        <div className="text-2xl font-medium"></div>
        </DashboardCard>
        
        <DashboardCard
          href="/user/all"
          title="Employés"
        >
          {/* {dashboardMetrics?.popularUsers.map((user) => ( */}
          <div className="text-2xl font-medium"></div>
          {/* ))} */}
        </DashboardCard>
        
        <DashboardCard
          href="/crm/accounts"
          title="Comptes"
        >
          <div className="text-2xl font-medium"></div>
        </DashboardCard>
        <DashboardCard
          href="/crm/opportunities"
          title="Opportunités"
        >
          <div className="text-2xl font-medium"></div>
        </DashboardCard>
        
      </div>
    </Container>
  );
};

export default DashboardPage;

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

>>>>>>> origin/yvana
