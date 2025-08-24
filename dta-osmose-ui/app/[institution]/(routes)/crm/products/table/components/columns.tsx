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
  // {
  //   accessorKey: "id",
  //   header: ({ column }) => (
  //     <DataTableColumnHeader column={column} title="Product ID" />
  //   ),
  //   cell: ({ row }) => <div className="w-[180px] truncate whitespace-nowrap overflow-hidden text-ellipsis">{row.getValue("id")}</div>,
  // },
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
    cell: ({ row }) => <div className="w-[180px] truncate whitespace-nowrap overflow-hidden text-ellipsis">{row.getValue("brand")}</div>,
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
    cell: ({ row }) => <div className="w-[100px]">{row.getValue("warehouse")}</div>,
  },
//   {
//   accessorKey: "Promotion",
//   header: ({ column }) => (
//     <DataTableColumnHeader column={column} title="Promotion" />
//   ),
//   cell: ({ row }) => {
//     const promotions = row.original.Promotion;
//     const activePromo = promotions?.find(p => p.status === true);

//     return (
//       <button
//         className={`px-2 py-1 rounded text-white ${
//           activePromo ? "bg-green-500" : "bg-red-500"
//         }`}
//       >
//         {activePromo ? "En cours" : "Aucune"}
//       </button>
//     );
//   },
// },
{
  accessorKey: "Promotion",
  header: ({ column }) => (
    <DataTableColumnHeader column={column} title="Promotions" />
  ),
  cell: ({ row }) => {
    const promotions = row.original.Promotion || [];

    if (promotions.length === 0) {
      return (
        <span className="px-2 py-1 rounded bg-red-500 text-white">Aucune</span>
      );
    }

    return (
      <div className="flex flex-wrap gap-1">
        {promotions.map((promo, i) => (
          <span
            key={i}
            className={`px-2 py-1 rounded text-white ${
              promo.status ? "bg-green-500" : "bg-gray-400"
            }`}
          >
            {promo.title || "Promo"} {promo.status ? "✓" : "✗"}
          </span>
        ))}
      </div>
    );
  },
},


  {
    id: "actions",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Action" />
    ),
    cell: ({ row }) => <DataTableRowActions row={row} />,
  },
]
