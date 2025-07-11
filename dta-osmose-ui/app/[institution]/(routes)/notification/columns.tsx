"use client"

import { ColumnDef } from "@tanstack/react-table"
import { Button } from '@/components/ui/button'
import { Badge } from "@/components/ui/badge"
import { Checkbox } from "@/components/ui/checkbox"
import { useRouter, useParams } from 'next/navigation';
import { Notification } from "@/state/api"
import { DataTableColumnHeader } from "../user/all/table/components/data-table-column-header"
import { useNotification } from "../.././(auth)/sign-in/context/NotificationContext";
// import { DataTableRowActions } from "./data-table-row-actions"

const statusMap: Record<string, { label: string, color: string }> = {
  "true": { label: "Actif", color: "green" },
  "false": { label: "Inactif", color: "red" },
}


export const columns: ColumnDef<Notification>[] = [
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
    accessorKey: "type",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Type" />
    ),
    cell: ({ row }) => <div className="w-[80px]">{row.getValue("type")}</div>,
  },
  
  //{new Date(sale.createdAt).toLocaleDateString()}
  {
    accessorKey: "message",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Message" />
    ),
    cell: ({ row }) => {
      
      return <div className="w-[180px] break-words whitespace-normal">{row.getValue("message")}</div>;
    },
  },
{
  accessorKey: "isRead",
  header: ({ column }) => (
    <DataTableColumnHeader column={column} title="Statut" />
  ),
  cell: ({ row }) => {
    const notification = row.original;
    const { notifications, setNotifications } = useNotification();
    //const { institution } = useParams() as { institution: string }
    const handleClick = async () => {
      try {
        await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/notification/mark-as-read`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            userId: notification.userId,
            customerId: notification.customerId,
          }),
        });
  
        // Mise à jour côté state local
        setNotifications((prev:any) => prev.filter((n:any) => n.id !== notification.id));
      } catch (err) {
        console.error("Erreur lors du marquage comme lu :", err);
      }
    }

    return (
      <button
        onClick={handleClick}
        className={`px-2 py-1 rounded text-white ${notification.isRead ? 'bg-green-500' : 'bg-red-500'}`}
      >
        {notification.isRead ? "Lue" : "Non lue"}
      </button>
    );
  },
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
    accessorKey: "actions",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Actions" />
    ),
    cell: ({ row }) => <div className="w-[80px] text-red-500"> X </div>,
  },
  
]
