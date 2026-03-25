"use client"

import { Row } from "@tanstack/react-table"
import { MoreHorizontal } from "lucide-react"
import { useDeleteRoleMutation, useDeleteInventoryMutation } from "@/state/api"
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
import UserPrivateComponent from "../../components/usePrivateComponent";

interface DataTableRowActionsProps<TData> {
  row: Row<TData>
}

export function DataTableRowActions<TData>({
  row,
}: DataTableRowActionsProps<TData>) {
  const router = useRouter();
  const inventoryId = (row.original as any).id;
  console.log("saleId :", inventoryId)
  const [deleteInventory] = useDeleteInventoryMutation()
  const [open, setOpen] = useState(false);
  const { institution } = useParams() as { institution: string }
  const handleDelete = async () => {
    if (!inventoryId) {
      toast.error("ID de la commande introuvable.")
      return
    }
    try {
      await deleteInventory(inventoryId).unwrap()
      //console.log("Commande supprimé avec succès")
      toast.success("Inventaire supprimé, réactualisez la page")
      router.push(`/${institution}/inventory/all`);
     
    } catch (error) {
      console.log("Erreur lors de la suppression :")
      toast.error("Erreur lors de lq suppression");
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
        <DropdownMenuItem onClick={() => router.push(`/${institution}/inventory/${inventoryId}`)}>
          Voir👀
        </DropdownMenuItem>
        <UserPrivateComponent permission="delete-inventory">
           <DropdownMenuItem onSelect={() => setOpen(true)} className="text-red-600">
              Supprimer🗑
            </DropdownMenuItem>
          </UserPrivateComponent>
        {/* <DropdownMenuSeparator /> */}
      </DropdownMenuContent>
    </DropdownMenu>

    <Dialog open={open} onOpenChange={setOpen}>
     <DialogContent>
       <DialogHeader>
         <DialogTitle>Confirmation</DialogTitle>
         <DialogDescription>
           Voulez-vous vraiment Supprimer cet inventaire ?
         </DialogDescription>
       </DialogHeader>
       <DialogFooter>
         <DialogCancel onClick={() => setOpen(false)}>Annuler</DialogCancel>
         <DialogAction onClick={handleDelete}>Oui</DialogAction>
       </DialogFooter>
     </DialogContent>
   </Dialog>
   </>
    
  )
}
