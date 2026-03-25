"use client";

import React, { useRef } from "react";
import { useGetSaleByIdQuery, useGetSettingsQuery } from '@/state/api';
import { useRouter, useParams } from 'next/navigation';
import { useState, useEffect } from "react"
import PrintUserSheet from "./Facture"
import { Row } from "@tanstack/react-table"
import { useDeleteSaleInvoiceMutation, useUpdateSaleStatusMutation, useGetActivePromotionsQuery } from '@/state/api';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import UserPrivateComponent from "../../components/usePrivateComponent";
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
import { ArrowBigLeft, ArrowLeft, ChevronDown, StepBack } from "lucide-react";


const InvoicePage = () => {
  const router = useRouter();
  const params = useParams();
  const id = params?.id as string;
  const { institution } = useParams<{ institution: string }>();
  const [open, setOpen] = useState(false);
  const [token, setToken] = useState<string | null>(null);
  useEffect(() => {
      // Tout ce code ne s'exécute QUE côté client
    const accessToken = localStorage.getItem('accessToken');
    setToken(accessToken);
  
    if (!accessToken) {
      router.push(`/${institution}/sign-in`);
     }
  }, [router, institution]);
  const [userRole, setUserRole] = useState<string | null>(null);

  useEffect(() => {
    setUserRole(localStorage.getItem('role'));
  }, []);
  const isParticulier = userRole === "Particulier";
  //console.log('Institution from params:', institution);
  //const { id } = (row.original as any);
  const [deleteSaleInvoice] = useDeleteSaleInvoiceMutation()
  const [updateStatus] = useUpdateSaleStatusMutation(); 
  const now = new Date();
  now.setDate(now.getDate() - 1);

  const { data: sale, isLoading } = useGetSaleByIdQuery(id);
  const { data: settings = [] } = useGetSettingsQuery({ institution });
  const handleDelete = async () => {
    if (!id) {
      toast.error("ID de la commande introuvable.")
      return
    }
    
    if(((sale?.paymentStatus == "PARTIAL") || (sale?.paymentStatus == "PAID")) && (sale?.paidAmount !== 0)){
      toast.error("Impossible de supprimé la commande, paiement déja entamé")
      return
    }
    console.log("saleId :", id)
    try {
      await deleteSaleInvoice(id).unwrap()
      console.log("Commande supprimé avec succès")
      router.push(`/${institution}/sales/`);
      toast.success("Commande annulée")
    } catch (error) {
      console.log("Erreur lors de la suppression :")
      toast.error("Erreur lors de l'annulation de la commande");
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
    } catch (error) {
      console.log("Erreur lors du marquage :");
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

  //Les credits disponible pour le clients
  const totalAvailableCredit = sale?.customer?.credits?.reduce(
    (sum, credits) => sum + (credits.amount - credits.usedAmount),
    0
  ) ?? 0;

  const rate = 656;

  // Message en cas de commandes non livrées à temps (notifications)
  const isLate = sale?.date && !sale.delivred ? new Date(sale.date) < now : false;
 
  if (isLoading) return <div>Chargement...</div>;
  if (!sale) return <div>Vous n'avez pas accès à ces informations. Facture non trouvée</div>;

  return (
    <>
    <div className="mb-3 ml-4 pt-4">
        <Button
          onClick={handleGoBack}
          className="flex items-center gap-2 hover:bg-blue-300 bg-blue-600 transition-colors px-2 py-1 rounded"
        >
          <ArrowLeft className="w-5 h-5" />
          
        </Button>

      </div>
      {/* Boutons en haut à gauche Annuler la commande, reclamation et liste des reclamations*/}
<div className="flex gap-3 mb-4 ml-4">
  {!sale.delivred && (
    <button
      onClick={() => setOpen(true)}
      className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-500 disabled:bg-red-400"
      disabled={sale?.delivred}
    >
      Annuler la commande
    </button>
  )}

  {sale.delivred && (
    <>
      <button
        onClick={() => router.push(`/${institution}/sales/${sale.id}/claim`)}
        className="px-4 py-2 rounded text-white bg-blue-600 hover:bg-blue-500"
      >
        Réclamation
      </button>
      <button
        onClick={() => router.push(`/${institution}/sales/${sale.id}/claim/all`)}
        className="px-4 py-2 rounded text-white bg-blue-600 hover:bg-blue-500"
      >
        Liste des Réclamations
      </button>
    </>
  )}
</div>

    <div className="h-full w-full overflow-x-auto">
      <section className="overflow-hidden rounded-[0.5rem] border bg-background shadow-zinc-50">
        <div className="flex justify-center mt-2 mb-8">         
            <h1 className="text-2xl">Commande N°: <b>{sale.invoiceNumber}</b></h1>            
        </div>
        {/* //Message en cas de commandes non livrées à temps (notifications) */}
          {isLate && (
            <div className="relative mb-5 mx-auto w-fit animate-fade-in animate-pulse">
              <div className="bg-red-100 border-2 border-red-500 rounded-xl p-4 shadow-lg relative max-w-md">
                <div className="absolute -top-3 left-6 w-6 h-6 bg-red-100 border-t-2 border-l-2 border-yellow-200 transform rotate-45"></div>
                
                <div className="flex items-start">
                  <div className="flex-shrink-0 mr-3">
                    <div className="bg-red-100 p-2 rounded-full">
                      <svg className="w-6 h-6 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                      </svg>
                    </div>
                  </div>
                  <div>
                    <h3 className="font-bold text-yellow-800">Retard dans la Livraison !</h3>
                    {/* Optionnel : Afficher la date prévue */}
                    {sale.date && (
                      <p className="text-sm text-yellow-700">
                        Date prévue: {new Date(sale.date).toLocaleDateString()}
                      </p>
                    )}
                  </div>
                </div>
              </div>
              <div className="absolute -bottom-1 left-1/4 w-1/2 h-2 bg-red-100 blur-sm opacity-70"></div>
            </div>
          )}
        {totalAvailableCredit > 0 && (
  <div className="relative mb-8 mx-auto w-fit animate-fade-in">
    {/* Bulle de dialogue pour signifier les credit disponible pour le client de cette commande*/}
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
        
        {/* Bouton status
        <div className="mb-4 ml-4 flex gap-3">
           {sale.delivred ? (
            <>
            <button
              onClick={() => router.push(`/${institution}/sales/${sale.id}/claim`)}
              className="px-4 py-2 rounded text-white bg-blue-500 hover:bg-blue-600"
            >
               Réclamation
            </button>
            <button
              onClick={() => router.push(`/${institution}/sales/${sale.id}/claim/all`)}
              className="px-4 py-2 rounded text-white bg-blue-500 hover:bg-blue-600"
            >
             Liste des Réclamations
            </button>
           </>
          ) : (
          <button
              onClick={() => setOpen(true)}
            className="px-4 py-2 rounded text-white bg-red-600 hover:bg-red-500 disabled:bg-red-400"
             disabled={isParticulier || sale?.delivred}
          >
          Annuler la commande
          </button>
        )}
      </div> */}

     {/* Bande horizontale Statuts */}
<div className=" rounded-xl p-4 mb-6">
  <h2 className="font-bold text-lg mb-3">Statuts</h2>
  <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4 text-center">
    
    {/* 1. Commande prête */}
    <div className="p-4 rounded-md shadow ">
      <p className="font-semibold mb-2">Commande</p>
      
      <button
        onClick={handleMarkReady}
        className={`px-4 py-2 text-sm font-medium rounded-full transition-colors duration-500 ${
          sale.ready ? 'bg-blue-300 text-blue-800' : 'bg-blue-300 text-blue-800 hover:bg-blue-500'
        }`}
        disabled={isParticulier || sale.ready}
      >
        {sale.ready ? "Prête" : "Pas prête"}
      </button>
    </div>

    {/* 2. Paiement */}
    <div className="p-4 rounded-md shadow ">
      <p className="font-semibold mb-2">Paiement</p>
      <button
        onClick={() => router.push(`/${institution}/payment/${sale.id}`)}
        className={`px-4 py-2 text-sm rounded-full text-white ${
          sale.paymentStatus === 'PAID'
            ? 'bg-green-500 text-green-800 hover:bg-green-500'
            : 'bg-red-500 text-red-800 hover:bg-red-500'
        }`}
      >
        {sale.paymentStatus === 'PAID' ? "Validé" : "Non validé"}
      </button>
    </div>

    {/* 3. Livraison */}
    <div className="p-3 rounded-md shadow ">
      <p className="font-semibold mb-2">Livraison</p>
      <button
        onClick={handleMarkDelivered}
        className={`px-4 py-2 text-sm rounded-full text-white ${
          sale.delivred ? 'bg-green-500 text-green-800' : 'bg-orange-300 text-orange-800 hover:bg-orange-400'
        }`}
        disabled={isParticulier || sale.delivred}
      >
        {sale.delivred ? "Livrée" : "En attente"}
      </button>
    </div>

    {/* 4. Option de livraison
    <div className="p-3 rounded-md bg-white shadow">
      <p className="font-semibold mb-2">Option</p>
      <select
        className="w-full border rounded px-2 py-1"
        disabled={isParticulier}
        defaultValue="magasin"
        w-full px-3 py-1 rounded-full text-white
      >
        <option value="magasin">Retrait en magasin</option>
        <option value="domicile">Livraison à domicile</option>
      </select>
    </div> */}

    {/* 5. Impression */}
    <div className="p-3 rounded-md shadow">
      <p className="font-semibold mb-2">Imprimer</p>
      <PrintUserSheet sale={sale} />
    </div>

    {/* 6. Assignée à */}
    <div className="p-3 rounded-md shadow">
      <p className="font-semibold mb-2">Assignée à</p>
      <p className="mt-2 text-sm text-gray-400 font-bold">
        {sale.user
          ? `${sale.user.firstName} ${sale.user.lastName}`
          : sale.customer?.name || "Inconnu"}
      </p>
    </div>
  </div>
</div>


      {/* Bouton status */}

        <div className="container mx-auto p-4 max-w-4xl border">
           <div className="bg-gray p-6 rounded-lg shadow text-white-500 print:shadow-none">
              <h2 className="font-bold mb-5 text-center text-2xl">Informations sur la commande</h2>
            <div className="grid grid-cols-2 gap-8 mb-8 ">
          <div>
            {/* <h2 className="font-bold mb-2">Informations sur la commande</h2> */}
              <p className="mb-2">Date de vente: <b>{new Date(sale.createdAt ).toLocaleDateString()}</b></p>
              <p className="mb-2">Date de livraison: <b>{
                     sale.date
                       ? new Date(sale.date).toLocaleDateString()
                       : "Non renseigné"
                   }</b></p>
              <p className="mb-2">Client: <b>{sale.customer.name}</b></p>
              <p className="mb-2">Type de client: <b>{sale.customer.type_customer}</b></p>
              <p>Remise: <b>{sale.discount} € </b> </p>
              <div className="text-xs text-gray-500">{(sale.discount * rate).toFixed(0)} F CFA</div>
              
          </div>
          <div>
            {/* <h2 className="font-bold mb-2">Client</h2> */}
            {sale.vatApplicable ? (
               <span className="text-green-600 font-semibold mb-2">TVA appliquée: 19.25%</span>
            ) : (
               <span className="text-gray-500 mb-2">Sans TVA</span>
            )}

            <p className="mb-2">Methode de paiement: <b>{sale.paymentMethod || 'CASH'}</b></p>
            {/* <p className="mb-2"> <b>{sale.paymentStatus === 'PAID' ? 'Terminé' : 'En cours'}</b></p> */}
            <p className="">Montant Total: <b>{sale.totalAmount} €</b></p>
            <div className="text-xs text-gray-500 mb-2">{(sale.totalAmount * rate).toFixed(0)} F CFA</div>
            <p className="">Montant à payer: <b>{sale.dueAmount.toFixed(2)}€</b></p>
            <div className="text-xs text-gray-500 mb-2">{(sale.dueAmount * rate).toFixed(0)} F CFA</div>
            <p className="">Montant payé: <b>{sale.paidAmount} €</b></p>
            <div className="text-xs text-gray-500">{(sale.paidAmount * rate).toFixed(0)} F CFA</div>
            {/* <p>
               Initiateur: <b>
               {sale.user 
                 ? `${sale.user.firstName} ${sale.user.lastName}` 
               : sale.customer?.name || 'Inconnu'}
              </b>
            </p> */}
            
          </div>
        </div>
           </div>
        </div>

        <Card className="max-w-5xl mx-auto mt-5 mb-3 shadow">
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
                <td className="py-3 text-center border">{item.quantity}</td>
                <td className="py-3 text-center border">{item.unitPrice} FCFA</td>
                <td className="py-3 text-center border">{item.totalPrice} FCFA</td>
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