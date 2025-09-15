"use client"

import { ColumnDef } from "@tanstack/react-table"
import { Button } from '@/components/ui/button'
import { Badge } from "@/components/ui/badge"
import { Checkbox } from "@/components/ui/checkbox"
import { useRouter, useParams } from 'next/navigation';
import { Claim } from "@/state/api"
import { DataTableColumnHeader } from "../../user/all/table/components/data-table-column-header"
import { DataTableRowActions } from "./data-table-row-actions"



const statusMap: Record<string, { label: string, color: string }> = {
  "true": { label: "Actif", color: "green" },
  "false": { label: "Inactif", color: "red" },
}


export const columns: ColumnDef<Claim>[] = [
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
  // {
  //   accessorKey: "id",
  //   header: ({ column }) => (
  //     <DataTableColumnHeader column={column} title="N°" />
  //   ),
  //   cell: ({ row }) => <div className="w-[120px] truncate whitespace-nowrap overflow-hidden text-ellipsis">{row.getValue("id")}</div>,
  // },
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
      
      return <div className="w-[120px]">{formattedDate}</div>;
    },
  },
  
  //{new Date(sale.createdAt).toLocaleDateString()}
  {
    accessorKey: "invoice.invoiceNumber",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="N° Commande" />
    ),
    cell: ({ row }) => {
      const designation1 = row.original.invoice?.invoiceNumber ?? "aucun";
      return <div className="w-[120px]">{designation1}</div>;
    },
  },

  {
    accessorKey: "invoice.customer?.name",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Nom du client" />
    ),
    cell: ({ row }) => {
      const designation2 = row.original.invoice?.customer?.name ?? "aucun";
      return <div className="w-[120px]">{designation2}</div>;
    },
  },


  
  {
    accessorKey: "response",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Réponse" />
    ),
    cell: ({ row }) => {
      const response = row.original.response?.status as 
        | 'ACCEPTED' 
        | 'REJECTED' 
        | 'PENDING' 
        | undefined;
      
      const getStatusConfig = (status: typeof response) => {
        switch (status) {
          case 'ACCEPTED':
            return { className: 'bg-green-500', label: 'ACCEPTÉ' };
          case 'REJECTED':
            return { className: 'bg-red-500', label: 'REJETÉ' };
          default:
            return { className: 'bg-yellow-500', label: 'EN ATTENTE' };
        }
      };
      
      const { className, label } = getStatusConfig(response);
  
      return (
        <Button
          className={`px-2 py-1 rounded text-white ${className}`}
          size="sm"
          variant="outline"
        >
          {label}
        </Button>
      );
    },
 },

  {
    accessorKey: "totalAmount",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Montant de la Réclamation" />
    ),
    cell: ({ row }) => <div className="w-[80px]">{row.getValue("totalAmount")} FCFA</div>,
  },

  // {
  //   accessorKey: "reason",
  //   header: ({ column }) => (
  //     <DataTableColumnHeader column={column} title="Nature de la Réclamation" />
  //   ),
  //   cell: ({ row }) => <div className="w-[60px]">{row.getValue("reason")}</div>,
  // },
 
  {
    id: "actions",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Actions" />
    ),
    cell: ({ row }) => <DataTableRowActions row={row} />,
  },
]
