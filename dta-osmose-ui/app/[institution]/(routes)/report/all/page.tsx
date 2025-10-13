// pages/sales/index.tsx

"use client"

import React from "react";
import Container from "../../components/ui/Container";
import { useParams } from "next/navigation"
import { redirect } from 'next/navigation';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { columns } from "./columns"
import { DataTable } from "./data-table"
import { useGetReportQuery, useGetReportByStaffQuery } from '@/state/api';
import { DatePicker } from "@/components/ui/date-picker";

const ReportsPage = () => {
  const router = useRouter();
  const { institution } = useParams() as { institution: string }
  const [token, setToken] = useState<string | null>(null);
    useEffect(() => {
      // Tout ce code ne s'exécute QUE côté client
      const accessToken = localStorage.getItem('accessToken');
      setToken(accessToken);
  
      if (!accessToken) {
        router.push(`/${institution}/sign-in`);
      }
    }, [router, institution]); // token retiré des dépendances
  const now = new Date();
  const firstDayOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
  const lastDayOfMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0);

  const [startDate, setStartDate] = useState<string>(firstDayOfMonth.toISOString().split("T")[0]);
  const [endDate, setEndDate] = useState<string>(lastDayOfMonth.toISOString().split("T")[0]);
  const [userRole, setUserRole] = useState<string | null>(null);

    useEffect(() => {
      setUserRole(localStorage.getItem('role'));
    }, []);
  const isStaff = userRole === "staff";

const { data: report, isLoading, isError } = useGetReportQuery({ institution, startDate, endDate })
const { data: reportStaff } = useGetReportByStaffQuery({ startDate, endDate })

if (isLoading) return <p>Chargement...</p>
if (isError) return <p>Vous n'avez pas accès à ces informations. Erreur lors du chargement.</p>


  return (
    <Container
      title="Tableau des Rapports"
      description="Ce composant affiche une vue d'ensemble des rapports enregistrés."
    >
    <div className="h-full w-full overflow-x-auto">
      <section className="overflow-hidden rounded-[0.5rem] border bg-background shadow-zinc-50">
      <div className="h-full flex-1 flex-col space-y-8 p-8 md:flex">
      <div className="flex items-center justify-between space-y-2">
      <div>
  
        <div className="flex space-x-4">
          <DatePicker label="" date={new Date(startDate)} onSelect={(d) => d && setStartDate(d.toISOString().split("T")[0])} />
         <DatePicker label="" date={new Date(endDate)} onSelect={(d) => d && setEndDate(d.toISOString().split("T")[0])} />
        </div>
        
      </div>
    </div>
    {!isStaff && (
      <DataTable data={report || []} columns={columns} />
    )}
    {isStaff && (
      <DataTable data={reportStaff || []} columns={columns} />
    )}
  </div>
        </section>
      </div>
    </Container>
  );
};

export default ReportsPage;
