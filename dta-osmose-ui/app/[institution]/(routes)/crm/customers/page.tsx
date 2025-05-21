"use client"

import React from "react";
import Container from "../../components/ui/Container";
//import UserPage from "./table/page";
import { redirect } from 'next/navigation';
import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { columns } from "../../crm/customers/table/components/columns"
import { DataTable } from "../../crm/customers/table/components/data-table"
import { useGetCustomersQuery } from "@/state/api"
import { useParams } from "next/navigation"

const CustomersPage = () => {
  const router = useRouter();
  const { institution } = useParams() as { institution: string }
  const token = typeof window !== 'undefined' ? localStorage.getItem('accessToken') : null;
  
  useEffect(() => {
    if (!token) {
      router.push(`/${institution}/sign-in`);
    }
  }, [token]);
const { data: customer, isLoading, isError } = useGetCustomersQuery()

if (isLoading) return <p>Chargement...</p>
if (isError) return <p>Erreur lors du chargement.</p>


  return (
    <Container
      title="Tableau des différents Clients"
      description="Ce composant affiche une vue d'ensemble des clients."
    >
    <div className="h-full w-full overflow-x-auto">
      <section className="overflow-hidden rounded-[0.5rem] border bg-background shadow-zinc-50">
      <div className="hidden h-full flex-1 flex-col space-y-8 p-8 md:flex">
      <div className="flex items-center justify-between space-y-2">
      <div>
        <h2 className="text-2xl font-bold tracking-tight">Hey! 👋🏽</h2>
        <p className="text-muted-foreground">
          Ici vous trouverez la liste de tous les clients enregistrés !
        </p>
      </div>
    </div>
    <DataTable data={customer || []} columns={columns} />
  </div>
        </section>
      </div>
    </Container>
  );
};

export default CustomersPage;