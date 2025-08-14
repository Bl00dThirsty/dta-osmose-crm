"use client"

import { Row } from "@tanstack/react-table"
import { MoreHorizontal } from "lucide-react"
import Modal from "@/components/ui/modal";
import { PlusIcon } from "lucide-react";
import { Button } from "@/components/ui/button"
import { useRouter } from 'next/navigation';
import { useDeleteUserMutation } from "@/state/api"
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
import { ToastContainer, toast } from 'react-toastify';
import { useParams } from "next/navigation"
import { useState } from "react"
import { labels } from "@/app/[institution]/(routes)/crm/products/table/data/data"

interface DataTableRowActionsProps<TData> {
  row: Row<TData>
}

export function DataTableRowActions<TData>({
  row,
}: DataTableRowActionsProps<TData>) {
  const [open, setOpen] = useState(false);
  const router = useRouter();
  const { institution } = useParams() as { institution: string }
  // Supposons que ton utilisateur a un ID accessible par row.original.id
  const userId = (row.original as any).id;
  const [deleteUser] = useDeleteUserMutation()
  
  const handleDelete = async () => {
    try {
      await deleteUser(userId).unwrap()
      toast.success("Utilisateur supprimé avec succès")
      setOpen(false); // <-- Fermer la modale AVANT de rediriger
      setTimeout(() => {
        
      router.push(`/${institution}/user/all`);
      router.refresh();
    }, 500);
      // console.log("Utilisateur supprimé avec succès")
    } catch (error) {
      console.error("Erreur lors de la suppression :", error)
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
      <DropdownMenuItem onClick={() => router.push(`/${institution}/user/${userId}`)}>
          Voir👀
        </DropdownMenuItem>
      
        <DropdownMenuItem>Modifier</DropdownMenuItem>
        
            <DropdownMenuItem onSelect={() => setOpen(true)} className="text-red-600">
              Supprimer🗑
            </DropdownMenuItem>
          
        <DropdownMenuSeparator />
        
      </DropdownMenuContent>
    </DropdownMenu>

<Dialog open={open} onOpenChange={setOpen}>
<DialogContent>
  <DialogHeader>
    <DialogTitle>Confirmation</DialogTitle>
    <DialogDescription>
      Voulez-vous vraiment supprimer cette utilisateur ?
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
