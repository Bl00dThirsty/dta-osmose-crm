"use client"

import { ColumnDef } from "@tanstack/react-table"
import { Button } from '@/components/ui/button'
import { Badge } from "@/components/ui/badge"
import { Checkbox } from "@/components/ui/checkbox"
import { useRouter, useParams } from 'next/navigation';
import { SaleInvoice, salePromise } from "@/state/api"
import { DataTableColumnHeader } from "../../user/all/table/components/data-table-column-header"
import { DataTableRowActions } from "./data-table-row-actions"

const statusMap: Record<string, { label: string, color: string }> = {
  "true": { label: "Actif", color: "green" },
  "false": { label: "Inactif", color: "red" },
}


export const columns: ColumnDef<salePromise>[] = [
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
    accessorKey: "id",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="ID" />
    ),
    cell: ({ row }) => <div className="w-[40px] truncate whitespace-nowrap overflow-hidden text-ellipsis">{row.getValue("id")}</div>,
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
  
  //{new Date(sale.createdAt).toLocaleDateString()}
  {
    id: "customer.name",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Client" />
    ),
    cell: ({ row }) => {
      const designation = row.original.customer?.name ?? row.original.customer_name;
      return <div className="w-[120px]">{designation}</div>;
    },
  },


  {
    accessorKey: "user.firstName",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Initiateur" />
    ),
    cell: ({ row }) => {
      const designation1 = row.original.user?.firstName ?? "aucun";
      const forename = row.original.user?.lastName ?? "aucun"
      return <div className="w-[120px]">{row.original.user 
                 ? `${row.original.user.firstName} ${row.original.user.lastName}` 
               : row.original.customer?.name || 'Inconnu'}</div>;
    },
  },
  {
    accessorKey: "total_amount",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Montant Total" />
    ),
    cell: ({ row }) => <div className="w-[80px]">{row.getValue("total_amount")} FCFA</div>,
  },


  {
    accessorKey: "dueDate",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Date d'échéance" />
    ),
    cell: ({ row }) => {
      const rawDate = row.getValue("dueDate");
      const formattedDate = new Date(rawDate as string).toLocaleString("fr-FR", {
        year: "numeric",
        month: "2-digit",
        day: "2-digit",
      });
  
      return <div className="w-[160px]">{formattedDate}</div>;
    },
  },

  {
    accessorKey: "reminderDate",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Date de rappel" />
    ),
    cell: ({ row }) => {
      const rawDate = row.getValue("reminderDate");
      const formattedDate = new Date(rawDate as string).toLocaleString("fr-FR", {
        year: "numeric",
        month: "2-digit",
        day: "2-digit",
      });
  
      return <div className="w-[100px]">{formattedDate}</div>;
    },
  },

  {
  accessorKey: "status",
  header: ({ column }) => (
    <DataTableColumnHeader column={column} title="Statut" />
  ),
  cell: ({ row }) => {
    const status = row.getValue("status");
    
    const statusConfig = {
      validated: { text: "Honorée", color: "text-green-500" },
      expired: { text: "Expirée", color: "text-red-500" },
      pending: { text: "En attente", color: "text-orange-500" }
    };
    
    const config = statusConfig[status as keyof typeof statusConfig] || 
                  { text: "Inconnu", color: "text-gray-500" };
    
    return (
      <p className={`font-medium ${config.color}`}>
        {config.text}
      </p>
    );
  },
},
  
 
  {
    id: "actions",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Actions" />
    ),
    cell: ({ row }) => <DataTableRowActions row={row} />,
  },
]
