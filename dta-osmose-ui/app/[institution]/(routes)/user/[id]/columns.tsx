"use client"

import { ColumnDef } from "@tanstack/react-table"
import { Button } from '@/components/ui/button'
import { Badge } from "@/components/ui/badge"
import { Checkbox } from "@/components/ui/checkbox"
import { useRouter, useParams } from 'next/navigation';
import { SaleInvoice, useUpdateSaleStatusMutation, User } from "@/state/api"
import { DataTableColumnHeader } from "../all/table/components/data-table-column-header"
import { DataTableRowActions } from "./data-table-row-actions"

const statusMap: Record<string, { label: string, color: string }> = {
  "true": { label: "Actif", color: "green" },
  "false": { label: "Inactif", color: "red" },
}


export const columns: ColumnDef<SaleInvoice>[] = [
  {
    id: "select",
    header: ({ table }) => (
      <Checkbox
        checked={
          table.getIsAllPageRowsSelected() ||
          (table.getIsSomePageRowsSelected() && "indeterminate")
        }
        onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
        aria-label="Select all"
        className="translate-y-[2px]"
      />
    ),
    cell: ({ row }) => (
      <Checkbox
        checked={row.getIsSelected()}
        onCheckedChange={(value) => row.toggleSelected(!!value)}
        aria-label="Select row"
        className="translate-y-[2px]"
      />
    ),
    enableSorting: false,
    enableHiding: false,
  },
  {
    accessorKey: "invoiceNumber",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="N° Facture" />
    ),
    cell: ({ row }) => <div className="w-[140px] truncate whitespace-nowrap overflow-hidden text-ellipsis">{row.getValue("invoiceNumber")}</div>,
  },
  {
    accessorKey: "createdAt",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Date" />
    ),
    cell: ({ row }) => {
      const rawDate = row.getValue("createdAt");
      const formattedDate = new Date(rawDate as string).toLocaleString("fr-FR", {
        year: "numeric",
        month: "2-digit",
        day: "2-digit",
        hour: "2-digit",
        minute: "2-digit",
      });
  
      return <div className="w-[160px]">{formattedDate}</div>;
    },
  },

  // Ajoutez ces colonnes à votre tableau
  {
    accessorKey: "ready",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Prêt" />
    ),
    cell: ({ row }) => {
      const [updateStatus] = useUpdateSaleStatusMutation();
      const isReady = row.getValue("ready");
      
      return (
        <Button
        className={`px-2 py-1 rounded text-white ${isReady ? 'bg-green-500' : 'bg-red-500'}`}
        size="sm"
        >
          
        
          {isReady ? "Oui" : "Non"}
        </Button>
      );
    },
  },
  {
    accessorKey: "delivred",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Livré" />
    ),
    cell: ({ row }) => {
      const [updateStatus] = useUpdateSaleStatusMutation();
      const isDelivred = row.getValue("delivred");
      const isReady = row.getValue("ready");
      
      return (
        <Button
        className={`px-2 py-1 rounded text-white ${isDelivred ? 'bg-green-500' : 'bg-red-500'}`}
          size="sm"
          disabled={!isReady}
        >
          {isDelivred ? "Oui" : "Non"}
        </Button>
      );
    },
  },

  
  {
    accessorKey: "finalAmount",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Montant Total" />
    ),
    cell: ({ row }) => <div className="w-[80px]">{row.getValue("finalAmount")} FCFA</div>,
  },
 
  {
    id: "actions",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Actions" />
    ),
    cell: ({ row }) => <DataTableRowActions row={row} />,
  },
]
