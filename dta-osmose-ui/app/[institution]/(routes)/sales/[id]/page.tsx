"use client";

import React, { useRef } from "react";
import { useGetSaleByIdQuery, useGetSettingsQuery } from '@/state/api';
import { useRouter, useParams } from 'next/navigation';
import { useState } from "react"
import PrintUserSheet from "./Facture"
import { Row } from "@tanstack/react-table"
import { useDeleteSaleInvoiceMutation, useUpdateSaleStatusMutation } from '@/state/api';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import Container from "../../components/ui/Container";
import { toast } from "react-toastify";
import { useReactToPrint } from "react-to-print";
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogFooter,
  DialogTitle,
  DialogDescription,
  DialogCancel,
  DialogAction,
} from "@/components/ui/dialog"
import {
  ArrowLeft,
  
} from "lucide-react";


const InvoicePage = () => {
  const router = useRouter();
  const params = useParams();
  const id = params?.id as string;
  const { institution } = useParams<{ institution: string }>();
  const [open, setOpen] = useState(false);
  const userRole = typeof window !== 'undefined' ? localStorage.getItem('role') : null;
  const isParticulier = userRole === "Particulier";
  //console.log('Institution from params:', institution);
  //const { id } = (row.original as any);
  const [deleteSaleInvoice] = useDeleteSaleInvoiceMutation()
  const [updateStatus] = useUpdateSaleStatusMutation(); 

  const { data: sale, isLoading } = useGetSaleByIdQuery(id);
  const { data: settings = [] } = useGetSettingsQuery({ institution });
  const handleDelete = async () => {
    if (!id) {
      toast.error("ID de la commande introuvable.")
      return
    }
    console.log("saleId :", id)
    try {
      await deleteSaleInvoice(id).unwrap()
      console.log("Commande supprimé avec succès")
      router.push(`/${institution}/sales/all`);
    } catch (error) {
      console.log("Erreur lors de la suppression :")
    }
  }
  const handleMarkReady = async () => {
    if (!sale) return;
    try {
      await updateStatus({
        id,
        institution,
        ready: !sale.ready,
      }).unwrap();
      toast.success(`Commande marquée comme ${!sale.ready ? 'prête' : 'non prête'}`);
    } catch (err) {
      console.error(err);
      toast.error("Erreur lors de la mise à jour du statut 'prêt'.");
    }
  };
  
  const handleMarkDelivered = async () => {
    if (!sale) return;
    try {
      await updateStatus({
        id,
        institution,
        delivred: !sale.delivred,
      }).unwrap();
      toast.success(`Commande ${!sale.delivred ? 'livrée' : 'non livrée'}`);
    } catch (err) {
      console.error(err);
      toast.error("Erreur lors de la confirmation de livraison.");
    }
  };
  const handleGoBack = () => {
    router.back();
  };
  const totalAvailableCredit = sale?.customer?.credits?.reduce(
    (sum, credits) => sum + (credits.amount - credits.usedAmount),
    0
  ) ?? 0;
 
  if (isLoading) return <div>Chargement...</div>;
  if (!sale) return <div>Facture non trouvée</div>;

  return (
    <>
    <div className="mb-3 ml-4 pt-4">
        <button
          onClick={handleGoBack}
          className="flex items-center gap-2 text-white-600 hover:bg-blue-500 transition-colors bg-blue-800 px-2 py-1 rounded"
        >
          <ArrowLeft className="w-5 h-5" />
          <span>Retour</span>
        </button>
      </div>
    <div className="h-full w-full overflow-x-auto">
      <section className="overflow-hidden rounded-[0.5rem] border bg-background shadow-zinc-50">
        <div className="flex justify-center mb-8">
          
            <h1 className="text-2xl">Commande N°: <b>{sale.invoiceNumber}</b></h1>
            {/* <p className="text-gray-500">Date: {new Date(sale.createdAt ).toLocaleDateString()}</p> */}
        </div>
        {totalAvailableCredit > 0 && (
  <div className="relative mb-8 mx-auto w-fit animate-fade-in">
    {/* Bulle de dialogue */}
    <div className="bg-blue-50 border-2 border-blue-200 rounded-xl p-4 shadow-lg relative max-w-md">
      <div className="absolute -top-3 left-6 w-6 h-6 bg-blue-50 border-t-2 border-l-2 border-blue-200 transform rotate-45"></div>
      
      <div className="flex items-start">
        <div className="flex-shrink-0 mr-3">
          <div className="bg-blue-100 p-2 rounded-full">
            <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
            </svg>
          </div>
        </div>
        <div>
          <h3 className="font-bold text-blue-800">Avoir disponible</h3>
          <p className="text-gray-700">
            <span className="font-semibold">{sale.customer.name}</span> possède un avoir de 
            <span className="font-bold text-blue-600"> {totalAvailableCredit} FCFA</span>.
            <br />
            Le montant sera automatiquement déduit de ses futures commandes.
          </p>
        </div>
      </div>
    </div>

    {/* Petite ombre portée pour le réalisme */}
    <div className="absolute -bottom-1 left-1/4 w-1/2 h-2 bg-blue-100 blur-sm opacity-70"></div>
  </div>
)}
        
        <div className="grid grid-cols-5 gap-5 mb-8 place-items-center">
        {!isParticulier && (
          <div className="ml-2">
            <button 
               onClick={handleMarkReady}
               className={`px-4 py-2 rounded text-white print:hidden ${
                 sale.ready ? 'bg-green-500 hover:bg-gray-400' : 'bg-green-600 hover:bg-green-500'
               }`}
               disabled={sale?.ready}
            >
               {sale.ready ? "Déjà prête" : "Marquer comme prête"}
            </button>
          </div>
        )}
        {!isParticulier && (
          <div>
            <button 
              onClick={handleMarkDelivered}
              className={`px-4 py-2 rounded text-white print:hidden ${
               sale.delivred ? 'bg-green-500 hover:bg-gray-400' : 'bg-green-600 hover:bg-green-500 print:hidden'
              }`}
            >
              {sale.delivred ? "Déjà livrée" : "Confirmer la livraison"}
            </button>
          </div>
          )}
          <div>
             <button  
                onClick={() => router.push(`/${institution}/payment/${sale.id}`)}
                className={`px-4 py-2 rounded ml-8 ${
                  sale.paymentStatus === 'PAID' ? 'bg-green-600 hover:bg-green-500' : 'bg-red-600 hover:bg-red-500'
                } text-white`}
              >
               Paiement
             </button>
          </div>
          <div>
            <button
             onClick={() => setOpen(true)}
             className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-500 disabled:bg-red-400"
             disabled={sale?.delivred}
            >
               {sale?.delivred ? "Déjà livrée" : "Annuler la commande"}
            </button>
          </div>
          
          <div>
              {/* <button
                onClick={handlePrint}
                // disabled={!sale || !settings}
                className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-500 "
               >
               Imprimer
              </button> */}
              <PrintUserSheet sale={sale} />
          </div>
        </div>
        <div className="grid grid-cols-2 gap-5 mb-8 place-items-center">
          <div className="ml-2">
              <button  
                onClick={() => router.push(`/${institution}/sales/${sale.id}/claim`)}
                className="px-4 py-2 rounded ml-8 text-white bg-blue-500 hover:bg-blue-200 disabled:bg-blue-400"
                disabled={!sale?.delivred}
              >
               Réclamation
             </button>
          </div>
          <div>
            <button 
              onClick={() => router.push(`/${institution}/sales/${sale.id}/claim/all`)}
              className="px-4 py-2 rounded ml-8 text-white bg-yellow-500 hover:bg-yellow-200 ">
                Liste des Réclamations
            </button>
          </div>
        </div>

        <div className="container mx-auto p-4 max-w-4xl border">
           <div className="bg-gray p-6 rounded-lg shadow text-white-500 print:shadow-none">
              <h2 className="font-bold mb-2 text-center text-2xl">Informations sur la commande</h2>
            <div className="grid grid-cols-2 gap-8 mb-8">
          <div>
            {/* <h2 className="font-bold mb-2">Informations sur la commande</h2> */}
              <p className="mb-2">Date de vente: <b>{new Date(sale.createdAt ).toLocaleDateString()}</b></p>
              <p className="mb-2">Client: <b>{sale.customer.name}</b></p>
              <p className="mb-2">Type de client: <b>{sale.customer.type_customer}</b></p>
              <p className="mb-2">Montant Total: <b>{sale.totalAmount} Fcfa</b></p>
              <p className="mb-2">Montant à payer: <b>{sale.dueAmount} Fcfa</b></p>
              <p className="">Montant payé: <b>{sale.paidAmount} Fcfa</b></p>
              
          </div>
          <div>
            {/* <h2 className="font-bold mb-2">Client</h2> */}
            <p className="mb-2">Remise: <b>{sale.discount} </b> </p>
            <p className="mb-2">Methode de paiement: <b>{sale.paymentMethod || 'CASH'}</b></p>
            {/* <p className="mb-2"> <b>{sale.paymentStatus === 'PAID' ? 'Terminé' : 'En cours'}</b></p> */}
            <p>Statut de paiement: <button className={` px-1 py-1 rounded text-white ${sale.paymentStatus === 'PAID' ? 'bg-green-500' : 'bg-red-500'}`}>{sale.paymentStatus === 'PAID' ? "PAYÉ" : "IMPAYÉ"}</button></p>
            <p className="mb-2">Prête: <button className={` px-2 py-1 rounded text-white ${sale.ready ? 'bg-green-500' : 'bg-red-500'}`}>{sale.ready ? "Oui" : "Non"}</button></p>
            <p className="mb-2">Livrée: <button className={` px-2 py-1 rounded text-white ${sale.delivred ? 'bg-green-500' : 'bg-red-500'}`}>{sale.delivred ? "Oui" : "Non"}</button></p>
            <p>Vendeur: <b>{sale.user.firstName} {sale.user.lastName}</b></p>
            
          </div>
        </div>
           </div>
        </div>

        <Card className="max-w-5xl mx-auto mt-5 shadow">
      <CardHeader>
        <CardTitle className="text">Liste des produits commandés</CardTitle>
      </CardHeader>
      <CardContent>
        <table className="w-full mb-8 border">
          <thead>
            <tr className="border">
              <th className="text-center py-2 border">Produit</th>
              <th className="text-center py-2 border">Qté</th>
              <th className="text-center py-2 border">Prix unitaire</th>
              <th className="text-center py-2 border">Total</th>
            </tr>
          </thead>
          <tbody>
            {sale.items.map(item => (
              <tr key={item.id} className="border">
                <td className="py-2 text-center">{item.product?.designation}</td>
                <td className="py-2 text-center border">{item.quantity}</td>
                <td className="py-2 text-center border">{item.unitPrice} FCFA</td>
                <td className="py-2 text-center border">{item.totalPrice} FCFA</td>
              </tr>
            ))}
          </tbody>
        </table>
        </CardContent>
        </Card>
        
        </section>
    </div>

    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Confirmation</DialogTitle>
          <DialogDescription>
            Voulez-vous vraiment annuler cette commande ?
          </DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <DialogCancel onClick={() => setOpen(false)}>Non</DialogCancel>
          <DialogAction onClick={handleDelete}>Oui</DialogAction>
        </DialogFooter>
      </DialogContent>
    </Dialog>
   </> 
  );
};

export default InvoicePage;