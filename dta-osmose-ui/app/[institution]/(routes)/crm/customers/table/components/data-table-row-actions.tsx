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
import { useParams } from "next/navigation"
import { useState } from "react" 
import { useDeleteCustomerMutation } from "@/state/api"
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
  const { institution } = useParams() as { institution: string }
  const cutomerId = (row.original as any).id;
  const [deleteCustomer] = useDeleteCustomerMutation()
  const [open, setOpen] = useState(false);

  const handleDelete = async () => {
    try {
      await deleteCustomer(cutomerId).unwrap()
      console.log("Designation supprimé avec succès")
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
        <DropdownMenuItem onClick={() => router.push(`/${institution}/crm/customers/${cutomerId}`)}>
          Voir
        </DropdownMenuItem>
        <DropdownMenuItem onSelect={() => setOpen(true)} className="text-red-600">
              Supprimer
            
        </DropdownMenuItem>
        <DropdownMenuItem>
          Modifier
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>

<Dialog open={open} onOpenChange={setOpen}>
<DialogContent>
  <DialogHeader>
    <DialogTitle>Confirmation</DialogTitle>
    <DialogDescription>
      Voulez-vous vraiment supprimer ce client ?
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
