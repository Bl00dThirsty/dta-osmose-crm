"use client"

import { ColumnDef } from "@tanstack/react-table"
import { Button } from '@/components/ui/button'
import { Badge } from "@/components/ui/badge"
import { Checkbox } from "@/components/ui/checkbox"
import { useRouter, useParams } from 'next/navigation';
import { Inventory } from "@/state/api"
import { DataTableColumnHeader } from "../../user/all/table/components/data-table-column-header"
import { DataTableRowActions } from "./data-table-row-actions"

const statusMap: Record<string, { label: string, color: string }> = {
  "true": { label: "Actif", color: "green" },
  "false": { label: "Inactif", color: "red" },
}


export const columns: ColumnDef<Inventory>[] = [
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
      <DataTableColumnHeader column={column} title="N° Inventaire" />
    ),
    cell: ({ row }) => <div className="w-[140px] truncate whitespace-nowrap overflow-hidden text-ellipsis">{row.getValue("id")}</div>,
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
  
      return <div className="w-[100px]">{formattedDate}</div>;
    },
  },
  
  //{new Date(sale.createdAt).toLocaleDateString()}
  {
    accessorKey: "titre",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Titre" />
    ),
    cell: ({ row }) => <div className="w-[100px]">{row.getValue("titre")}</div>,
  },

  {
    accessorKey: "user.firstName",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Initiateur" />
    ),
    cell: ({ row }) => {
      const designation1 = row.original.user?.firstName ?? "aucun";
      const forename = row.original.user?.lastName ?? "aucun"
      return <div className="w-[120px]">{designation1} {forename}</div>;
    },
  },
  

  {
    accessorKey: "location",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Entrepot" />
    ),
    cell: ({ row }) => <div className="w-[80px]">{row.getValue("location")}</div>,
  },

  
 
  {
    id: "actions",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Actions" />
    ),
    cell: ({ row }) => <DataTableRowActions row={row} />,
  },
]
