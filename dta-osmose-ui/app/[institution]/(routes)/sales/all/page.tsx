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
import { useGetSalesQuery } from '@/state/api';

const SalesPage = () => {
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

  const [startDate, setStartDate] = useState<string>(firstDayOfMonth.toISOString().split("T")[0]);
  const [endDate, setEndDate] = useState<string>(lastDayOfMonth.toISOString().split("T")[0]);

const { data: sales, isLoading, isError } = useGetSalesQuery({ institution, startDate, endDate })

if (isLoading) return <p>Chargement...</p>
if (isError) return <p>Erreur lors du chargement.</p>


  return (
    <Container
      title="Tableau des Ventes"
      description="Ce composant affiche une vue d'ensemble des ventes effectuées."
    >
    <div className="h-full w-full overflow-x-auto">
      <section className="overflow-hidden rounded-[0.5rem] border bg-background shadow-zinc-50">
      <div className="h-full flex-1 flex-col space-y-8 p-8 md:flex">
      <div className="flex items-center justify-between space-y-2">
      <div>
  
        <div className="flex space-x-4">
          <input
            type="date"
            value={startDate || ""}
            onChange={(e) => setStartDate(e.target.value)}
            className="border-5 p-2 rounded"
          />
          <input
            type="date"
            value={endDate || ""}
            onChange={(e) => setEndDate(e.target.value)}
            className="border-5 p-2 rounded"
          />
        </div>
        
      </div>
    </div>
    <DataTable data={sales || []} columns={columns} />
  </div>
        </section>
      </div>
    </Container>
  );
};

export default SalesPage;
// "use client";

// import { useGetSalesQuery } from '@/state/api';
// import Link from "next/link";
// import { useParams } from "next/navigation"
// import { useEffect, useState } from "react"

// const SalesPage = () => {
//   const { institution } = useParams() as { institution: string }
//   const { data: sales = [], isLoading } = useGetSalesQuery({ institution });
//   const [page, setPage] = useState(1)
//   const [total, setTotal] = useState(0)

//   const limit = 10
//   const skip = (page - 1) * limit
  

//   return (
//     <div className="container mx-auto p-4">
//       <h1 className="text-2xl font-bold mb-6">Historique des Ventes</h1>
      
//       <div className="bg-gray rounded-lg shadow overflow-hidden">
//         <table className="w-full">
//           <thead className="bg-white-50">
//             <tr>
//               <th className="px-6 py-3 text-left">N° Facture</th>
//               <th className="px-6 py-3 text-left">Date</th>
//               <th className="px-6 py-3 text-left">Client</th>
//               <th className="px-6 py-3 text-left">Vendeur</th>
//               <th className="px-6 py-3 text-right">Montant</th>
//               <th className="px-6 py-3 text-right">Actions</th>
//             </tr>
//           </thead>
//           <tbody className="divide-y divide-gray-200">
//             {sales.map(sale => (
//               <tr key={sale.id}>
//                 <td className="px-6 py-4">{sale.invoiceNumber}</td>
//                 <td className="px-6 py-4">{new Date(sale.createdAt).toLocaleDateString()}</td>
//                 <td className="px-6 py-4">{sale.customer.name}</td>
//                 <td className="px-6 py-4">{sale.user.firstName} {sale.user.lastName}</td>
//                 <td className="px-6 py-4 text-right">{sale.finalAmount} FCFA</td>
//                 <td className="px-6 py-4 text-right">
//                   <Link href={`/sales/${sale.id}`} className="text-blue-600 hover:text-blue-800">
//                     Voir
//                   </Link>
//                 </td>
//               </tr>
//             ))}
//           </tbody>
//         </table>
//       </div>
//     </div>
//   );
// };

// export default SalesPage;