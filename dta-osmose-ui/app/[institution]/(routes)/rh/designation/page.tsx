"use client"

import React from "react";
import Container from "../../components/ui/Container";
//import UserPage from "./table/page";
import { redirect } from 'next/navigation';
import { useEffect, useState } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { columns } from "./table/columns"
import { DataTable } from "./table/data-table"
import { useGetDesignationsQuery, useGetRolesQuery } from "@/state/api"

const DesignationsPage = () => {
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
    
const { data: designation, isLoading, isError } = useGetDesignationsQuery()

if (isLoading) return <p>Chargement...</p>
if (isError) return <p>Vous n'avez pas accès à ces informations. Erreur lors du chargement.</p>


  return (
    <Container
      title="Tableau des différents postes"
      description="Vue d'ensemble des postes définis et enregistrés de l'entreprise."
    >
    <div className="h-full w-full overflow-x-auto">
      <section className="overflow-hidden rounded-[0.5rem] border bg-background shadow-zinc-50">
      <div className="hidden h-full flex-1 flex-col space-y-8 p-8 md:flex">
      <div className="flex items-center justify-between space-y-2">
      <div>
        <h2 className="text-2xl font-bold tracking-tight">Hey! 👋🏽</h2>
        <p className="text-muted-foreground">
          Ici vous trouverez la liste de tous les postes enregistrés !
        </p>
      </div>
    </div>
    <DataTable data={designation || []} columns={columns} />
  </div>
        </section>
      </div>
    </Container>
  );
};

export default DesignationsPage;