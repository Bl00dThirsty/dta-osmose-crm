"use client"

import { Row } from "@tanstack/react-table"
import { MoreHorizontal } from "lucide-react"
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
import { useDeleteReportMutation } from "@/state/api"
import { useParams } from "next/navigation"
import { toast } from "react-toastify";
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

interface DataTableRowActionsProps<TData> {
  row: Row<TData>
}

export function DataTableRowActions<TData>({
  row,
}: DataTableRowActionsProps<TData>) {
  const router = useRouter();
  const reportId = (row.original as any).id;
  const { institution } = useParams() as { institution: string }
  const [open, setOpen] = useState(false);
  const [deleteUser] = useDeleteReportMutation()
    
  const handleDelete = async () => {
      try {
        await deleteUser(reportId).unwrap()
        toast.success("Rapport supprimé avec succès, Réactualisez la page")
        setOpen(false); // <-- Fermer la modale AVANT de rediriger
        setTimeout(() => {
          
        router.push(`/${institution}/report/all`);
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
        <DropdownMenuItem onClick={() => router.push(`/${institution}/report/${reportId}`)}>
          Voir👀
        </DropdownMenuItem>
        <DropdownMenuItem onSelect={() => setOpen(true)} className="text-red-600">
          Supprimer🗑
        </DropdownMenuItem>
                  
        <DropdownMenuSeparator />
        {/* <DropdownMenuSeparator /> */}
      </DropdownMenuContent>
    </DropdownMenu>

    <Dialog open={open} onOpenChange={setOpen}>
    <DialogContent>
      <DialogHeader>
        <DialogTitle>Confirmation</DialogTitle>
        <DialogDescription>
          Voulez-vous vraiment supprimer ce rapport ?
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
