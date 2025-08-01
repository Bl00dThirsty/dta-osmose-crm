"use client" 

import React, { useEffect, useState } from "react";
import io from "socket.io-client";
import Link from 'next/link';
import { Alert } from "antd";
import { BellIcon } from "lucide-react";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useAuth } from "../../../(auth)/sign-in/context//authContext";
import { useRouter, useParams } from 'next/navigation';
import "./notification.css";

// Connect to Socket.io server
const socket = io(process.env.NEXT_PUBLIC_API_BASE_URL, {
    withCredentials: true,
  });
// const socket = io("http://192.168.1.176:5001");


function NotificationBell() {
    const { user, loading, clearError } = useAuth();
    const userType = typeof window !== 'undefined' ? localStorage.getItem('role') : null;
    let userId = null;
    if ((userType === "admin") || (userType === "manager")){
      userId = user?.id;  
    }
  const [notifications, setNotifications] = useState<any[]>([]);
  const [showNotifications, setShowNotifications] = useState(false);
  const { institution } = useParams<{ institution: string }>();
  //const [open, setOpen] = useState(false);

  useEffect(() => {
    // Identify the user when they connect
    if (userId) {
      console.log(`Customer ${userId} is identifying`);
      socket.emit("identify", { userId });
    }

    // Handle incoming notifications
    const handleCustomerNotification = (notification:any) => {
      console.log("Received notification:", notification);

      if (notification && notification.id && notification.type) {
        setNotifications((prevNotifications) => [
            ...prevNotifications,
            notification
          ]);

        let toastType;
        switch (notification.type) {
          case "update_order":
            toastType = "info";
            break;
          case "order":
          case "new_by_commande":
            toastType = "success";
            break;
          default:
            toastType = "default";
        }

        toast(notification.message, {
          type: notification.type === "general" ? "info" : "warning",
          autoClose: 5000,
        });
      } else {
        console.error(
          "Notification data is missing or incomplete:",
          notification
        );
      }
    };

    // Listen for customer notifications
    socket.on("customer-notification", handleCustomerNotification);

    // Clean up event listener on component unmount
    return () => {
      socket.off("customer-notification", handleCustomerNotification);
    };
  }, [userId]);

  const handleNotificationClick = async () => {
    // setShowNotifications(!showNotifications);
    // if (!showNotifications) {
      try {
        await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/notification/mark-as-read`, {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({ 
              userId
            }),
          });
    
          // Mise à jour côté state local
          setNotifications((prevNotifications) =>
            prevNotifications.map((notif) => ({ ...notif, isRead: true }))
          );
      } catch (error) {
        console.error("Error marking notifications as read:", error);
      }
    // }
  };

  // Filter unread notifications
  const unreadNotifications = notifications.filter((notif) => !notif.isRead);

  return (
    <div className="relative">
      {/* Afficher le nombre de notifications non lues */}
      
      {/* Icône de cloche */}
      <button onClick={() => setShowNotifications(!showNotifications)}>
        <BellIcon className="w-6 h-6" />
        {unreadNotifications.length >= 0 && (
          <span className="absolute top-0 right-0 bg-red-500 text-white text-xs rounded-full px-1">
            {unreadNotifications.length}
          </span>
        )}
      </button>
      {/* Liste des notifications lorsqu'on clique sur la cloche */}
      {showNotifications && (
        <div className="notification-list-container1">
          {notifications.map((item) => (
            <Alert
              key={item.id}
              message={<Link href={`/${institution}/sales/${item.saleId}`}>{item.message}</Link>}
              showIcon
              type={item.type === "info" ? "success" : "warning"}
              style={{ marginBottom: "16px" }}
              closable
              onClose={handleNotificationClick}
            />
          ))}
        </div>
      )}
      <ToastContainer /> {/* Affiche les toasts */}
    </div>
  );
}

export default NotificationBell;