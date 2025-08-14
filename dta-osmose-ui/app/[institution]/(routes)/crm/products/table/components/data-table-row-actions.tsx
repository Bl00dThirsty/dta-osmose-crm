"use client"

import { Row } from "@tanstack/react-table"
import { MoreHorizontal } from "lucide-react"
import { useParams } from "next/navigation"
import { useRouter } from 'next/navigation';
import { Button } from "@/components/ui/button"
import { useDeleteProductMutation, useUpdateProductMutation } from "@/state/api"
import { toast } from 'react-toastify';
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
import { useState } from "react"
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
import { labels } from "../data/data"
import { Label } from "@/components/ui/label"
interface DataTableRowActionsProps<TData> {
  row: Row<TData>
}

export function DataTableRowActions<TData>({
  row,
}: DataTableRowActionsProps<TData>) {
  const router = useRouter();
  const { institution } = useParams() as { institution: string }
  const productId = (row.original as any).id;
  const [deleteProduct] = useDeleteProductMutation()
  const [open, setOpen] = useState(false);
  const [updateProduct] = useUpdateProductMutation();
  const [openUpdate, setOpenUpdate] = useState(false);
  const [formData, setFormData] = useState({
    EANCode: "",
    brand: "",
    designation: "",
    quantity: 0,
    purchase_price: 0,
    sellingPriceTTC: 0,
    restockingThreshold: 0,
    warehouse: ""
  });

const handleOpenUpdate = () => {
  const product = row.original as any;
  setFormData({
    EANCode: product.EANCode || "",
    brand: product.brand || "",
    designation: product.designation || "",
    quantity: product.quantity || 0,
    purchase_price: product.purchase_price || 0,
    sellingPriceTTC: product.sellingPriceTTC || 0,
    restockingThreshold: product.restockingThreshold || 0,
    warehouse: product.warehouse || ""
  });
  setOpenUpdate(true);
};
const handleUpdate = async () => {
  try {
    await updateProduct({ id: productId, ...formData }).unwrap();
    toast.success("Produit mis à jour avec succès");
    setOpenUpdate(false);
    setTimeout(() => {
      router.push(`/${institution}/crm/products`);
    }, 500);
  } catch (error) {
    console.error("Erreur update:", error);
    toast.error("Erreur lors de la mise à jour");
    setOpenUpdate(false);
    
  }
};

    const handleDelete = async () => {
      try {
        await deleteProduct(productId).unwrap()
        //console.log("Designation supprimé avec succès")
        toast.success("Produit supprimé avec succès")
        setOpen(false); // <-- Fermer la modale AVANT de rediriger
        setTimeout(() => {
          
        router.push(`/${institution}/crm/products`);
        router.refresh();
      }, 500);
        //router.push(`/${institution}/rh/department`);
      } catch (error) {
        console.log("Erreur lors de la suppression :")
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
      <DropdownMenuItem onClick={() => router.push(`/${institution}/crm/products/${productId}`)}>
          Voir👀
      </DropdownMenuItem>
      <DropdownMenuItem onClick={handleOpenUpdate}>
          Modifier✒          
        </DropdownMenuItem>
      <DropdownMenuItem onSelect={() => setOpen(true)} className="text-red-600">Supprimer🗑</DropdownMenuItem>
         
      </DropdownMenuContent>
    </DropdownMenu>
       <Dialog open={open} onOpenChange={setOpen}>
         <DialogContent>
           <DialogHeader>
             <DialogTitle>Confirmation</DialogTitle>
             <DialogDescription>
               Voulez-vous vraiment supprimer ce Produit ?
             </DialogDescription>
           </DialogHeader>
           <DialogFooter>
             <DialogCancel onClick={() => setOpen(false)}>Annuler</DialogCancel>
             <DialogAction onClick={handleDelete}>Oui</DialogAction>
           </DialogFooter>
         </DialogContent>
       </Dialog>
       <Dialog open={openUpdate} onOpenChange={setOpenUpdate}>
  <DialogContent>
    <DialogHeader>
      <DialogTitle>Modifier le produit</DialogTitle>
    </DialogHeader>
    <div className="grid gap-4 py-4">
      <Label htmlFor="role">EAN Code</Label>
      <input
        type="text"
        placeholder="EAN Code"
        value={formData.EANCode}
        onChange={(e) => setFormData({ ...formData, EANCode: e.target.value })}
        className="border p-2 rounded"
      />
      <Label htmlFor="role">Marque</Label>
      <input
        type="text"
        placeholder="Marque"
        value={formData.brand}
        onChange={(e) => setFormData({ ...formData, brand: e.target.value })}
        className="border p-2 rounded"
      />
      <Label htmlFor="role">Désignation</Label>
      <input
        type="text"
        placeholder="Désignation"
        value={formData.designation}
        onChange={(e) => setFormData({ ...formData, designation: e.target.value })}
        className="border p-2 rounded"
      />
      <Label htmlFor="role">Quantité</Label>
      <input
        type="number"
        placeholder="Quantité"
        value={formData.quantity}
        onChange={(e) => setFormData({ ...formData, quantity: Number(e.target.value) })}
        className="border p-2 rounded"
      />
      <Label htmlFor="role">Prix d'achat</Label>
      <input
        type="number"
        placeholder="Prix achat"
        value={formData.purchase_price}
        onChange={(e) => setFormData({ ...formData, purchase_price: Number(e.target.value) })}
        className="border p-2 rounded"
      />
      <Label htmlFor="role">Prix vente TTC</Label>
      <input
        type="number"
        placeholder="Prix vente TTC"
        value={formData.sellingPriceTTC}
        onChange={(e) => setFormData({ ...formData, sellingPriceTTC: Number(e.target.value) })}
        className="border p-2 rounded"
      />
      <Label htmlFor="role">Seuil de réapprovisionnement</Label>
      <input
        type="number"
        placeholder="Seuil réapprovisionnement"
        value={formData.restockingThreshold}
        onChange={(e) => setFormData({ ...formData, restockingThreshold: Number(e.target.value) })}
        className="border p-2 rounded"
      />
      <Label htmlFor="role">Entrepôt</Label>
      <input
        type="text"
        placeholder="Entrepôt"
        value={formData.warehouse}
        onChange={(e) => setFormData({ ...formData, warehouse: e.target.value })}
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
