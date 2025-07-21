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
      if (userId) {
      await prisma.Notification.updateMany({
        where: {
          OR: [
            { userId: userId ? Number(userId) : undefined },
            
          ],
          isRead: false
        },
        data: { isRead: true }
      });
      res.status(200).json({ message: "User notifications marked as read" });
    } else if (customerId) {
      await prisma.Notification.updateMany({
        where: {
          OR: [
            
            { customerId: customerId ? Number(customerId) : undefined }
          ],
          isRead: false
        },
        data: { isRead: true }
      });
      res
      .status(200)
      .json({ message: "Customer notifications marked as read" });
    }
      //res.json({ message: "Notifications marquées comme lues" });
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: "Erreur serveur" });
    }
  };

  export const getAllNotifications = async (req: Request, res: Response) => {
    try {
    const institutionSlug = req.params.institution;

    if (!institutionSlug) {
      res.status(400).json({ message: "Institution manquante." });
      return;
    }

    const institution = await prisma.institution.findUnique({
        where: { slug: institutionSlug },
    });

    if (!institution) {
        res.status(404).json({ message: "Institution introuvable." });
        return;
      }
      const notifications = await prisma.Notification.findMany({
        where: {
          institutionId: institution.id,
        },
        orderBy: { createdAt: "desc" },
        
      });
      res.json(notifications);
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: "Erreur lors de la récupération des notifications" });
    }
  };

  export const getCustomerNotifications = async (req: Request, res: Response): Promise<void> => {
    try {
      const creatorType = req.auth.userType; // Type de créateur ("user" ou "customer")
      const creatorId = req.auth.sub;  
      
      if (creatorType !== "customer") {
        res.status(403).json({ message: "Seuls les clients peuvent accéder à leurs notifications." });
      }
     
      if (!creatorId) {
         res.status(400).json({ message: "Identifiant du client manquant." });
      }
  
  
      const notifications = await prisma.notification.findMany({
        where: {
          customerId: creatorId, // Filtrer par client
        },
        orderBy: {
          createdAt: 'desc',
        }
      });
  
      res.status(200).json(notifications);
    } catch (error) {
      console.error("Erreur lors de la récupération des notifications client :", error);
      res.status(500).json({ message: "Erreur serveur" });
    }
  };
  

  export const deleteAllNotifications = async (req: Request, res: Response): Promise<void> => {
    const { userId, customerId } = req.body;
    const institutionSlug = req.params.institution;

    if (!institutionSlug) {
      res.status(400).json({ message: "Institution manquante." });
      return;
    }

    const institution = await prisma.institution.findUnique({
        where: { slug: institutionSlug },
    });

    if (!institution) {
        res.status(404).json({ message: "Institution introuvable." });
        return;
      }
  
    if (!userId && !customerId)
      res.status(400).json({ error: "User or customer ID required" });
  
    await prisma.notification.deleteMany({
      where: {
        ...(userId && { userId: Number(userId) }),
        ...(customerId && { customerId: Number(customerId) }),
        institutionId: institution.id,
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
  
  