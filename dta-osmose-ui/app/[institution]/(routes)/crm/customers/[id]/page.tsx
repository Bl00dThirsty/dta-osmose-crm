// src/app/customer/[id]/page.tsx
"use client"
import { useParams } from "next/navigation";
import { useGetCustomerByIdQuery, useUpdateCustomerMutation } from "@/state/api"; 
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { UpdateCustomerForm } from "@/app/[institution]/(routes)/crm/components/UpdateCustomer";
import { DataTable } from "./data-table";
import { columns } from "./columns";
import { toast } from "react-toastify";
import { Button } from "@/components/ui/button";
import { Customer } from "@/state/api"
import Link from "next/link";
import * as XLSX from 'xlsx'


export default function DetailCustomerPage() {
  const [isMounted, setIsMounted] = useState(false);
  const [isUpdateDialogOpen, setIsUpdateDialogOpen] = useState(false);
  const [token, setToken] = useState<string | null>(null);
  const [dates, setDates] = useState({
    startDate: '',
    endDate: ''
  });
  const { institution } = useParams() as { institution: string }
  const router = useRouter();
  const { id } = useParams();

  // Initialisation côté client uniquement
  useEffect(() => {
    setIsMounted(true);
    setToken(localStorage.getItem('accessToken'));
    
    const now = new Date();
    setDates({
      startDate: new Date(now.getFullYear(), now.getMonth(), 1)
                .toISOString().split("T")[0],
      endDate: new Date(now.getFullYear(), now.getMonth() + 1, 0)
              .toISOString().split("T")[0]
    });
  }, []);

  // Redirection si non authentifié
  useEffect(() => {
    if (isMounted && !token) {
      router.push(`/${institution}/sign-in`);
    }
  }, [token, isMounted, router]);

  // Requêtes API
  const { 
    data: customer, 
    isLoading, 
    error, 
    refetch 
  } = useGetCustomerByIdQuery({ 
    id: id as string, 
    startDate: dates.startDate, 
    endDate: dates.endDate 
  });

  const [updateCustomer, { isLoading: isUpdating }] = useUpdateCustomerMutation();

  // Calcul du crédit disponible
  const totalAvailableCredit = customer?.credits?.reduce(
    (sum, credit) => sum + (credit.amount - credit.usedAmount),
    0
  ) || 0;
  useEffect(() => {
  console.log("Customer details from API:", customer);
}, [customer]);


  // Gestion de la mise à jour
  const handleUpdate = async (updatedData: Partial<Customer>) => {
    try {
      if (!customer?.id) {
        throw new Error("ID client manquant");
      }

      const response = await updateCustomer({
        id: customer.id,
        data: updatedData  // Correction ici pour matcher votre API
      }).unwrap();

      toast.success("Client mis à jour avec succès");
      await refetch();
      setIsUpdateDialogOpen(false);
      
      return response;
    } catch (error: any) {
      console.error("Échec de la mise à jour:", error);
      const errorMessage = error.data?.message || 
                         error.message || 
                         "Erreur lors de la mise à jour";
      toast.error(`Échec: ${errorMessage}`);
      throw error;
    }
  };
  const exportToExcel = () => {
  if (!customer?.saleInvoice || customer.saleInvoice.length === 0) {
    toast.warning("Aucune commande trouvée sur cette période");
    return;
  }

  // Préparer les données
  const rows = customer.saleInvoice.flatMap(invoice =>
  (invoice.items ?? []).map(item => ({
    "Désignation produit": item.product?.designation || "N/A",
    "Quantité": item.quantity,
    "Prix unitaire": item.unitPrice,
    "Total": item.totalPrice,
    "Numéro Facture": invoice.invoiceNumber,
    "Date": new Date(invoice.createdAt).toLocaleDateString(),
  }))
);

  if (rows.length === 0) {
    toast.warning("Aucun produit trouvé sur cette période");
    return;
  }

  // Création du fichier Excel
  const worksheet = XLSX.utils.json_to_sheet(rows);
  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, "Produits achetés");

  // Export
  XLSX.writeFile(
    workbook, 
    `Produits_${customer.name}_${dates.startDate}_au_${dates.endDate}.xlsx`
  );
};


  if (!isMounted || isLoading) return <p className="text-center py-8">Chargement en cours...</p>;
  if (error || !customer) return <p className="text-center py-8 text-red-500">Client introuvable</p>;

  return (
    <div className="space-y-6">
      {/* Carte principale */}
      <Card className="max-w-3xl mx-auto mt-6 shadow">
        <div className="flex justify-between items-center p-4">
          <Button 
            onClick={() => router.back()}
            variant="outline"
            className="bg-blue-600 text-white hover:bg-blue-700"
          >
            ← Retour
          </Button>
          <Button 
            onClick={() => setIsUpdateDialogOpen(true)}
            className="ml-auto bg-blue-600 text-white hover:bg-blue-700"
            disabled={isUpdating}
          >
            {isUpdating ? "Enregistrement..." : "Modifier"}
          </Button>
        </div>

        <CardHeader>
          <CardTitle className="text-2xl text-center">{customer.name}</CardTitle>
        </CardHeader>
        
        <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-8 py-4">
          <div className="space-y-4">
            <p><strong>ID client :</strong> {customer.customId}</p>
            <p><strong>Email :</strong> {customer.email}</p>
            <p><strong>Téléphone :</strong> {customer.phone}</p>
            <p><strong>Nom du responsable :</strong> {customer.nameresponsable}</p>
            <p><strong>Adresse :</strong> {customer.quarter}</p>
            <p><strong>Crédit disponible :</strong> {totalAvailableCredit.toFixed(2)} FCFA</p>
          </div>
          <div className="space-y-4">
            <p><strong>Nom d'utilisateur :</strong> {customer.userName || "Non défini"}</p>
            <p><strong>Rôle :</strong> {customer.role}</p>
            <p><strong>Région :</strong> {customer.region}</p>
            <p><strong>Ville :</strong> {customer.ville}</p>
            <p><strong>Type de client :</strong> {customer.type_customer}</p>
            <p><strong>Site web :</strong> {customer.website || "Non défini"}</p>
            <p>
               Créateur: <Link className="hover:text-blue-300" href={`/${institution}/user/${customer.user?.id}`}><b>
               {customer.user 
                 ? `${customer.user.firstName} ${customer.user.lastName}` 
               : 'Inconnu'}
              </b></Link>
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Historique des commandes */}
      <Card className="max-w-6xl mx-auto shadow">
        <CardHeader>
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
            <CardTitle>Historique des commandes</CardTitle>
            <div className="flex gap-2">
              <input
                type="date"
                value={dates.startDate}
                onChange={(e) => setDates(prev => ({...prev, startDate: e.target.value}))}
                className="border p-2 rounded text-sm"
              />
              <input
                type="date"
                value={dates.endDate}
                onChange={(e) => setDates(prev => ({...prev, endDate: e.target.value}))}
                className="border p-2 rounded text-sm"
              />
              <Button 
                onClick={exportToExcel} 
                className="bg-green-600 text-white hover:bg-green-700"
              >
                Exporter Excel
              </Button>
            </div>
          </div>
       </CardHeader>

        <CardContent>
          <DataTable
            data={customer.saleInvoice || []}
            columns={columns}
          />
        </CardContent>
      </Card>

      {/* Formulaire de modification */}
      {customer && (
        <UpdateCustomerForm
          customer={customer}
          open={isUpdateDialogOpen}
          onOpenChange={setIsUpdateDialogOpen}
          onUpdate={handleUpdate}
          isLoading={isUpdating}
        />
      )}
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