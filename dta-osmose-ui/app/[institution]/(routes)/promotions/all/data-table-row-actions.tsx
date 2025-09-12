"use client"

import { Row } from "@tanstack/react-table"
import { MoreHorizontal } from "lucide-react"
import { useUpdatePromotionsMutation, useDeletePromotionsMutation, useGetProductsQuery } from "@/state/api"
import { Button } from "@/components/ui/button"
import { useRouter } from 'next/navigation';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuSeparator,
  DropdownMenuShortcut,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
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
import { useState } from "react"
import { useParams } from "next/navigation"
import { toast } from "react-toastify";
import { Label } from "@/components/ui/label"

interface DataTableRowActionsProps<TData> {
  row: Row<TData>
}

export function DataTableRowActions<TData>({
  row,
}: DataTableRowActionsProps<TData>) {
  const router = useRouter();
  const promotionId = (row.original as any).id;    
  const [deletePromotions] = useDeletePromotionsMutation()
  const [updatePromotion] = useUpdatePromotionsMutation()
  const [open, setOpen] = useState(false);
  const [openUpdate, setOpenUpdate] = useState(false);
  const { institution } = useParams() as { institution: string }
  const { data: products = [] } = useGetProductsQuery({ institution });
 const [formData, setFormData] = useState({
  title: "",
  startDate: "",
  endDate: "",
  discount: 0,
  productId: "",
});

const handleOpenUpdate = () => {
  const promotion = row.original as any;
  setFormData({
    title: promotion.title || "",
    startDate: promotion.startDate
      ? new Date(promotion.startDate).toISOString().split("T")[0]
      : "",
    endDate: promotion.endDate
      ? new Date(promotion.endDate).toISOString().split("T")[0]
      : "",
    discount: promotion.discount || 0,
    productId: promotion.productId || "",
  });
  setOpenUpdate(true);
};
//const finalPrice = productPrice - (productPrice * discount) / 100;
const selectedProduct = products.find((p: any) => String(p.id) === formData.productId);
const productPrice = selectedProduct?.sellingPriceTTC ?? 0;

  // Calcul du prix final avec remise
  const finalPrice = productPrice - (productPrice * formData.discount) / 100;


const handleUpdate = async () => {
  try {
    await updatePromotion({
      id: promotionId,
      ...formData,
      startDate: new Date(formData.startDate),
      endDate: new Date(formData.endDate),
    }).unwrap();
    toast.success("Promotion mise à jour avec succès");
    setOpenUpdate(false);
    setTimeout(() => {
      router.push(`/${institution}/promotions/all`);
    }, 500);
  } catch (error) {
    console.error("Erreur update:", error);
    toast.error("Erreur lors de la mise à jour");
    setOpenUpdate(false);
  }
};

  const handleDelete = async () => {
    try {
        await deletePromotions(promotionId).unwrap()
        //console.log("Designation supprimé avec succès")
        toast.success("Promotions supprimé avec succès, Réactualisez la page")
        setOpen(false); // <-- Fermer la modale AVANT de rediriger
        setTimeout(() => {
          
        router.push(`/${institution}/promotions/all`);
        // router.refresh();
      }, 500);
        //router.push(`/${institution}/rh/department`);
      } catch (error) {
        //console.log("Erreur lors de la suppression :")
        toast.error("Erreur lors de la suppression")
      }
  }

  return (
    <>
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          className="flex h-8 w-8 p-0 data-[state=open]:bg-muted"
        >
          <MoreHorizontal />
          <span className="sr-only">Open menu</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-[160px]">
        <DropdownMenuItem onClick={() => router.push(`/${institution}/promotions/${promotionId}`)}>
          Voir👀
        </DropdownMenuItem>
        <DropdownMenuItem onClick={handleOpenUpdate}>
          Modifier✒          
        </DropdownMenuItem>
        <DropdownMenuItem onSelect={() => setOpen(true)} className="text-red-600">Supprimer🗑</DropdownMenuItem>
        {/* <DropdownMenuSeparator /> */}
      </DropdownMenuContent>
      
      {/* boite de dialogue pour la confirmation de suppression */}
    </DropdownMenu>
      <Dialog open={open} onOpenChange={setOpen}>
         <DialogContent>
           <DialogHeader>
             <DialogTitle>Confirmation</DialogTitle>
             <DialogDescription>
               Voulez-vous vraiment supprimer cette Promotion ?
             </DialogDescription>
           </DialogHeader>
           <DialogFooter>
             <DialogCancel onClick={() => setOpen(false)}>Annuler</DialogCancel>
             <DialogAction onClick={handleDelete}>Oui</DialogAction>
           </DialogFooter>
         </DialogContent>
       </Dialog>
       {/* boite de dialogue pour l'update d'une promotion */}
      <Dialog open={openUpdate} onOpenChange={setOpenUpdate}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Modifier le produit</DialogTitle>
          </DialogHeader>
              <div className="grid gap-4 py-4">
                 <Label htmlFor="title">Titre</Label>
                  <input
                    type="text"
                    placeholder="Ajouter un titre"
                    value={formData.title}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                    className="border p-2 rounded"
                  />
                  <Label className="mb-2">Produit</Label>
                    <select
                      className="w-full border border-gray-300 rounded px-3 py-2 mb-5"
                      value={formData.productId ?? ""}
                      onChange={(e) => setFormData({ ...formData, productId: e.target.value })}
                    >
                    <option value="">-- Sélectionner --</option>
                      {products.map((p: any) => (
                        <option key={p.id} value={p.id}>
                            {p.designation} ({p.sellingPriceTTC} FCFA)
                        </option>
                      ))}
                    </select>
                   <Label htmlFor="role">Remise(%)</Label>
                   <input
                      type="number"
                      placeholder="Remise"
                      value={formData.discount}
                      onChange={(e) => setFormData({ ...formData, discount: Number(e.target.value) })}
                      className="border p-2 rounded"
                    />
                    {finalPrice && (
                      <div>
                        <Label className="mb-2">Prix final (après remise)</Label>
                        <input
                          type="text"
                          readOnly
                          value={finalPrice > 0 ? `${finalPrice.toFixed(2)} FCFA` : ""}
                          className="border p-2 rounded"
                        />
                        </div>
                    )}
                   <Label htmlFor="startDate">Date début</Label>
                    <input
                        type="date"
                        value={formData.startDate}
                        onChange={(e) =>
                        setFormData({ ...formData, startDate: e.target.value })
                        }
                        className="border p-2 rounded"
                    />

                   <Label htmlFor="endDate">Date fin</Label>
                    <input
                      type="date"
                      value={formData.endDate}
                      onChange={(e) =>
                        setFormData({ ...formData, endDate: e.target.value })
                      }
                      className="border p-2 rounded"
                    />                 
              </div>
          <DialogFooter>
            <DialogCancel onClick={() => setOpenUpdate(false)}>Annuler</DialogCancel>
            <DialogAction onClick={handleUpdate}>Sauvegarder</DialogAction>
          </DialogFooter>
        </DialogContent>
      </Dialog>
   </>
    
    
  )
}
