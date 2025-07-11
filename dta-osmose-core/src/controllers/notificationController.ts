import { Request, Response } from "express";
const { PrismaClient } = require("@prisma/client");
import { v4 as uuidv4 } from 'uuid';

const prisma = new PrismaClient();

export const markNotificationsAsRead = async (req: Request, res: Response): Promise<void> => {
    const { userId, customerId } = req.body;
  
    try {
        //&& ou ||
      if (!userId && !customerId) {
        res.status(400).json({ message: "ID requis" });
      }
  
      await prisma.Notification.updateMany({
        where: {
          OR: [
            { userId: userId ? Number(userId) : undefined },
            { customerId: customerId ? Number(customerId) : undefined }
          ],
          isRead: false
        },
        data: { isRead: true }
      });
  
      res.json({ message: "Notifications marquées comme lues" });
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: "Erreur serveur" });
    }
  };

  export const getAllNotifications = async (req: Request, res: Response) => {
    try {
      const notifications = await prisma.Notification.findMany({
        orderBy: { createdAt: "desc" },
      });
      res.json(notifications);
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: "Erreur lors de la récupération des notifications" });
    }
  };

  export const deleteAllNotifications = async (req: Request, res: Response): Promise<void> => {
    const { userId, customerId } = req.body;
  
    if (!userId && !customerId)
      res.status(400).json({ error: "User or customer ID required" });
  
    await prisma.notification.deleteMany({
      where: {
        ...(userId && { userId: Number(userId) }),
        ...(customerId && { customerId: Number(customerId) }),
      },
    });
  
    res.json({ message: "Notifications supprimées avec succès" });
  };

  export const deleteSingleNotifications = async (
    req: Request,
    res: Response
  ): Promise<void> => {
    try {
      const { id } = req.params;
        const deletedNotification = await prisma.Notification.delete({
            where: {
              id,
            },
            
          });   
      
          if (!deletedNotification) {
            res.status(404).json({ message: "Notification delete to failed" });
          }
            res.status(200).json(deletedNotification);
    } catch (error) {
      res.status(500).json({ message: "Erreur lors de la suppression de la Notification" });
    }
  };
  
  