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
import { useGetSalePromiseQuery, useGetSalePromiseByCustomerQuery } from '@/state/api';
import { DatePicker } from "../../crm/dashboard/_components/date-picker";

const SalesPage = () => {
  const router = useRouter();
  const token = typeof window !== 'undefined' ? localStorage.getItem('accessToken') : null;
  const { institution } = useParams() as { institution: string }
  useEffect(() => {
    if (!token) {
      router.push('/');
    }
  }, [token]);
  const now = new Date();
  const firstDayOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
  const lastDayOfMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0);

  const [startDate, setStartDate] = useState<Date>(firstDayOfMonth);
  const [endDate, setEndDate] = useState<Date>(lastDayOfMonth);
  const userRole = typeof window !== 'undefined' ? localStorage.getItem('role') : null;
  const isParticulier = userRole === "Particulier";

const { data: sales, isLoading, isError } = useGetSalePromiseQuery({
  institution,
  startDate: startDate.toISOString().split("T")[0],
  endDate: endDate.toISOString().split("T")[0]
});
const { data: PromiseCustomer } = useGetSalePromiseByCustomerQuery({
  startDate: startDate.toISOString().split("T")[0],
  endDate: endDate.toISOString().split("T")[0]
});

if (isLoading) return <p>Chargement...</p>
if (isError) return <p>Vous n'avez pas accès à ces informations. Erreur lors du chargement.</p>


  return (
    <Container
      title="Tableau des Promesses d'Achat"
      description="Ce composant affiche une vue d'ensemble des ventes effectuées."
    >
      <div className="h-full flex-1 flex-col space-y-8 p-8 md:flex">
      <div className="flex items-center justify-between space-y-2">
      <div>
  
        <div className="flex space-x-4">
          <DatePicker label="" date={startDate} onSelect={(d) => d && setStartDate(d)} />
          <DatePicker label="" date={endDate} onSelect={(d) => d && setEndDate(d)} />
        </div>
        
      </div>
    </div>
    {!isParticulier && (
      <DataTable data={sales || []} columns={columns} />
    )}
    {isParticulier && (
      <DataTable data={PromiseCustomer || []} columns={columns} />
    )}
        </div>
    </Container>
  );
};

export default SalesPage;
