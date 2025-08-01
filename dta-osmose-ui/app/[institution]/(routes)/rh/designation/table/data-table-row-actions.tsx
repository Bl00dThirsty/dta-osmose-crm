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
import { useDeleteDesignationMutation } from "@/state/api"
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useParams } from "next/navigation";
import { labels } from "@/app/[institution]/(routes)/crm/products/table/data/data"

interface DataTableRowActionsProps<TData> {
  row: Row<TData>
}

export function DataTableRowActions<TData>({
  row,
}: DataTableRowActionsProps<TData>) {
  const router = useRouter();
  const designation = row.original as any
  const { institution } = useParams() as { institution: string }
  const [deleteDesignation] = useDeleteDesignationMutation()
  const [open, setOpen] = useState(false);
  const showToastMessage = () => {
    return toast.success('🦄 Designation supprimé avec succès !', {
      position: "top-right",
      autoClose: 5000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      progress: undefined,
    });
  };

  const showErrorToast = () => {
    return toast.error('Erreur lors de la suppression  !', {
      position: "top-left",
      autoClose: 5000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      progress: undefined,
    });
  };

  const handleDelete = async () => {
    try {
      await deleteDesignation(designation.id).unwrap()
      console.log("Designation supprimé avec succès")
      showToastMessage();
      setOpen(false); // <-- Fermer la modale AVANT de rediriger
      setTimeout(() => {
      router.push(`/${institution}/rh/designation`);
    }, 500);
      
    } catch (error) {
      console.log("Erreur lors de la suppression :");
      showErrorToast();
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
        {/* <DropdownMenuItem>Modifier</DropdownMenuItem> */}
        
            <DropdownMenuItem onSelect={() => setOpen(true)} className="text-red-600">
              Supprimer
            </DropdownMenuItem>
          
        <DropdownMenuSeparator />
      </DropdownMenuContent>
    </DropdownMenu>

     <Dialog open={open} onOpenChange={setOpen}>
     <DialogContent>
       <DialogHeader>
         <DialogTitle>Confirmation</DialogTitle>
         <DialogDescription>
           Voulez-vous vraiment supprimer ce poste ?
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
