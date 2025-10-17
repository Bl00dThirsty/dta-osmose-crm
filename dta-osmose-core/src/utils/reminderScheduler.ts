import cron from "node-cron";
import { PrismaClient } from "@prisma/client";
import { notifyUserOrCustomer } from "../websocketNotification";

export const prisma = new PrismaClient();

const TIMEZONE = process.env.CRON_TIMEZONE || "UTC";

export const startReminderScheduler = () => {
  /**
   * 🔔 Tâche 1 : Tous les jours à 12h
   * - Vérifie les promesses en attente arrivées à leur date de rappel
   * - Envoie une notification au client
   */
  cron.schedule("0 12 * * *", async () => {
    console.log("⏰ Vérification des promesses arrivées à échéance (rappel)...");
    const now = new Date();

    const expiredPromises = await prisma.salePromise.findMany({
      where: {
        status: "pending",
        reminderDate: { lt: now },
      },
      include: { customer: true },
    });

    for (const promise of expiredPromises) {
      if (promise.customer) {
        await notifyUserOrCustomer({
          customerId: promise.customer.id,
          message: `Vous avez créé une promesse d'achat le ${promise.createdAt.toLocaleDateString()} ; souhaitez-vous la valider ? Rendez-vous dans la liste des promesses.`,
          type: "order",
        });
      }
    }

    console.log(`🔔 Notifications envoyées : ${expiredPromises.length}`);
    },
     { timezone: TIMEZONE }
  );

  /**
   * 📦 Tâche 2 : Tous les jours à 13h
   * - Vérifie les promesses arrivées à échéance (dueDate dépassée)
   * - Remet en stock les produits réservés
   * - Marque la promesse comme expirée
   */
  cron.schedule("0 13 * * *", async () => {
    console.log("⏰ Vérification des promesses arrivées à échéance (expiration)...");
    const now = new Date();

    const expiredPromises = await prisma.salePromise.findMany({
      where: { 
        status: "pending",
        restocked: false,
        dueDate: { lt: now },
      },
      include: { items: true },
    });

    for (const promise of expiredPromises) {
      // Rendre le stock réservé
      await Promise.all(
        promise.items.map((it) =>
          prisma.product.update({
            where: { id: it.product_id },
            data: { quantity: { increment: it.product_quantity } },
          })
        )
      );

      // Marquer la promesse comme expirée
      await prisma.salePromise.update({
        where: { id: promise.id },
        data: { status: "expired", restocked: true },
      });
    }

    console.log(`📦 Promesses expirées traitées : ${expiredPromises.length}`);
    }, 
    { timezone: TIMEZONE }
  );


   /**
   * 🔔 Tâche 3 : Tous les jours à 14h
   * - Vérifie les commandes non livrées à temps (notifications)
   * - Envoie une notification a tout les user et au client
   */
  cron.schedule("0 14 * * *", async () => {
    console.log("⏰ Vérification des commandes dont la date de livraison soit depasser...");
    const now = new Date();

    const laterDeliverySale = await prisma.saleInvoice.findMany({
      where: {
        delivred: false,
        date: { lt: now },
      },
      include: { customer: true },
    });

    for (const promise of laterDeliverySale) {
      if (promise.customer) {
        await notifyUserOrCustomer({
          saleId: promise.id,
          customerId: promise.customer.id,
          message: `Votre commande: ${promise.invoiceNumber}, n'a toujours pas été livrée.`,
          type: "order",
        });
      }
      const users = await prisma.user.findMany({
      where: {
        role: {
          in: ['manager', 'admin']
        }
      }
    });
  
    for (const u of users) {
      await notifyUserOrCustomer({
          saleId: promise.id,
          userId: u.id,
          message: `La commande: ${promise.invoiceNumber}, n'a toujours pas été livrée.`,
          type: "order"
        });
    }
    }

    console.log(`🔔 Notifications envoyées : ${laterDeliverySale.length}`);
    },
     { timezone: TIMEZONE }
  );
};
