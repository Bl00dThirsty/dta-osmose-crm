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
import { useGetSalesQuery } from '@/state/api';

const SalesPage = () => {
  const router = useRouter();
  const token = typeof window !== 'undefined' ? localStorage.getItem('accessToken') : null;
  const { institution } = useParams() as { institution: string }
  useEffect(() => {
    if (!token) {
      router.push('/sign-in');
    }
  }, [token]);
  const now = new Date();
  const firstDayOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
  const lastDayOfMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0);

  const [startDate, setStartDate] = useState<string>(firstDayOfMonth.toISOString().split("T")[0]);
  const [endDate, setEndDate] = useState<string>(lastDayOfMonth.toISOString().split("T")[0]);

const { data: sales, isLoading, isError } = useGetSalesQuery({ institution, startDate, endDate })

if (isLoading) return <p>Chargement...</p>
if (isError) return <p>Erreur lors du chargement.</p>


  return (
    <Container
      title="Tableau des Ventes"
      description="Ce composant affiche une vue d'ensemble des ventes effectuées."
    >
    <div className="h-full w-full overflow-x-auto">
      <section className="overflow-hidden rounded-[0.5rem] border bg-background shadow-zinc-50">
      <div className="hidden h-full flex-1 flex-col space-y-8 p-8 md:flex">
      <div className="flex items-center justify-between space-y-2">
      <div>
  
        <div className="flex space-x-4">
          <input
            type="date"
            value={startDate || ""}
            onChange={(e) => setStartDate(e.target.value)}
            className="border-5 p-2 rounded"
          />
          <input
            type="date"
            value={endDate || ""}
            onChange={(e) => setEndDate(e.target.value)}
            className="border-5 p-2 rounded"
          />
        </div>
        
      </div>
    </div>
    <DataTable data={sales || []} columns={columns} />
  </div>
        </section>
      </div>
    </Container>
  );
};

export default SalesPage;