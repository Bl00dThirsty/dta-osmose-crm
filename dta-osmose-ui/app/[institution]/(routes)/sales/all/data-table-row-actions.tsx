"use client"

import { Row } from "@tanstack/react-table"
import { MoreHorizontal } from "lucide-react"
import { useDeleteRoleMutation, useDeleteSaleInvoiceMutation } from "@/state/api"
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
  const saleId = (row.original as any).id;
  const delivred = (row.original as any).delivred === true
  console.log("saleId :", saleId)
  const [deleteSaleInvoice] = useDeleteSaleInvoiceMutation()
  const [open, setOpen] = useState(false);
  const { institution } = useParams() as { institution: string }
  const handleDelete = async () => {
    if (!saleId) {
      toast.error("ID de la commande introuvable.")
      return
    }
    if (delivred) {
      toast.warning("Impossible d'annuler une commande déjà livrée.")
      return
    }
    console.log("saleId :", saleId)
    try {
      await deleteSaleInvoice(saleId).unwrap()
      console.log("Commande supprimé avec succès")
      router.push(`/${institution}/sales/all`);
    } catch (error) {
      console.log("Erreur lors de la suppression :")
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
        <DropdownMenuItem onClick={() => router.push(`/${institution}/sales/${saleId}`)}>
          Voir👀
        </DropdownMenuItem>
        <DropdownMenuItem
            onSelect={(e) => {
              e.preventDefault()
              if (delivred) {
                toast.info("Cette commande a déjà été livrée et ne peut pas être annulée.")
                return
              }
              setOpen(true)
            }}
            disabled={delivred}
            className={delivred ? "text-red-600" : "text-red-600"}
          >
            {delivred ? "Commande Livrée" : "Annuler Commande"}
          </DropdownMenuItem>
        {/* <DropdownMenuSeparator /> */}
      </DropdownMenuContent>
    </DropdownMenu>

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
         <DialogAction onClick={handleDelete}>Oui</DialogAction>
       </DialogFooter>
     </DialogContent>
   </Dialog>
   </>
    
  )
}
