"use client";

import { useRouter, useParams } from "next/navigation";
import { ArrowBigLeft, ArrowLeft, ChevronLeft, StepBack } from "lucide-react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { useGetSalePromiseByIdQuery, useDeleteSalePromiseMutation,useUpdateSalePromiseStatusMutation } from "@/state/api";
import { Button } from "@/components/ui/button";
import { toast } from "react-toastify";
import { useEffect, useState } from "react";
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select";
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

const SalepromisePage = () => {
  const router = useRouter();
  const params = useParams();
  const id = params?.id;
  const { institution } = useParams<{ institution: string }>();
  const [deleteSalePromise] = useDeleteSalePromiseMutation()
  const { data: salepromise, isLoading } = useGetSalePromiseByIdQuery(Number(id));
   const [updateSalePromiseStatus] = useUpdateSalePromiseStatusMutation();
  const [open, setOpen] = useState(false);
  const handleGoBack = () => router.back();

  

   /*const handleCancel = async () => {
        if (!id) {
          toast.error("ID de la commande introuvable.")
          return
        }
        try {
          await deleteSalePromise(Number(id)).unwrap()
          toast.success("Promesse annulée, réactualisez la page")
          setOpen(false); // <-- Fermer la modale AVANT de rediriger
          setTimeout(() => {
            
          router.push(`/${institution}/salepromise/all`);
          router.refresh();
        }, 500);
          
         
        } catch (error) {
          console.log("Erreur lors de la suppression :")
          toast.error("Erreur lors de l'annulation");
        }
  };*/
  const handleCancel = async () => {
  if (!id) {
    toast.error("ID de la promesse introuvable.");
    return;
  }

  try {
    // 1️⃣ Mettre à jour le statut du pipeline vers "CLOSED_LOST"
    await updateSalePromiseStatus({
      id: Number(id),
      newStatus: "CLOSED_LOST",
      performedById: 1, // ton userId connecté
      action: "Annulation de la promesse (Fermé - Perdu)",
    }).unwrap();

    // 2️⃣ Mettre à jour localement le sélecteur
    setSelectedStage("CLOSED_LOST");

    // 3️⃣ Rafraîchir le dashboard
    toast.warning("Promesse annulée.");
    setTimeout(() => {
      router.push(`/${institution}/salepromise/all`);
      router.refresh(); // recharge le graphe FunnelChart
    }, 400);
  } catch (error) {
    console.error("Erreur lors de l'annulation :", error);
    toast.error("Erreur lors de l'annulation de la promesse.");
  }
};


  //Ajouter l’état pour l’étape sélectionnée
// ⚡ Initialiser selectedStage une fois les données chargées
  const [selectedStage, setSelectedStage] = useState<string>("LEAD_CAPTURED");
  useEffect(() => {
    if (salepromise?.statusPipeline) setSelectedStage(salepromise.statusPipeline);
  }, [salepromise]);

  // 🔄 Mettre à jour le statut de la promesse
  const handleUpdateStatus = async (newStatus: string, action?: string) => {
    if (!id) {
      toast.error("ID de la promesse introuvable.");
      return;
    }

    try {
      await updateSalePromiseStatus({
        id: Number(id),
        newStatus,
        performedById: 1, // à remplacer par ton userId connecté
        action: action || `Mise à jour vers ${newStatus}`,
      }).unwrap();

      toast.success(`Statut mis à jour vers "${newStatus}"`);
      setSelectedStage(newStatus);

      // Réactualiser la page
      setTimeout(() => {
        router.refresh();
      }, 400);
    } catch (error) {
      console.error("Erreur lors de la mise à jour du statut :", error);
      toast.error("Erreur lors de la mise à jour du statut.");
    }
  };

  /*const handleValidate = () => {
    router.push(`/${institution}/sales?salePromiseId=${salepromise?.id}`);
    console.log("Valider promesse", id);
  };*/
  const handleValidate = async () => {
  if (!id) {
    toast.error("ID de la promesse introuvable.");
    return;
  }

  try {
    //  Mettre à jour le statut du pipeline vers "CLOSED_WON"
    await updateSalePromiseStatus({
      id: Number(id),
      newStatus: "CLOSED_WON",
      performedById: 1, // ton userId connecté
      action: "Validation de la promesse (Fermé - Gagné)",
    }).unwrap();

    //  Mettre à jour localement le selecteur
    setSelectedStage("CLOSED_WON");

    // Rediriger vers la page des ventes avec la promesse validée
    toast.success("Promesse validée avec succès !");
      router.push(`/${institution}/sales?salePromiseId=${salepromise?.id}`);
  } catch (error) {
    console.error("Erreur lors de la validation :", error);
    toast.error("Erreur lors de la validation de la promesse.");
  }
};


  if (isLoading) return <div className="p-6 text-center">Chargement...</div>;
  if (!salepromise) return <div className="p-6 text-center">Réclamation non trouvée</div>;

  return (
    <>
    <div className="container mx-auto p-4 max-w-4xl border">
      {/* Bouton retour */}
      <div className="mb-4">
        <Button 
          onClick={handleGoBack}
          variant="outline"
          className="flex items-center gap-2"
        >
          <ChevronLeft className="w-5 h-5" />
        </Button>
      </div>

      {/* Titres et boutons actions */}
      <div className="flex flex-col items-center gap-4 mb-6">
        <h1 className="text-2xl font-bold ">
          Détails de la promesse d&apos;achat
        </h1>
        {salepromise.status === "validated" ? (
          <div className=""></div>
        ) : (
        <div className="flex gap-5">
          <Button
            onClick={() => setOpen(true)}
            variant="destructive"
            className="px-6 py-2"
          >
            Annuler promesse
          </Button>
          {new Date() > new Date(salepromise.dueDate) ? (
            <div className="text-red-600">Date d'échéance dépassée</div>
          ) : (
           <Button onClick={handleValidate}>Valider promesse</Button>
          )}
        </div>
        )}

        <div className="mb-4">
  <label className="font-semibold mr-2">Étape du pipeline :</label>
   <Select value={selectedStage} onValueChange={(stage) => handleUpdateStatus(stage, `Passage à l’étape ${stage}`)}>
    <SelectTrigger className="w-64">
      <SelectValue placeholder="Sélectionner une étape" />
    </SelectTrigger>
    <SelectContent>
      <SelectItem value="LEAD_CAPTURED">Lead capté</SelectItem>
      <SelectItem value="CAPTURED">Capté</SelectItem>
      <SelectItem value="CONTACTED">Contacté</SelectItem>
      <SelectItem value="QUALIFIED">Qualifié</SelectItem>
      <SelectItem value="PROPOSAL_SENT">Proposition envoyée</SelectItem>
      <SelectItem value="NEGOTIATION">Négociation</SelectItem>
      <SelectItem value="CLOSED_WON">Fermé - Gagné</SelectItem>
      <SelectItem value="CLOSED_LOST">Fermé - Perdu</SelectItem>
    </SelectContent>
  </Select>
</div>

      </div>

      {/* Infos générales */}
      <div className="p-6 rounded-lg shadow-md mb-6">
        <h2 className="font-semibold text-xl mb-4 text-center">
          Informations
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-3">
            <p className={salepromise.status === "validated" ? "text-green-600" : "text-orange-600"}>
               Statut: <b>{
                 salepromise.status === "validated" ? "Promesse honorée" :
                 new Date() > new Date(salepromise.dueDate) ? "Expirée" : "En attente"
               }</b>
            </p>
            <p>
              Date de création :{" "}
              <b>{new Date(salepromise.createdAt).toLocaleDateString()}</b>
            </p>
           
            <p>
              Date de rappel :{" "}
              <b>{new Date(salepromise.reminderDate).toLocaleDateString()}</b>
            </p>
            <p>
              Date d&apos;échéance :{" "}
              <b>{new Date(salepromise.dueDate).toLocaleDateString()}</b>
            </p>
             <p>
              Remise : <b>{salepromise.discount} F CFA</b>
            </p>
            <p>
              Total : <b>{salepromise.total_amount} F CFA</b>
            </p>
            
          </div>
          <div className="space-y-3">
            <p>
              Nom du client :{" "}
              <b>{salepromise.customer?.name || salepromise.customer_name}</b>
            </p>
            <p>
              Numéro du client :{" "}
              <b>{salepromise.customer?.phone || salepromise.customer_phone}</b>
            </p>
            <p>
              Adresse du client :{" "}
              <b>
                {salepromise.customer?.quarter || salepromise.customer_address}
              </b>
            </p>
            <p>
              Note : <b>{salepromise.note}</b>
            </p>
            <p>
              Initiateur :{" "}
              <b>
                {salepromise.user
                  ? `${salepromise.user.firstName} ${salepromise.user.lastName}`
                  : salepromise.customer?.name || "Inconnu"}
              </b>
            </p>
            
          </div>
        </div>
      </div>

      {/* Liste des produits */}
      <Card className="shadow-lg">
        <CardHeader>
          <CardTitle className="">
            Liste des produits reservés
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full border text-sm">
              <thead className="">
                <tr>
                  <th className="text-center py-2 border">Produit</th>
                  <th className="text-center py-2 border">Qté</th>
                  <th className="text-center py-2 border">Prix unitaire</th>
                  <th className="text-center py-2 border">Total</th>
                </tr>
              </thead>
              <tbody>
                {salepromise.items.map((item) => (
                  <tr key={item.id} className="hover:bg-gray-50">
                    <td className="py-2 text-center border">
                      {item.product?.designation}
                    </td>
                    <td className="py-2 text-center border">
                      {item.product_quantity}
                    </td>
                    <td className="py-2 text-center border">
                      {item.product_sale_price} FCFA
                    </td>
                    <td className="py-2 text-center border">
                      {item.totalPrice} FCFA
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
    <Dialog open={open} onOpenChange={setOpen}>
         <DialogContent>
           <DialogHeader>
             <DialogTitle>Confirmation</DialogTitle>
             <DialogDescription>
               Voulez-vous vraiment Annuler votre commande ?
             </DialogDescription>
           </DialogHeader>
           <DialogFooter>
             <DialogCancel onClick={() => setOpen(false)}>Annuler</DialogCancel>
             <DialogAction onClick={handleCancel}>Oui</DialogAction>
           </DialogFooter>
         </DialogContent>
       </Dialog>
       </>
  );
};

export default SalepromisePage;


