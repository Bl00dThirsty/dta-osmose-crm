"use client";

import React, { useRef } from "react";
import { useGetSaleByIdQuery, useGetClaimByIdQuery } from '@/state/api';
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


const InvoicePage = () => {
  const router = useRouter();
  const params = useParams();
  const id = params?.id as string;
  const { institution } = useParams<{ institution: string }>();
  const [open, setOpen] = useState(false);
  
  //console.log('Institution from params:', institution);
  //const { id } = (row.original as any);
  const [deleteSaleInvoice] = useDeleteSaleInvoiceMutation()
  
  const { data: claim, isLoading } = useGetClaimByIdQuery(id);
 
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
  
  
  const [rellvalue, setRellvalue] = useState(0);
 
  if (isLoading) return <div>Chargement...</div>;
  if (!claim) return <div>Réclamation non trouvée</div>;

  return (
    <>
    <div className="h-full w-full overflow-x-auto">
      <section className="overflow-hidden rounded-[0.5rem] border bg-background shadow-zinc-50">
        <div className="flex justify-center mb-8">
          
            <h1 className="text-2xl">Détails de la Réclamation</h1>
            {/* <p className="text-gray-500">Date: {new Date(sale.createdAt ).toLocaleDateString()}</p> */}
        </div>
        
        <div className="grid grid-cols-3 gap-5 mb-8 place-items-center">
          
          <div>
             <button  
                
                className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-500 disabled:bg-red-400"
              >
               Réponse
             </button>
          </div>
          <div>
            <button
             onClick={() => setOpen(true)}
             className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-500 disabled:bg-red-400"
            //  disabled={sale?.delivred}
            >
                Annuler
               {/* {sale?.delivred ? "Déjà livrée" : "Annuler la commande"} */}
            </button>
          </div>
          
          <div>
          
              <PrintUserSheet claim={claim} />
          </div>
        </div>

        <div className="container mx-auto p-4 max-w-4xl border">
           <div className="bg-gray p-6 rounded-lg shadow text-white-500 print:shadow-none">
              <h2 className="font-bold mb-5 text-center text-2xl">Informations</h2>
            <div className="grid grid-cols-2 gap-8 mb-8">
          <div>
            {/* <h2 className="font-bold mb-2">Informations sur la commande</h2> */}
              <p className="mb-2">Date de création: <b>{new Date(claim.createdAt ).toLocaleDateString()}</b></p>
              <p className="mb-2">Réponse: <button className={` px-2 py-1 rounded text-white ${claim.response ? 'bg-green-500' : 'bg-red-500'}`}>{claim.response ? "ACCPTER" : "REFUSER"}</button></p>
              <p className="mb-2">Nature de la réclamation: <b>{claim.reason}</b></p>
              <p>Numéro de commande: <b>{claim.invoice?.invoiceNumber}</b></p>
              
          </div>
          <div>
            {/* <h2 className="font-bold mb-2">Client</h2> */}
            <p className="mb-2">Désignation du produit: <b>
             {
              claim.invoice?.items?.find(item => item.productId === claim.productId)?.product?.designation ?? "Produit inconnu"
             }
            </b></p>
            <p className="mb-2">Quantité retournée: <b>{claim.quantity}</b></p>
            <p className="mb-2">Montant de la réclamation: <b>{claim.totalAmount} F cfa</b></p>
            <p className="mb-2">Client: <b>{claim.invoice?.customer?.name}</b></p>
            <p>Description: <b>{claim.description || "Aucune desription"}</b></p>           
          </div>
        </div>
           </div>
        </div>

        </section>
    </div>

    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Confirmation</DialogTitle>
          <DialogDescription>
            Voulez-vous vraiment annuler cette réclamation ?
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