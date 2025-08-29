"use client"

import React from "react";
import Container from "../../components/ui/Container";
//import UserPage from "./table/page";
import { redirect } from 'next/navigation';
import { useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { columns } from "./columns"
import { DataTable } from "./data-table"
import { useGetAllPromotionsQuery } from "@/state/api"

const PromotionsPage = () => {
  const router = useRouter();
  const { institution } = useParams() as { institution: string }
  const token = typeof window !== 'undefined' ? localStorage.getItem('accessToken') : null;

  useEffect(() => {
    if (!token) {
      router.push('/');
    }
  }, [token]);
const { data: Allpromotions, isLoading, isError } = useGetAllPromotionsQuery({institution})

if (isLoading) return <p>Chargement...</p>
if (isError) return <p>Erreur lors du chargement.</p>


  return (
    <Container
      title="Tableau des Promotions🔥"
      description="Ce composant affiche une vue d'ensemble des Promotions enregistrés ceux en cours, déja terminée et inactif."
    >
    <div className="h-full w-full overflow-x-auto">
      <section className="overflow-hidden rounded-[0.5rem] border bg-background shadow-zinc-50">
      <div className="h-full flex-1 flex-col space-y-8 p-8 md:flex">
      <div className="flex items-center justify-between space-y-2">
      <div>
        <h2 className="text-2xl font-bold tracking-tight">Hey! 👋🏽</h2>
        {/* <p className="text-muted-foreground">
          Ici vous trouverez la liste de tous les departements enregistrés !
        </p> */}
      </div>
    </div>
    <DataTable data={Allpromotions || []} columns={columns} />
  </div>
        </section>
      </div>
    </Container>
  );
};

export default PromotionsPage;