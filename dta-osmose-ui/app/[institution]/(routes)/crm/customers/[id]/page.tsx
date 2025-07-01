// src/app/customer/[id]/page.tsx
"use client"
import { useParams } from "next/navigation";
import { useGetCustomerByIdQuery } from "@/state/api"; 
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { format } from "date-fns"; // Pour formater les dates
import { DataTable } from "./data-table"
import { columns } from "./columns"

export default function DetailCustomerPage() {
  const router = useRouter();
  const { id } = useParams();
  const token = typeof window !== 'undefined' ? localStorage.getItem('accessToken') : null;

  const now = new Date();
  const firstDayOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
  const lastDayOfMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0);

  const [startDate, setStartDate] = useState<string>(firstDayOfMonth.toISOString().split("T")[0]);
  const [endDate, setEndDate] = useState<string>(lastDayOfMonth.toISOString().split("T")[0]);

  const { data: customer, isLoading, error } = useGetCustomerByIdQuery({ id: id as string, startDate, endDate });

  useEffect(() => {
    if (!token) {
      router.push('/sign-in');
    }
  }, [token]);

  const handleGoBack = () => {
    router.back();
  };
  const totalAvailableCredit = customer?.credits?.reduce(
    (sum, credits) => sum + (credits.amount - credits.usedAmount),
    0
  );

  if (isLoading) return <p>Chargement...</p>;
  if (error || !customer) return <p>Utilisateur introuvable.</p>;

  return (
    <div className="space-y-6">
    <Card className="max-w-3xl mx-auto mt-6 shadow">
      <div className="mb-4 ml-4">
        <button
          onClick={handleGoBack}
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-800 transition"
        >
          ← Retour
        </button>
      </div>
      <CardHeader>
        <CardTitle className="text-2xl text-center">{customer.name}</CardTitle>
      </CardHeader>
      <CardContent className="space-y-5 mt-5">
      <div className="grid grid-cols-2 gap-8 mb-8">
        <div>
        <p className="mb-2"><strong>ID client :</strong> {customer.customId}</p>
        <p className="mb-2"><strong>Email :</strong> {customer.email}</p>
        <p className="mb-2"><strong>Téléphone :</strong> {customer.phone}</p>
        <p className="mb-2"><strong>Nom du responsable :</strong> {customer.nameresponsable}</p>
        <p className="mb-2"><strong>Adresse :</strong> {customer.quarter}</p>
        <p><strong>Vos avoirs :</strong> {totalAvailableCredit?.toFixed(2) || 0} FCFA</p>
        </div>
        <div>
        <p className="mb-2"><strong>Nom d'utilisateur :</strong> {customer.userName || "Aucun"}</p>
        <p className="mb-2"><strong>Role :</strong> {customer.role}</p>
        <p className="mb-2"><strong>Région :</strong> {customer.region}</p>
        <p className="mb-2"><strong>Ville :</strong> {customer.ville}</p>
        <p className="mb-2"><strong>Type de client :</strong> {customer.type_customer}</p>
        <p><strong>Site web :</strong> {customer.website}</p>
        </div>
      </div>
      </CardContent>
    </Card>
      <Card className="max-w-6xl mx-auto shadow">
        <CardHeader>
      {/* Formulaire de filtre par période */}
      <div className="flex justify-between items-center">
      <CardTitle>Historique des commandes</CardTitle>
        <div className="flex space-x-4">
          <input
            type="date"
            value={startDate || ""}
            onChange={(e) => setStartDate(e.target.value)}
            className="border p-2 rounded"
          />
          <input
            type="date"
            value={endDate || ""}
            onChange={(e) => setEndDate(e.target.value)}
            className="border p-2 rounded"
          />
        </div>
      </div>
      </CardHeader>

      {/* Tableau des ventes */}
      <CardContent>
      <DataTable
              
              data={customer.saleInvoice || []}
              columns={columns}
            />
      </CardContent>
    </Card>
  </div>
  );
}
{/* <CardContent className="flex space-x-9 space-y-7 mt-5">
        
        <div className="flex-1">
        <p><strong>ID client :</strong> {customer.customId}</p>
          <p><strong>Email :</strong> {customer.email}</p>
          <p><strong>Téléphone :</strong> {customer.phone}</p>
          <p><strong>Nom du responsable :</strong> {customer.nameresponsable}</p>
          
          <p><strong>Adresse :</strong> {customer.quarter}</p>
        </div>
       
        <div className="flex-1">
          <p><strong>Role :</strong> {customer.role}</p>
          <p><strong>Region :</strong> {customer.region}</p>
          <p><strong>Ville :</strong> {customer.ville}</p>
          <p><strong>Type de client :</strong> {customer.type_customer}</p>
          <p><strong>Site web :</strong> {customer.website}</p>
        </div>
      </CardContent> 
      
      <CardContent className="space-y-5 mt-5">
      <p><strong>ID client :</strong> {customer.customId}</p>
          <p><strong>Email :</strong> {customer.email}</p>
          <p><strong>Téléphone :</strong> {customer.phone}</p>
          <p><strong>Nom du responsable :</strong> {customer.nameresponsable}</p>
          
          <p><strong>Adresse :</strong> {customer.quarter}</p>
        <p><strong>Role :</strong> {customer.role}</p>
          <p><strong>Region :</strong> {customer.region}</p>
          <p><strong>Ville :</strong> {customer.ville}</p>
          <p><strong>Type de client :</strong> {customer.type_customer}</p>
          <p><strong>Site web :</strong> {customer.website}</p>
      </CardContent>
      <CardContent>
          
            <DataTable
              
              data={customer.SaleInvoice || []}
              columns={columns}
            />
          
        </CardContent>
        <div className="mt-6">
        
        {customer.saleInvoice?.length ? (
          <table className="min-w-full bg-gray border">
            <thead>
              <tr>
                <th className="border px-4 py-2">N° Facture</th>
                <th className="border px-4 py-2">Date</th>
                <th className="border px-4 py-2">Montant</th>
                <th className="border px-4 py-2">Statut</th>
              </tr>
            </thead>
            <tbody>
              {customer.saleInvoice.map((invoice) => (
                <tr key={invoice.id}>
                  <td className="border px-4 py-2">{invoice.invoiceNumber}</td>
                  <td className="border px-4 py-2">
                    {format(new Date(invoice.createdAt), "dd/MM/yyyy HH:mm")}
                  </td>
                  <td className="border px-4 py-2">{invoice.finalAmount} FCFA</td>
                  <td className="border px-4 py-2">{invoice.paymentStatus}</td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <p>Aucune vente pour cette période.</p>
        )}
      </div>*/}