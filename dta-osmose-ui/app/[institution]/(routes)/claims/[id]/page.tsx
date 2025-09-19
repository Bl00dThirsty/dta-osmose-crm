"use client";

import React from "react";
import { useGetClaimByIdQuery } from '@/state/api';
import { useRouter, useParams } from 'next/navigation';
import Link from "next/link";
import PrintClaimSheet from "./Facture"
import { useRespondToClaimMutation, useDeleteClaimMutation, useUpdateClaimResponseMutation } from '@/state/api';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogFooter,
  DialogTitle,
  DialogDescription,
  DialogCancel,
  DialogAction,
} from "@/components/ui/dialog"
import { toast } from "react-toastify";
import { useState } from "react"
import {
    ArrowLeft,
    
  } from "lucide-react";


const ClaimPage = () => {
  const router = useRouter();
  const { id, institution } = useParams<{ id: string; institution: string }>();
  const [openDelete, setOpenDelete] = useState(false);
  const [openResponse, setOpenResponse] = useState(false);
  const [openResponseUpdate, setOpenResponseUpdate] = useState(false);
  const userRole = typeof window !== 'undefined' ? localStorage.getItem('role') : null;
  const isParticulier = userRole === "Particulier";
  const [responseDesc, setResponseDesc] = useState("");
  const [respondToClaim] = useRespondToClaimMutation();
  const [updateClaimResponse] = useUpdateClaimResponseMutation();
  const [deleteClaim] = useDeleteClaimMutation()
  const { data: claim, isLoading, refetch } = useGetClaimByIdQuery(id, {
  refetchOnMountOrArgChange: true, // Force le rafraîchissement des données à chaque montage
});
 
  const handleDelete = async () => {
    if (!id) {
      toast.error("ID de la réclamation introuvable.")
      return
    }
    console.log("saleId :", id)
    try {
      await deleteClaim(id).unwrap()
      toast.success("Réclamation supprimée avec succès")
      setOpenDelete(false); // <-- Fermer la modale AVANT de rediriger
      setTimeout(() => {
        
      router.push(`/${institution}/claims/all`);
      router.refresh();
    }, 500);
      // router.push(`/${institution}/claims/all`);
    } catch (error) {
      console.log("Erreur lors de la suppression :")
      toast.error("Erreur lors de la suppression")
    }
  }

  const handleRespond = async (status: 'ACCEPTED' | 'REJECTED') => {
    try {
      await respondToClaim({
        institution,
        claimId: id,
        status,
        description: responseDesc
      }).unwrap();
      toast.success("Réponse enregistrée !");
      setOpenResponse(false);
      await refetch();
    } catch (err) {
      toast.error("Erreur lors de la réponse");
    }
  };
  const handleGoBack = () => {
    router.back();
  };

  const handleUpdate = async (status: 'ACCEPTED' | 'REJECTED') => {
    try {
      await updateClaimResponse({
        responseId: claim!.response!.id,
        status,
        description: responseDesc
      }).unwrap();
  
      toast.success("Réponse mise à jour !");
      setOpenResponseUpdate(false);
      await refetch();
    } catch (err) {
      toast.error("Erreur lors de la mise à jour");
    }
  };

  
 
  if (isLoading) return <div>Chargement...</div>;
  if (!claim) return <div>Réclamation non trouvée</div>;

  return (
   <>
    <div className="container mx-auto p-4 max-w-4xl">
      <div className="mb-3 ml-4 pt-4">
        <button
          onClick={handleGoBack}
          className="flex items-center gap-2 text-white-600 hover:bg-blue-500 transition-colors bg-blue-800 px-2 py-1 rounded"
        >
          <ArrowLeft className="w-5 h-5" />
          <span>Retour</span>
        </button>
      </div>

      
     <div className="flex flex-col ">
      <section className="overflow-hidden rounded-[0.5rem] border bg-background shadow-zinc-50">
        <div className="flex justify-center mb-8 mt-3">
          
            <h1 className="text-2xl">Détails de la Réclamation</h1>
            {/* <p className="text-gray-500">Date: {new Date(sale.createdAt ).toLocaleDateString()}</p> */}
        </div>
            <div className="grid grid-cols-3 gap-5 mb-8 place-items-center">
         
          <div>
             {!isParticulier && (
             <button  
                onClick={() => {
                    if (claim.response?.status === 'ACCEPTED' || claim.response?.status === 'REJECTED') {
                        setResponseDesc(claim.response?.description || "");
                        setOpenResponseUpdate(true)
                    } else {setOpenResponse(true)}
                }}
                className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-500 disabled:bg-green-400"
              >
               Réponse
             </button>
             )
            }
          </div>
          
          <div>
            <button
             onClick={() => {
                if (claim.response?.status === 'ACCEPTED' || claim.response?.status === 'REJECTED') {
                  alert("Cette réclamation a déjà eu une réponse (statut: " + claim.response?.status + "), il n'est plus possible de la supprimer.");
                } else {
                  setOpenDelete(true);
                }
              }}
              className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-500 disabled:bg-red-400"
              
            >
                Annuler la réclamation
               {/* {sale?.delivred ? "Déjà livrée" : "Annuler la commande"} */}
            </button>
          </div>
          <div>
          
              <PrintClaimSheet claim={claim} />
          </div>
        </div>
          
        <div className="container mx-auto p-4 max-w-4xl border">
           <div className="bg-gray p-6 rounded-lg shadow text-white-500 print:shadow-none">
              <h2 className="font-bold mb-5 text-center text-2xl">Informations</h2>
            <div className="grid grid-cols-2 gap-8 mb-8">
          <div>
            {/* <h2 className="font-bold mb-2">Informations sur la commande</h2> */}
              <p className="mb-5">Date de création: <b>{new Date(claim.createdAt ).toLocaleDateString()}</b></p>
              <p className="mb-5">
                Réponse : 
                <span className={`px-2 py-1 rounded text-white ml-2 ${claim.response?.status === 'ACCEPTED' ? 'bg-green-500' : claim.response?.status === 'REJECTED' ? 'bg-red-500' : 'bg-yellow-500'}`}>
                    {claim.response?.status || "PENDING"}
                </span>
              </p>
              <p className="mb-5">Nature de la réclamation: <b>{claim.reason}</b></p>
              <p className="mb-5">Numéro de commande: <Link className="text-blue-500 hover:text-blue-300" href={`/${institution}/sales/${claim.invoice?.id}`}>{claim.invoice?.invoiceNumber}</Link></p>
              {claim.response?.description && (
             <p className="mb-2">Descriptif de la réponse: <b>{claim.response.description}</b></p>
             )}
                             
          </div>
          <div>
            {/* <h2 className="font-bold mb-2">Client</h2> */}
            <p className="mb-5">Désignation du produit: <b>
             {
              claim.invoice?.items?.find(item => item.productId === claim.productId)?.product?.designation ?? "Produit inconnu"
             }
            </b></p>
            <p className="mb-5">Quantité retournée: <b>{claim.quantity}</b></p>
            <p className="mb-5">Montant de la réclamation: <b>{claim.totalAmount} F cfa</b></p>
            <p className="mb-5">Client: <b>{claim.invoice?.customer?.name}</b></p>
            <p>Description: <b>{claim.description || "Aucune desription"}</b></p>           
          </div>
        </div>
           </div>
        </div>

        </section>
    </div>
    </div>
    <Dialog open={openDelete} onOpenChange={setOpenDelete}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Confirmation</DialogTitle>
          <DialogDescription>
            Voulez-vous vraiment annuler cette réclamation ?
          </DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <DialogCancel onClick={() => setOpenDelete(false)}>Non</DialogCancel>
          <DialogAction onClick={handleDelete}>Oui</DialogAction>
        </DialogFooter>
      </DialogContent>
    </Dialog>
    <Dialog open={openResponse} onOpenChange={setOpenResponse}>
  <DialogContent>
    <DialogHeader>
      <DialogTitle>Répondre à la réclamation</DialogTitle>
      <DialogDescription>Choisir un statut et ajouter une description</DialogDescription>
    </DialogHeader>

    <div className="flex flex-col gap-4">
      <textarea
        className="border rounded p-2"
        placeholder="Description..."
        value={responseDesc}
        onChange={(e) => setResponseDesc(e.target.value)}
      />
      <div className="flex justify-end gap-3">
        <button
          className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-200"
          onClick={() => handleRespond('REJECTED')}
        >
          Refuser
        </button>
        <button
          className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-200"
          onClick={() => handleRespond('ACCEPTED')}
        >
          Accepter
        </button>
      </div>
    </div>
  </DialogContent>
</Dialog>

<Dialog open={openResponseUpdate} onOpenChange={setOpenResponseUpdate}>
  <DialogContent>
    <DialogHeader>
      <DialogTitle>Modifier la Réponse à la réclamation</DialogTitle>
      <DialogDescription>Modifier le statut et la description</DialogDescription>
    </DialogHeader>

    <div className="flex flex-col gap-4">
      <textarea
        className="border rounded p-2"
        placeholder="Description..."
        value={responseDesc}
        onChange={(e) => setResponseDesc(e.target.value)}
      />
      <div className="flex justify-end gap-3">
        <button
          className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-200"
          onClick={() => handleUpdate('REJECTED')}
        >
          Refuser
        </button>
        <button
          className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-200"
          onClick={() => handleUpdate('ACCEPTED')}
        >
          Accepter
        </button>
      </div>
    </div>
  </DialogContent>
</Dialog>
</>

  );
};

export default ClaimPage;