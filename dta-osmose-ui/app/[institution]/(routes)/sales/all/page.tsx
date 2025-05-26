// pages/sales/index.tsx
"use client";

import { useGetSalesQuery } from '@/state/api';
import Link from "next/link";
import { useParams } from "next/navigation"

const SalesPage = () => {
  const { institution } = useParams() as { institution: string }
  const { data: sales = [], isLoading } = useGetSalesQuery({ institution });

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-6">Historique des Ventes</h1>
      
      <div className="bg-gray rounded-lg shadow overflow-hidden">
        <table className="w-full">
          <thead className="bg-white-50">
            <tr>
              <th className="px-6 py-3 text-left">N° Facture</th>
              <th className="px-6 py-3 text-left">Date</th>
              <th className="px-6 py-3 text-left">Client</th>
              <th className="px-6 py-3 text-left">Vendeur</th>
              <th className="px-6 py-3 text-right">Montant</th>
              <th className="px-6 py-3 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {sales.map(sale => (
              <tr key={sale.id}>
                <td className="px-6 py-4">{sale.invoiceNumber}</td>
                <td className="px-6 py-4">{new Date(sale.createdAt).toLocaleDateString()}</td>
                <td className="px-6 py-4">{sale.customer.name}</td>
                <td className="px-6 py-4">{sale.user.firstName} {sale.user.lastName}</td>
                <td className="px-6 py-4 text-right">{sale.finalAmount} FCFA</td>
                <td className="px-6 py-4 text-right">
                  <Link href={`/sales/${sale.id}`} className="text-blue-600 hover:text-blue-800">
                    Voir
                  </Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default SalesPage;