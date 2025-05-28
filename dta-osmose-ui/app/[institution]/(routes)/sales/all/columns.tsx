"use client"

import { ColumnDef } from "@tanstack/react-table"

import { Badge } from "@/components/ui/badge"
import { Checkbox } from "@/components/ui/checkbox"

import { SaleInvoice } from "@/state/api"
import { DataTableColumnHeader } from "../../user/all/table/components/data-table-column-header"
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
  
  //{new Date(sale.createdAt).toLocaleDateString()}
  {
    accessorKey: "customer.name",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Client" />
    ),
    cell: ({ row }) => {
      const designation = row.original.customer?.name ?? "aucun";
      return <div className="w-[120px]">{designation}</div>;
    },
  },

  {
    accessorKey: "customer.type_customer",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Type Client" />
    ),
    cell: ({ row }) => {
      const designation2 = row.original.customer?.type_customer ?? "aucun";
      return <div className="w-[80px]">{designation2}</div>;
    },
  },

  {
    accessorKey: "user.firstName",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Vendeur" />
    ),
    cell: ({ row }) => {
      const designation1 = row.original.user?.firstName ?? "aucun";
      const forename = row.original.user?.lastName ?? "aucun"
      return <div className="w-[120px]">{designation1} {forename}</div>;
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
