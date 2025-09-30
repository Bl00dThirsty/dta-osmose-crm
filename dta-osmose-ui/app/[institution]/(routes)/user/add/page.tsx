"use client"

import React from "react";
import Container from "../../components/ui/Container";
import RegisterComponent from "./components/adduser";
import { redirect } from 'next/navigation';
import { useEffect, useState } from 'react';
import { useRouter, useParams } from 'next/navigation';

const UsersPage = () => {
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
   }, [router, institution]);


  return (
    <Container
      title="Ajout des utilisateurs"
      description="Formulaire d'ajout des utilisateurs."
    >
    <div className="h-full w-full overflow-x-auto">
      <section className="overflow-hidden rounded-[0.5rem] border bg-background shadow-zinc-50">
      <RegisterComponent/>
      </section>
      </div>
    </Container>
  );
};

export default UsersPage;