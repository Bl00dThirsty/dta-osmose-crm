"use client"

import React from "react";
import Container from "../../../../components/ui/Container";
//import UserPage from "./table/page";
import { redirect } from 'next/navigation';
import { useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { columns } from "./columns"
import { DataTable } from "./data-table"
import { useGetSaleByIdQuery } from "@/state/api"
import {
  ArrowLeft,
  
} from "lucide-react";

const DesignationsPage = () => {
  const router = useRouter();
  const token = typeof window !== 'undefined' ? localStorage.getItem('accessToken') : null;
  const params = useParams();
  const id = params?.id as string;
  useEffect(() => {
    if (!token) {
      router.push('/');
    }
  }, [token]);
  const { data: sale, isLoading } = useGetSaleByIdQuery(id);
  const handleGoBack = () => {
    router.back();
  };

if (isLoading) return <p>Chargement...</p>

  return (
    
    <Container
      title={`Liste des Réclamations de la commande N°: ${sale?.invoiceNumber}`}
      description=""
    >
      <div className="mb-3 ml-4 pt-4">
              <button
                onClick={handleGoBack}
                className="flex items-center gap-2 text-white-600 hover:bg-blue-500 transition-colors bg-blue-800 px-2 py-1 rounded"
              >
                <ArrowLeft className="w-5 h-5" />
                <span>Retour</span>
              </button>
            </div>
    <div className="h-full w-full overflow-x-auto">
      <section className="overflow-hidden rounded-[0.5rem] border bg-background shadow-zinc-50">
      <div className="hidden h-full flex-1 flex-col space-y-8 p-8 md:flex">
      
    <DataTable data={sale?.claims || []} columns={columns} />
  </div>
        </section>
      </div>
    </Container>
  );
};

export default DesignationsPage;