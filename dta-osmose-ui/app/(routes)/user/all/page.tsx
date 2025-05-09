
// "use client"

// import Image from "next/image"


// import UserListPage from "./table/components/userall"
// import { useGetUsersQuery } from "@/state/api"

// import { labels } from "@/app/(routes)/crm/products/table/data/data"

// const ProductPage = () => {
// //   const { data: user, isLoading, isError } = useGetUsersQuery()

// //   if (isLoading) return <p>Chargement...</p>
// //   if (isError) return <p>Erreur lors du chargement.</p>

//   return (
//     <div className="hidden h-full flex-1 flex-col space-y-8 p-8 md:flex">
//       <div className="flex items-center justify-between space-y-2">
//         <div>
//           <h2 className="text-2xl font-bold tracking-tight">Hey! 👋🏽</h2>
//           <p className="text-muted-foreground">
//             Ici vous trouverez la liste de tous les produits enregistrés !
//           </p>
//         </div>
//       </div>
//       <UserListPage />
//     </div>
//   )
// }

// export default ProductPage;

"use client"

import React from "react";
import Container from "../../components/ui/Container";
import UserPage from "./table/page";
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
      title="Tableau des différents utilisateurs"
      description="En cours de développement... Ce composant affiche une vue d'ensemble des utilisateurs et employés définis et enregistrés."
    >
    <div className="h-full w-full overflow-x-auto">
      <section className="overflow-hidden rounded-[0.5rem] border bg-background shadow-zinc-50">
      <UserPage />
        </section>
      </div>
    </Container>
  );
};

export default UsersPage;