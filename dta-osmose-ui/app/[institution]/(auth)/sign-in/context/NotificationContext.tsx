"use client";

import React, { createContext, useContext, useEffect, useState } from "react";
import { io } from "socket.io-client";
import { useAuth } from "./authContext"; // adapte selon ton arborescence
//process.env.NEXT_PUBLIC_API_BASE_URL ou "http://localhost:8000"
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const socket = io(process.env.NEXT_PUBLIC_API_BASE_URL, {
  withCredentials: true,
});

const NotificationContext = createContext<any>(null);

export const NotificationProvider = ({ children }: { children: React.ReactNode }) => {
  const userType = typeof window !== 'undefined' ? localStorage.getItem('role') : null;
  
  const { user, loading, clearError } = useAuth(); // adapt to your auth structure
  const [notifications, setNotifications] = useState<any[]>([]);
  const [stockNotifications, setStockNotifications] = useState<any[]>([]);


  useEffect(() => {
    if (loading) {
      console.log("NotificationContext attend AuthProvider...");
      return;
    }
    if (!user) {
      console.log("Utilisateur introuvable après loading...");
      return;
    }
    const role = localStorage.getItem('role');
    console.log("role", role)
    //user.userType ou userType
    if (userType === "admin") {
      socket.emit("identify", { userId: user.id });
      console.log(`user ${user.id} is identifying`);
      socket.on("user-notification", (notification) => {
        if (notification.type === "order") {
          setNotifications((prev) => [notification, ...prev]);
          
        } else {
          setStockNotifications((prev) => [notification, ...prev]);
        }
      
        toast(notification.message, {
          type: notification.type === "stock_alert" ? "warning" : "info",
          autoClose: 5000,
        });
      });
      
    } else if (userType === "Particulier") {
      socket.emit("identify", { customerId: user.id });
  
      socket.on("customer-notification", (notification) => {
        setNotifications((prev) => [notification, ...prev]);
        toast(notification.message, {
          type: notification.type=== "general" ? "info" : "warning",
          autoClose: 5000, // Durée d'affichage du toast
          //position: toast.TOP_RIGHT // Position du toast
        });
      });
      
    }

    return () => {
      socket.off("user-notification");
      socket.off("customer-notification");
    };
  }, [user, loading]);

  return (
    <NotificationContext.Provider value={{ notifications, setNotifications, stockNotifications, setStockNotifications }}>
      {children}
    </NotificationContext.Provider>
  );
};

export const useNotification = () => useContext(NotificationContext);
