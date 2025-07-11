// "use client";

// import { useGetAllNotificationsQuery } from "@/state/api";

// export default function NotificationAdmin() {
//   const { data: notifications } = useGetAllNotificationsQuery();

//   return (
//     <div className="p-5">
//       <h2 className="text-xl font-bold mb-4">Toutes les notifications</h2>
//       <table className="table-auto w-full border">
//         <thead>
//           <tr>
//             <th className="border px-2 py-1">Type</th>
//             <th className="border px-2 py-1">Message</th>
//             <th className="border px-2 py-1">Statut</th>
//             <th className="border px-2 py-1">Date</th>
//           </tr>
//         </thead>
//         <tbody>
//           {notifications?.map((n:any) => (
//             <tr key={n.id}>
//               <td className="border px-2 py-1">{n.type}</td>
//               <td className="border px-2 py-1">{n.message}</td>
//               <td className="border px-2 py-1">{n.isRead ? "Lue" : "Non lue"}</td>
//               <td className="border px-2 py-1">{new Date(n.createdAt).toLocaleString()}</td>
//             </tr>
//           ))}
//         </tbody>
//       </table>
//     </div>
//   );
// }

"use client"

import React from "react";
import Container from "../components/ui/Container";
import { useParams } from "next/navigation"
import { redirect } from 'next/navigation';
import { useEffect, useState } from 'react';
import { Button } from "@/components/ui/button"
import { useRouter } from 'next/navigation';
import { columns } from "./columns"
import { DataTable } from "./data-table"
import { toast } from "react-toastify";
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogFooter,
  DialogTitle,
  DialogDescription,
  DialogCancel,
  DialogAction,
} from "@/components/ui/dialog"


import { useGetAllNotificationsQuery, useDeleteNotificationsMutation } from "@/state/api";

const NotificationAdmin = () => {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const token = typeof window !== 'undefined' ? localStorage.getItem('accessToken') : null;
  const { institution } = useParams() as { institution: string }
  useEffect(() => {
    if (!token) {
      router.push('/sign-in');
    }
  }, [token]);
  const [userId, setUserId] = useState<number | null>(null);
  const [customerId, setCustomerId] = useState<number | null>(null);
  const userRole = typeof window !== 'undefined' ? localStorage.getItem('role') : null;
  const isParticulier = userRole === "Particulier";
  const { data: notifications, isLoading, isError } = useGetAllNotificationsQuery();
  const handleClearAll = async () => {
    try {
      await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/notification`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          //"Authorization": `Bearer ${token}`
        },
        body: JSON.stringify({
          userId: userId,
          customerId: customerId,
        }),
      });
      toast.success("Toutes les notifications ont été supprimées");
    } catch (err) {
      toast.error("Échec de la suppression");
      console.error("Erreur:", err);
    }
  }

if (isLoading) return <p>Chargement...</p>
if (isError) return <p>Erreur lors du chargement.</p>


  return (
    <>
    <Container
      title="Toutes les notifications"
      description=""
    >
    <div className="h-full w-full overflow-x-auto">
      <section className="overflow-hidden rounded-[0.5rem] border bg-background shadow-zinc-50">
      <div className="hidden h-full flex-1 flex-col space-y-8 p-8 md:flex">
      <div className="flex items-center justify-between space-y-2">
    </div>
    {!isParticulier && (
    <div>        
          <Button onClick={() => setOpen(true)} className="bg-red-700 text-white hover:bg-red-400">🗑️ Tous Supprimer</Button>      
    </div>
    )}
    <DataTable data={notifications || []} columns={columns} />
  </div>
        </section>
      </div>
    </Container>

   <Dialog open={open} onOpenChange={setOpen}>
<DialogContent>
  <DialogHeader>
    <DialogTitle>Confirmation</DialogTitle>
    <DialogDescription>
      Voulez-vous vraiment supprimer toutes les notifications ?
    </DialogDescription>
  </DialogHeader>
  <DialogFooter>
    <DialogCancel onClick={() => setOpen(false)}>Annuler</DialogCancel>
    <DialogAction onClick={handleClearAll}>Oui</DialogAction>
  </DialogFooter>
</DialogContent>
</Dialog>
</>
  );
};

export default NotificationAdmin;