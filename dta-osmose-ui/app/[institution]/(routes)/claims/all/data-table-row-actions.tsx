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
  
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { useDeleteClaimMutation } from "@/state/api"
import { useParams } from "next/navigation"
import { useState } from "react"
import { ToastContainer, toast } from 'react-toastify';
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

interface DataTableRowActionsProps<TData> {
  row: Row<TData>
}

export function DataTableRowActions<TData>({
  row,
}: DataTableRowActionsProps<TData>) {
  const router = useRouter();
  const claimId = (row.original as any).id;
  const delivred = (row.original as any).delivred === true
  console.log("claimId :", claimId)

  const { institution } = useParams() as { institution: string }
  const [deleteClaim] = useDeleteClaimMutation()
    const [open, setOpen] = useState(false);
  
    const handleDelete = async () => {
      try {
        await deleteClaim(claimId).unwrap()
        //console.log("Designation supprimé avec succès")
        toast.success("Réclamation supprimé avec succès")
        setOpen(false); // <-- Fermer la modale AVANT de rediriger
        setTimeout(() => {
          
        router.push(`/${institution}/claims/all`);
        router.refresh();
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
        <DropdownMenuItem onClick={() => router.push(`/${institution}/claims/${claimId}`)}>
          Voir👀
        </DropdownMenuItem>
        
        <DropdownMenuItem onSelect={() => setOpen(true)} className="text-red-600">
              Supprimer🗑
        </DropdownMenuItem>
      </DropdownMenuContent>
        {/* <DropdownMenuSeparator /> */}
     
    </DropdownMenu>
     <Dialog open={open} onOpenChange={setOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Confirmation</DialogTitle>
              <DialogDescription>
                Voulez-vous vraiment supprimer cette réclamation ?
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
