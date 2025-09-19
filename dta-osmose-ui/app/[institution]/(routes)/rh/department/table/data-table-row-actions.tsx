"use client"

import { Row } from "@tanstack/react-table"
import { MoreHorizontal } from "lucide-react"
import { useRouter } from 'next/navigation';
import { Button } from "@/components/ui/button"
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
import { ToastContainer, toast } from 'react-toastify';
import { useDeleteDepartmentsMutation, } from "@/state/api"
import { useParams } from "next/navigation";
import { labels } from "@/app/[institution]/(routes)/crm/products/table/data/data"
import UserPrivateComponent from "../../../components/usePrivateComponent";
interface DataTableRowActionsProps<TData> {
  row: Row<TData>
}

export function DataTableRowActions<TData>({
  row,
}: DataTableRowActionsProps<TData>) {
  const router = useRouter();
  const designation = row.original as any
  const { institution } = useParams() as { institution: string }
  const [deleteDesignation] = useDeleteDepartmentsMutation()
  const [open, setOpen] = useState(false);

  const handleDelete = async () => {
    try {
      await deleteDesignation(designation.id).unwrap()
      //console.log("Designation supprimé avec succès")
      toast.success("Designation supprimé avec succès")
      setOpen(false); // <-- Fermer la modale AVANT de rediriger
      setTimeout(() => {
        
      router.push(`/${institution}/rh/department`);
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
        
        <UserPrivateComponent permission="delete-department">
            <DropdownMenuItem onSelect={() => setOpen(true)} className="text-red-600">
              Supprimer🗑
            </DropdownMenuItem>
         </UserPrivateComponent> 
        <DropdownMenuSeparator />
      </DropdownMenuContent>
    </DropdownMenu>

     <Dialog open={open} onOpenChange={setOpen}>
     <DialogContent>
       <DialogHeader>
         <DialogTitle>Confirmation</DialogTitle>
         <DialogDescription>
           Voulez-vous vraiment supprimer ce department ?
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
