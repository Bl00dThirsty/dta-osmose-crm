// websocketNotification.ts
import { Server as HttpServer } from "http";
import { Server as IOServer } from "socket.io";
import { PrismaClient } from "@prisma/client";
//const { PrismaClient } = require("@prisma/client");

const prisma = new PrismaClient();

const userSockets: Record<number, string> = {};
const customerSockets: Record<number, string> = {};

let io: IOServer;

const initWebSocketServer = (server: HttpServer) => {
  io = new IOServer(server, {
    cors: {
      origin: [
        "http://localhost:3000",
        "http://localhost:3001", // Frontend Next.js
        "http://127.0.0.1:3000",
        "https://dta-osmose-ui.vercel.app",
        "http://192.168.1.106:3000"
      ],
      methods: ["GET", "POST"],
      credentials: true
    },
    transports: ['websocket', 'polling'], // Support des deux transports
    allowEIO3: true
  });

  io.on("connection", (socket) => {
    console.log(`✅ Socket connecté : ${socket.id}`);

    socket.on("identify", async (data) => {
      const { userId, customerId } = data;

      if (userId) {
        userSockets[userId] = socket.id;
        console.log(`👤 User ${userId} identified with socket ${socket.id}`);

        const notifications = await prisma.notification.findMany({
          where: { userId, isRead: false }
        });
        notifications.forEach((notif: any) => {
          socket.emit("user-notification", notif);
        });
      }

      if (customerId) {
        customerSockets[customerId] = socket.id;
        console.log(`👥 Customer ${customerId} identified with socket ${socket.id}`);

        const notifications = await prisma.notification.findMany({
          where: { customerId, isRead: false }
        });
        notifications.forEach((notif: any) => {
          socket.emit("customer-notification", notif);
        });
      }
    });

    socket.on("disconnect", () => {
      for (const id in userSockets) {
        if (userSockets[id] === socket.id) delete userSockets[Number(id)];
      }
      for (const id in customerSockets) {
        if (customerSockets[id] === socket.id) delete customerSockets[Number(id)];
      }
      console.log(`❌ Socket déconnecté : ${socket.id}`);
    });
  });
};

// 🔔 Notification individuelle
const notifyUserOrCustomer = async ({
  saleId,
  userId,
  customerId,
  productId,
  institutionId,
  message,
  type
}: {
  saleId?: string;
  userId?: number;
  customerId?: number;
  productId?: string;
  institutionId?: string;
  message: string;
  type: string;
}) => {
  if (userId) {
    const notif = await prisma.notification.create({
      data: {
        saleId,
        userId,
        productId,
        institutionId,
        message,
        type,
        isRead: false
      }
    });
    const socketId = userSockets[userId];
    if (socketId) io.to(socketId).emit("user-notification", notif);
  }

  if (customerId) {
    const notif = await prisma.notification.create({
      data: {
        saleId,
        customerId,
        institutionId,
        message,
        type,
        isRead: false
      }
    });
    const socketId = customerSockets[customerId];
    if (socketId) io.to(socketId).emit("customer-notification", notif);
  }
};

// 🔔 Notification à tous les utilisateurs
const notifyAllUsers = async (saleId: string, message: string, institutionId?: string, type?: string) => {
  const users = await prisma.user.findMany({
    where: {
      role: {
        in: ["admin", "manager"]
      }
    }
  });

  for (const user of users) {
    const notif = await prisma.notification.create({
      data: {
        saleId,
        userId: user.id,
        institutionId,
        message,
        type: "order",
        isRead: false

      }
    });
    const socketId = userSockets[user.id];
    if (socketId) io.to(socketId).emit("user-notification", notif);
  }
};

export { initWebSocketServer, notifyUserOrCustomer, notifyAllUsers };
