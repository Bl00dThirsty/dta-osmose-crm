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
import { useGetClaimQuery } from '@/state/api';
import { DatePicker } from "../../crm/dashboard/_components/date-picker";

const ClaimsPage = () => {
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

  const [startDate, setStartDate] = useState<Date | undefined>(firstDayOfMonth);
    const [endDate, setEndDate] = useState<Date | undefined>(lastDayOfMonth);

const { data: claims, isLoading, isError } = useGetClaimQuery({ institution,
   startDate: startDate ? startDate.toISOString() : undefined,
    endDate: endDate ? endDate.toISOString(): undefined  })

if (isLoading) return <p>Chargement...</p>
if (isError) return <p>Erreur lors du chargement.</p>


  return (
    <Container
      title="Tableau des Réclamations"
      description="Ce composant affiche une vue d'ensemble des demandes de retour en stock."
    >
    <div className="h-full w-full overflow-x-auto">
      <section className="overflow-hidden rounded-[0.5rem] border bg-background shadow-zinc-50">
      <div className="h-full flex-1 flex-col space-y-8 p-8 md:flex">
      <div className="flex items-center justify-between space-y-2">
      <div>
  
        <div className="flex space-x-4">
          <DatePicker label="" date={startDate} onSelect={(d) => d && setStartDate(d)} />
          <DatePicker label="" date={endDate} onSelect={(d) => d && setEndDate(d)} />
        </div>
        
      </div>
    </div>
    <DataTable data={claims || []} columns={columns} />
  </div>
        </section>
      </div>
    </Container>
  );
};

export default ClaimsPage;