"use client"

import React from "react";
import Container from "../components/ui/Container";
//import UserPage from "./table/page";
import { redirect } from 'next/navigation';
import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { columns } from "./table/columns"
import { DataTable } from "./table/data-table"
import { useGetRolesQuery } from "@/state/api"
import { ToastContainer, toast } from 'react-toastify';

const DesignationsPage = () => {
  const router = useRouter();
  const token = typeof window !== 'undefined' ? localStorage.getItem('accessToken') : null;
  const notify = () => toast("Wow so easy!");
  useEffect(() => {
    if (!token) {
      router.push('/');
    }
  }, [token]);
const { data: role, isLoading, isError } = useGetRolesQuery()

if (isLoading) return <p>Chargement...</p>
if (isError) return <p>Vous n'avez pas accès à ces informations. Erreur lors du chargement.</p>


  return (
    <Container
      title="Tableau des différents Rôles"
      description="Ce composant affiche une vue d'ensemble des roles possibles pour chaque utilisateur."
    >
    <div className="h-full w-full overflow-x-auto">
      <section className="overflow-hidden rounded-[0.5rem] border bg-background shadow-zinc-50">
      <div className="h-full flex-1 flex-col space-y-8 p-8 md:flex">
      <div className="flex items-center justify-between space-y-2">
      <div>
        <h2 className="text-2xl font-bold tracking-tight">Hey! 👋🏽</h2>
        <p className="text-muted-foreground">
          Ici vous trouverez la liste de tous les rôles créés !
        </p>
       
      </div>
    </div>
    <DataTable data={role || []} columns={columns} />
  </div>
        </section>
      </div>
    </Container>
  );
};

export default DesignationsPage;