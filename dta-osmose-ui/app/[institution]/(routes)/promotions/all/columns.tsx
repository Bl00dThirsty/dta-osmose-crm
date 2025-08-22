"use client"

import { ColumnDef } from "@tanstack/react-table"
import { Button } from '@/components/ui/button'
import { Badge } from "@/components/ui/badge"
import { Checkbox } from "@/components/ui/checkbox"
import { useRouter, useParams } from 'next/navigation';
import { Promotion, useUpdatePromotionStatusMutation } from "@/state/api"
import { DataTableColumnHeader } from "../../user/all/table/components/data-table-column-header"
import { DataTableRowActions } from "./data-table-row-actions"

const statusMap: Record<string, { label: string, color: string }> = {
  "true": { label: "Actif", color: "green" },
  "false": { label: "Inactif", color: "red" },
}


export const columns: ColumnDef<Promotion>[] = [
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
    accessorKey: "title",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Titre" />
    ),
    cell: ({ row }) => <div className="w-[100px]">{row.getValue("title")}</div>,
  },
   {
  accessorFn: (row) => row.product?.designation ?? "aucun",
  id: "product", // 🔹 identifiant unique pour react-table
  header: ({ column }) => (
    <DataTableColumnHeader column={column} title="Produit" />
  ),
  cell: ({ row }) => {
    return <div className="w-[160px]">{row.getValue("product")}</div>;
  },
},

  {
    accessorKey: "discount",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Remise" />
    ),
    cell: ({ row }) => <div className="w-[80px]">{row.getValue("discount")} %</div>,
  },
  {
    accessorKey: "startDate",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Date Debut" />
    ),
    cell: ({ row }) => {
      const rawDate = row.getValue("startDate");
      const formattedDate = new Date(rawDate as string).toLocaleString("fr-FR", {
        year: "numeric",
        month: "2-digit",
        day: "2-digit",
      });
  
      return <div className="w-[100px]">{formattedDate}</div>;
    },
  },
  
  {
    accessorKey: "endDate",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Date Fin" />
    ),
    cell: ({ row }) => {
      const rawDate = row.getValue("endDate");
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
  id: "status",
  header: ({ column }) => (
    <DataTableColumnHeader column={column} title="Statut promotion" />
  ),
  cell: ({ row }) => {
    const [updateStatus] = useUpdatePromotionStatusMutation();
    const promo = row.original;
    const id = (row.original as any).id;
    const handleClick = () => {
      updateStatus({ id, status: !promo.status });
    };

    return (
      <button
        onClick={handleClick}
        className={`px-2 py-1 rounded text-white ${promo.status ? 'bg-green-500' : 'bg-red-500'}`}
      >
        {promo.status ? "Active" : "Non Active"}
      </button>
    );
  },
},

 {
       accessorKey: "user.firstName",
       header: ({ column }) => (
         <DataTableColumnHeader column={column} title="Créateur" />
       ),
       cell: ({ row }) => {
         const designation1 = row.original.user?.firstName ?? "aucun";
         const forename = row.original.user?.lastName ?? "aucun"
         return <div className="w-[120px]">{designation1} {forename}</div>;
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
