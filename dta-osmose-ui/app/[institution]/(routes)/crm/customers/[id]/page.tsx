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
import * as XLSX from 'xlsx';
import UserPrivateComponent from "../../../components/usePrivateComponent";
import { ArrowLeft } from "lucide-react";
import { DatePicker } from "@/components/ui/date-picker";


export default function DetailCustomerPage() {
  const [isMounted, setIsMounted] = useState(false);
  const [isUpdateDialogOpen, setIsUpdateDialogOpen] = useState(false);
  const [token, setToken] = useState<string | null>(null);
  // const [dates, setDates] = useState({
  //   startDate: '',
  //   endDate: ''
  // });
  const { institution } = useParams() as { institution: string }
  const router = useRouter();
  const { id } = useParams();

  // const customerId = Number(id);
  // const tokens = localStorage.getItem('accessToken')
  // console.log("le token est:", tokens)
  // console.log("id du customer", id)

  // Initialisation côté client uniquement
  useEffect(() => {
    setIsMounted(true);
    setToken(localStorage.getItem('accessToken'));
    
    const now = new Date();
    // setDates({
    //   startDate: new Date(now.getFullYear(), now.getMonth(), 1)
    //             .toISOString().split("T")[0],
    //   endDate: new Date(now.getFullYear(), now.getMonth() + 1, 0)
    //           .toISOString().split("T")[0]
    // });
  }, []);

  // Redirection si non authentifié
  useEffect(() => {
    if (isMounted && !token) {
      router.push(`/${institution}/sign-in`);
    }
  }, [token, isMounted, router]);

  const now = new Date();
  const firstDayOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
  const lastDayOfMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0);
  
  const [startDate, setStartDate] = useState<Date | undefined>(firstDayOfMonth);
  const [endDate, setEndDate] = useState<Date | undefined>(lastDayOfMonth);

  // Requêtes API
  const { 
    data: customer, 
    isLoading, 
    error, 
    refetch 
  } = useGetCustomerByIdQuery({ 
    id: id as string, 
    institution,
     startDate: startDate ? startDate.toISOString() : undefined,
    endDate: endDate ? endDate.toISOString(): undefined 
  },
   { skip: !id } // Ne pas exécuter si l'ID n'est pas défini
 );

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
  const handleUpdate = async (updatedData: Partial<Customer>): Promise<void> => {
    try {
      if (!customer?.id) throw new Error("ID client manquant");

      await updateCustomer({ id: customer.id, data: updatedData }).unwrap();

      toast.success("Client mis à jour avec succès");
      await refetch();
      setIsUpdateDialogOpen(false);
    } catch (error: any) {
      console.error("Échec de la mise à jour:", error);
      const errorMessage = error.data?.message || error.message || "Erreur lors de la mise à jour";
      toast.error(`Échec: ${errorMessage}`);
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
    `Produits_${customer.name}_${startDate}_au_${endDate}.xlsx`
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
            className="text-white hover:bg-blue-700"
          >
            <ArrowLeft className="w-5 h-5" />
          </Button>
          <UserPrivateComponent permission="update-user">
          <Button 
            onClick={() => setIsUpdateDialogOpen(true)}
            className="ml-auto bg-blue-600 text-white hover:bg-blue-700"
            disabled={isUpdating}
          >
            {isUpdating ? "Enregistrement..." : "Modifier"}
          </Button>
          </UserPrivateComponent>
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
              <div className="flex space-x-4">
                  <DatePicker label="" date={startDate} onSelect={(d) => d && setStartDate(d)} />
                  <DatePicker label="" date={endDate} onSelect={(d) => d && setEndDate(d)} />
              </div>
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
