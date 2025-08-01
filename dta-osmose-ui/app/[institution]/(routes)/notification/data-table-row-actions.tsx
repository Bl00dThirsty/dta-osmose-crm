"use client"

import { Row } from "@tanstack/react-table"
import { MoreHorizontal } from "lucide-react"
import { useDeleteNotificationsMutation, useDeleteSaleInvoiceMutation } from "@/state/api"
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

interface DataTableRowActionsProps<TData> {
  row: Row<TData>
}

export function DataTableRowActions<TData>({
  row,
}: DataTableRowActionsProps<TData>) {
  const router = useRouter();
  const NotifId = (row.original as any).id;
 
  console.log("NotifId :", NotifId)
  const [deleteNotif] = useDeleteNotificationsMutation()
  const [open, setOpen] = useState(false);
  const { institution } = useParams() as { institution: string }
  const handleDelete = async () => {
    if (!NotifId) {
      toast.error("ID de la commande introuvable.")
      return
    }
   
    console.log("NotifId :",NotifId)
    try {
      await deleteNotif(NotifId).unwrap()
      console.log("Notification supprimée avec succès")
      toast.success("Notification supprimée, réactualisez la page")
      router.push(`/${institution}/notification`);
     
    } catch (error) {
      console.log("Erreur lors de la suppression :")
      toast.error("Erreur lors de la suppression de la notification");
    }
  }

  return (
    <>
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          className="flex h-8 w-8 p-0 data-[state=open]:bg-muted bg-red-600"
        >
          ✖
          <span className="sr-only">Open menu</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-[160px]">
        
        <DropdownMenuItem onSelect={() => setOpen(true)} className="text-red-600">
              Supprimer🗑
        </DropdownMenuItem>
        {/* <DropdownMenuSeparator /> */}
      </DropdownMenuContent>
    </DropdownMenu>

    <Dialog open={open} onOpenChange={setOpen}>
     <DialogContent>
       <DialogHeader>
         <DialogTitle>Confirmation</DialogTitle>
         <DialogDescription>
           Voulez-vous vraiment Supprimer cette notification ?
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
