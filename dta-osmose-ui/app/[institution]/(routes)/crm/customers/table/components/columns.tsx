"use client"

import { ColumnDef } from "@tanstack/react-table"

import { Badge } from "@/components/ui/badge"
import { Checkbox } from "@/components/ui/checkbox"

import { Customer } from "@/state/api"
import { DataTableColumnHeader } from "./data-table-column-header"
import { DataTableRowActions } from "./data-table-row-actions"

const statusMap: Record<string, { label: string, color: string }> = {
  "true": { label: "Actif", color: "green" },
  "false": { label: "Inactif", color: "red" },
}


export const columns: ColumnDef<Customer>[] = [
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
    accessorKey: "customId",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="ID Client" />
    ),
    cell: ({ row }) => <div className="w-[140px]">{row.getValue("customId")}</div>,
  },
  {
    accessorKey: "name",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Désignation" />
    ),
    cell: ({ row }) => <div className="w-[80px]">{row.getValue("name")}</div>,
  },
  {
    accessorKey: "phone",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Téléphone" />
    ),
    cell: ({ row }) => (
      <Badge>{row.getValue("phone")}</Badge>
    ),
  },
  {
    accessorKey: "nameresponsable",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Nom du responsable" />
    ),
    cell: ({ row }) => <div className="w-[100px]">{row.getValue("nameresponsable")}</div>,
  },
  {
    accessorKey: "type_customer",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="type" />
    ),
    cell: ({ row }) => <div className="w-[100px]">{row.getValue("type_customer")}</div>,
  },
  {
    accessorKey: "quarter",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Adresse" />
    ),
    cell: ({ row }) => <div className="w-[100px]">{row.getValue("quarter")}</div>,
  },
  
  
  {
    id: "actions",
    cell: ({ row }) => <DataTableRowActions row={row} />,
  },
]
