"use client"

import { ColumnDef } from "@tanstack/react-table"

import { Badge } from "@/components/ui/badge"
import { Checkbox } from "@/components/ui/checkbox"

import { Product } from "@/state/api"
import { DataTableColumnHeader } from "./data-table-column-header"
import { DataTableRowActions } from "./data-table-row-actions"



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
    accessorKey: "EANCode",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Code EAN" />
    ),
    cell: ({ row }) => <div className="w-[80px]">{row.getValue("EANCode")}</div>,
  },
  {
    accessorKey: "brand",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Marque" />
    ),
    cell: ({ row }) => <div className="w-[80px] truncate whitespace-nowrap overflow-hidden text-ellipsis">{row.getValue("brand")}</div>,
  },
  {
    accessorKey: "designation",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Désignation" />
    ),
    cell: ({ row }) => (
      <Badge>{row.getValue("designation")}</Badge>
    ),
  },
  {
    accessorKey: "quantity",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Quantité" />
    ),
    cell: ({ row }) => <div className="w-[80px]">{row.getValue("quantity")} </div>,
  },
  {
    accessorKey: "purchase_price",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Prix d'achat" />
    ),
    cell: ({ row }) => <div className="w-[80px]">{row.getValue("purchase_price")} €</div>,
  },
  {
    accessorKey: "sellingPriceTTC",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Prix vente TTC" />
    ),
    cell: ({ row }) => <div className="w-[100px]">{row.getValue("sellingPriceTTC")} €</div>,
  },
  {
    accessorKey: "restockingThreshold",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Seuil App." />
    ),
    cell: ({ row }) => <div>{row.getValue("restockingThreshold")}</div>,
  },
  {
    accessorKey: "warehouse",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Entrepôt de stockage" />
    ),
    cell: ({ row }) => <div>{row.getValue("warehouse")}</div>,
  },
  {
    id: "actions",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Action" />
    ),
    cell: ({ row }) => <DataTableRowActions row={row} />,
  },
]
