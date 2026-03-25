"use client";

import React, { createContext, useContext, useEffect, useState } from "react";
import { io } from "socket.io-client";
import { useAuth } from "./authContext";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

// IMPORTANT: Utilisez le port du serveur WebSocket (4001) et non celui du backend API (4000)
// Notez que NEXT_PUBLIC_WS_URL doit être différent de NEXT_PUBLIC_API_BASE_URL
const socket = io(process.env.NEXT_PUBLIC_WS_URL || "http://localhost:4001", {
  withCredentials: true,
  transports: ['websocket'], // Forcer l'utilisation de WebSocket uniquement
  reconnection: true,
  reconnectionAttempts: 5,
  reconnectionDelay: 1000,
});

const NotificationContext = createContext<any>(null);

export const NotificationProvider = ({ children }: { children: React.ReactNode }) => {
  const [userRole, setUserRole] = useState<string | null>(null);

  useEffect(() => {
    setUserRole(localStorage.getItem('role'));
  }, []);
  
  const { user, loading, clearError } = useAuth();
  const [notifications, setNotifications] = useState<any[]>([]);
  const [stockNotifications, setStockNotifications] = useState<any[]>([]);

  // Gestion des erreurs de connexion Socket.IO
  useEffect(() => {
    socket.on("connect", () => {
      console.log("✅ Socket.IO connected successfully");
    });

    socket.on("connect_error", (error) => {
      console.error("❌ Socket.IO connection error:", error);
    });

    socket.on("disconnect", (reason) => {
      console.log("Socket.IO disconnected:", reason);
    });

    return () => {
      socket.off("connect");
      socket.off("connect_error");
      socket.off("disconnect");
    };
  }, []);

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
    
    if ((userRole === "admin") || (userRole === "manager")) {
      socket.emit("identify", { userId: user.id });
      console.log(`user ${user.id} is identifying`);
      
      socket.on("user-notification", (notification) => {
        if (notification.type === "stock_alert") {
          setStockNotifications((prev) => [notification, ...prev]);
        } else {
          setNotifications((prev) => [notification, ...prev]);
        }
      
        toast(notification.message, {
          type: notification.type === "stock_alert" ? "warning" : "info",
          autoClose: 5000,
        });
      });
      
    } else {
      socket.emit("identify", { customerId: user.id });
  
      socket.on("customer-notification", (notification) => {
        setNotifications((prev) => [notification, ...prev]);
        toast(notification.message, {
          type: notification.type === "general" ? "info" : "warning",
          autoClose: 5000,
        });
      });
    }

    return () => {
      socket.off("user-notification");
      socket.off("customer-notification");
    };
  }, [user, loading, userRole]);

  return (
    <NotificationContext.Provider value={{ notifications, setNotifications, stockNotifications, setStockNotifications }}>
      {children}
    </NotificationContext.Provider>
  );
};

export const useNotification = () => useContext(NotificationContext);