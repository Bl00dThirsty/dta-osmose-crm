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
    accessorKey: "id",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Product ID" />
    ),
<<<<<<< HEAD
    cell: ({ row }) => <div className="w-[80px]">{row.getValue("id")}</div>,
=======
    cell: ({ row }) => <div className="w-[180px] truncate whitespace-nowrap overflow-hidden text-ellipsis">{row.getValue("id")}</div>,
>>>>>>> origin/yvana
  },
  {
    accessorKey: "EANCode",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Code EAN" />
    ),
<<<<<<< HEAD
    cell: ({ row }) => <div className="w-[140px]">{row.getValue("EANCode")}</div>,
=======
    cell: ({ row }) => <div className="w-[80px]">{row.getValue("EANCode")}</div>,
>>>>>>> origin/yvana
  },
  {
    accessorKey: "brand",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Marque" />
    ),
<<<<<<< HEAD
    cell: ({ row }) => <div className="w-[80px]">{row.getValue("brand")}</div>,
=======
    cell: ({ row }) => <div className="w-[80px] truncate whitespace-nowrap overflow-hidden text-ellipsis">{row.getValue("brand")}</div>,
>>>>>>> origin/yvana
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
<<<<<<< HEAD
    cell: ({ row }) => <div className="w-[100px]">{row.getValue("quantity")} </div>,
=======
    cell: ({ row }) => <div className="w-[80px]">{row.getValue("quantity")} </div>,
>>>>>>> origin/yvana
  },
  {
    accessorKey: "purchase_price",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Prix d'achat" />
    ),
<<<<<<< HEAD
    cell: ({ row }) => <div className="w-[100px]">{row.getValue("purchase_price")} €</div>,
=======
    cell: ({ row }) => <div className="w-[80px]">{row.getValue("purchase_price")} €</div>,
>>>>>>> origin/yvana
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
<<<<<<< HEAD
=======
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Action" />
    ),
>>>>>>> origin/yvana
    cell: ({ row }) => <DataTableRowActions row={row} />,
  },
]
