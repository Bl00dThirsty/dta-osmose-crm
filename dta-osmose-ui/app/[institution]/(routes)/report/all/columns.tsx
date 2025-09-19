"use client"

import { ColumnDef } from "@tanstack/react-table"
import { Button } from '@/components/ui/button'
import { Badge } from "@/components/ui/badge"
import { Checkbox } from "@/components/ui/checkbox"
import { useRouter, useParams } from 'next/navigation';
import { Report } from "@/state/api"
import { DataTableColumnHeader } from "../../user/all/table/components/data-table-column-header"
import { DataTableRowActions } from "./data-table-row-actions"

const statusMap: Record<string, { label: string, color: string }> = {
  "true": { label: "Actif", color: "green" },
  "false": { label: "Inactif", color: "red" },
}


export const columns: ColumnDef<Report>[] = [
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

  {
    accessorKey: "date",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Date de rencontre" />
    ),
    cell: ({ row }) => {
      const rawDate = row.getValue("date");
      const formattedDate = new Date(rawDate as string).toLocaleString("fr-FR", {
        year: "numeric",
        month: "2-digit",
        day: "2-digit",
        
      });
  
      return <div className="w-[160px]">{formattedDate}</div>;
    },
  },
  
  //{new Date(sale.createdAt).toLocaleDateString()}
  {
    accessorKey: "prospectName",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Nom du prospect" />
    ),
    cell: ({ row }) => <div className="w-[100px]">{row.getValue("prospectName")}</div>,
  },

  {
    accessorKey: "contact",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Contact" />
    ),
    cell: ({ row }) => <div className="w-[100px]">{row.getValue("contact")}</div>,
  },


  {
    accessorKey: "user.firstName",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Prospecteur" />
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
