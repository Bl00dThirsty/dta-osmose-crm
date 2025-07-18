"use client";

import { BellIcon, BellElectricIcon } from "lucide-react";
import { useNotification } from "../../../(auth)/sign-in/context/NotificationContext";
import { useState } from "react";
import { Alert, Button } from "antd";

import { useGetAllNotificationsQuery } from "@/state/api";
import Link from 'next/link';
import { useRouter, useParams } from 'next/navigation';

export default function NotificationBell() {
  const { data: Notifications} = useGetAllNotificationsQuery();   
  const { notifications, setNotifications } = useNotification();
  const unreadCount = (Notifications?.filter((n:any) => (!n.isRead && n.type !== "stock_alert")).length) ?? 0;
  const [open, setOpen] = useState(false);
  const { institution } = useParams<{ institution: string }>();

  return (
    <div className="relative">
      <button onClick={() => setOpen(!open)}>
        <BellIcon className="w-6 h-6" />
        {unreadCount > 0 && (
          <span className="absolute top-0 right-0 bg-red-500 text-white text-xs rounded-full px-1">
            {unreadCount}
          </span>
        )}
      </button>

      {open && (
        <div className="absolute right-0 mt-2 w-72 bg-white shadow-md rounded-lg p-2 z-50">
          {unreadCount === 0 ? (
            <p className="text-sm text-gray-500">Aucune notification</p>
          ) : (
            [...(notifications || []), ...(Notifications || [])].filter((notif: any) => (!notif.isRead && notif.type !== "stock_alert")).map((notif:any, idx:any) => (
               <Alert
               key={idx}
               message={<Link href={`/${institution}/sales/${notif.saleId}`}>{notif.message}</Link>}
               showIcon
               type={notif.type === "general" ? "info" : "warning"}
               style={{ marginBottom: "16px" }}
               closable
               onClose={async () => {
                try {
                  await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/notification/mark-as-read`, {
                    method: "POST",
                    headers: {
                      "Content-Type": "application/json",
                    },
                    body: JSON.stringify({
                      userId: notif.userId,
                      customerId: notif.customerId,
                    }),
                  });
            
                  // Mise à jour côté state local
                  setNotifications((prev:any) => prev.filter((n:any) => n.id !== notif.id));
                } catch (err) {
                  console.error("Erreur lors du marquage comme lu :", err);
                }
              }}
             />
            ))
          )}
        </div>
      )}
    </div>
  );
}
