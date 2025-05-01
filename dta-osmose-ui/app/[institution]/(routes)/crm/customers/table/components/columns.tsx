"use client"

import { ColumnDef } from "@tanstack/react-table"

import { Badge } from "@/components/ui/badge"
import { Checkbox } from "@/components/ui/checkbox"

import { Product } from "@/state/api"
import { DataTableColumnHeader } from "./data-table-column-header"
import { DataTableRowActions } from "./data-table-row-actions"

const statusMap: Record<string, { label: string, color: string }> = {
  "true": { label: "Actif", color: "green" },
  "false": { label: "Inactif", color: "red" },
}


export const columns: ColumnDef<Product>[] = [
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
    accessorKey: "name",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Nom" />
    ),
    cell: ({ row }) => <div className="w-[140px]">{row.getValue("name")}</div>,
  },
  {
    accessorKey: "quantity",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Quantité" />
    ),
    cell: ({ row }) => <div className="w-[80px]">{row.getValue("quantity")}</div>,
  },
  {
    accessorKey: "label",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Label" />
    ),
    cell: ({ row }) => (
      <Badge>{row.getValue("label")}</Badge>
    ),
  },
  {
    accessorKey: "purchase_price",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Prix d'achat" />
    ),
    cell: ({ row }) => <div className="w-[100px]">{row.getValue("purchase_price")} €</div>,
  },
  {
    accessorKey: "gtsPrice",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="GTS Price" />
    ),
    cell: ({ row }) => <div className="w-[100px]">{row.getValue("gtsPrice")} €</div>,
  },
  {
    accessorKey: "sellingPriceHT",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Prix vente HT" />
    ),
    cell: ({ row }) => <div className="w-[100px]">{row.getValue("sellingPriceHT")} €</div>,
  },
  {
    accessorKey: "sellingPriceTTC",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Prix vente TTC" />
    ),
    cell: ({ row }) => <div className="w-[100px]">{row.getValue("sellingPriceTTC")} €</div>,
  },
  {
    accessorKey: "status",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Statut" />
    ),
    cell: ({ row }) => {
      const value = row.getValue("status") as boolean
      const status = statusMap[value.toString()]
      return (
        <div className={`text-${status.color}-600 font-semibold`}>
          {status.label}
        </div>
      )
    },
  },
  {
    accessorKey: "collisage",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Collisage" />
    ),
    cell: ({ row }) => <div>{row.getValue("collisage")}</div>,
  },
  {
    id: "actions",
    cell: ({ row }) => <DataTableRowActions row={row} />,
  },
]
