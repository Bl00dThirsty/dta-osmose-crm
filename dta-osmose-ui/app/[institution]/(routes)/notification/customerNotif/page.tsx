"use client"

import React from "react";
import Container from "../../components/ui/Container";
import { useParams } from "next/navigation"
import { redirect } from 'next/navigation';
import { useEffect, useState } from 'react';
import { Button } from "@/components/ui/button"
import { useRouter } from 'next/navigation';
import { columns } from "../columns"
import { DataTable } from "../data-table"
import { useGetCustomerNotificationsQuery } from "@/state/api";

const NotificationAdmin = () => {
  const router = useRouter();
  const [open, setOpen] = useState(false);
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

  // useEffect(() => {
  //   if (!token) {
  //     router.push('/');
  //   }
  // }, [token]);

  const { data: NotificationCustomer, isLoading, isError } = useGetCustomerNotificationsQuery();

  

if (isLoading) return <p>Chargement...</p>
if (isError) return <p>Vous n'avez pas accès à ces informations. Erreur lors du chargement.</p>
//if (!NotificationCustomer) return <p>Chargement...</p>


  return (
    
    <Container
      title="Toutes vos notifications"
      description=""
    >
    <div className="h-full w-full overflow-x-auto">
      <section className="overflow-hidden rounded-[0.5rem] border bg-background shadow-zinc-50">
      <div className="h-full flex-1 flex-col space-y-8 p-8 md:flex">
      <div className="flex items-center justify-between space-y-2">
    </div>
    
      <DataTable data={NotificationCustomer || []} columns={columns} />     
   </div>
        </section>
      </div>
    </Container>


  );
};

export default NotificationAdmin;