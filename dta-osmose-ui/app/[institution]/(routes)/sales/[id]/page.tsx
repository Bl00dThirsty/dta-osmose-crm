"use client";

import React from "react";
import { useGetSaleByIdQuery } from '@/state/api';
import { useRouter, useParams } from 'next/navigation';
import { useState } from "react"
import { Row } from "@tanstack/react-table"
import { useDeleteSaleInvoiceMutation, useUpdateSaleStatusMutation } from '@/state/api';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import Container from "../../components/ui/Container";
import { toast } from "react-toastify";
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


const InvoicePage = () => {
  const router = useRouter();
  const params = useParams();
  const id = params?.id as string;
  const { institution } = useParams<{ institution: string }>();
  const [open, setOpen] = useState(false);
  
  //console.log('Institution from params:', institution);
  //const { id } = (row.original as any);
  const [deleteSaleInvoice] = useDeleteSaleInvoiceMutation()
  const [updateStatus] = useUpdateSaleStatusMutation(); 
  
  const { data: sale, isLoading } = useGetSaleByIdQuery(id);

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
  

  const handlePrint = () => {
    window.print();
  };
 

  if (isLoading) return <div>Chargement...</div>;
  if (!sale) return <div>Facture non trouvée</div>;

  return (
    <>
    <div className="h-full w-full overflow-x-auto">
      <section className="overflow-hidden rounded-[0.5rem] border bg-background shadow-zinc-50">
        <div className="flex justify-center mb-8">
          
            <h1 className="text-2xl">Commande N°: <b>{sale.invoiceNumber}</b></h1>
            {/* <p className="text-gray-500">Date: {new Date(sale.createdAt ).toLocaleDateString()}</p> */}
        </div>
        
        <div className="grid grid-cols-5 gap-5 mb-8">
          <div className="ml-2">
            <button 
               onClick={handleMarkReady}
               className={`px-4 py-2 rounded text-white print:hidden ${
                 sale.ready ? 'bg-green-500 hover:bg-gray-400' : 'bg-green-600 hover:bg-green-500'
               }`}
            >
               {sale.ready ? "Déjà prête" : "Marquer comme prête"}
            </button>
          </div>

          <div>
            <button 
              onClick={handleMarkDelivered}
              className={`px-4 py-2 rounded text-white print:hidden ${
               sale.delivred ? 'bg-green-500 hover:bg-gray-400' : 'bg-green-600 hover:bg-green-500'
              }`}
            >
              {sale.delivred ? "Déjà livrée" : "Confirmer la livraison"}
            </button>
          </div>
          <div>
             <button 
                
                className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-500 print:hidden"
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
              <button 
                onClick={handlePrint}
                className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-500 print:hidden"
               >
               Imprimer
              </button>
          </div>
        </div>

        <div className="container mx-auto p-4 max-w-4xl border">
           <div className="bg-gray p-6 rounded-lg shadow text-white-500 print:shadow-none">
              <h2 className="font-bold mb-2 text-center">Informations sur la commande</h2>
            <div className="grid grid-cols-2 gap-8 mb-8">
          <div>
            {/* <h2 className="font-bold mb-2">Informations sur la commande</h2> */}
              <p className="mb-2">Date de vente: <b>{new Date(sale.createdAt ).toLocaleDateString()}</b></p>
              <p className="mb-2">Client: <b>{sale.customer.name}</b></p>
              <p className="mb-2">Type de client: <b>{sale.customer.type_customer}</b></p>
              <p className="mb-2">Montant Total: <b>{sale.totalAmount} Fcfa</b></p>
              <p className="mb-2">Montant à payer: </p>
              <p>Montant perçu: </p>
          </div>
          <div>
            {/* <h2 className="font-bold mb-2">Client</h2> */}
            <p className="mb-2">Methode de paiement: <b>{sale.paymentMethod || 'CASH'}</b></p>
            <p className="mb-2">Statut de paiement: <b>{sale.paymentStatus}</b></p>
            <p className="mb-2">Prête: <button className={` px-2 py-1 rounded text-white ${sale.ready ? 'bg-green-500' : 'bg-red-500'}`}>{sale.ready ? "Oui" : "Non"}</button></p>
            <p className="mb-2">Livrée: <button className={` px-2 py-1 rounded text-white ${sale.delivred ? 'bg-green-500' : 'bg-red-500'}`}>{sale.delivred ? "Oui" : "Non"}</button></p>
            <p>Vendeur: <b>{sale.user.firstName} {sale.user.lastName}</b></p>
            
          </div>
        </div>
           </div>
        </div>

        <Card className="max-w-5xl mx-auto mt-5 shadow">
      <CardHeader>
        <CardTitle className="text-2xl">Liste des produits commandés</CardTitle>
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