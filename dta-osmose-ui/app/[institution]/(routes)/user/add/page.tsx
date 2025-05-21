"use client"

import React from "react";
import Container from "../../components/ui/Container";
import RegisterComponent from "./components/adduser";
import { redirect } from 'next/navigation';
import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

const UsersPage = () => {
  const router = useRouter();
  const token = typeof window !== 'undefined' ? localStorage.getItem('accessToken') : null;

  useEffect(() => {
    if (!token) {
      router.push('/sign-in');
    }
  }, [token]);


  return (
    <Container
      title="Ajout des utilisateurs"
      description="En cours de développement... Ce composant affiche le formulaire d'ajout des utilisateurs."
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