import cron from "node-cron";
import { PrismaClient } from "@prisma/client";
import { notifyUserOrCustomer } from "./websocketNotification";

export const prisma = new PrismaClient();

const TIMEZONE = process.env.CRON_TIMEZONE || "UTC";

export const startReminderScheduler = () => {
  /**
   * 🔔 Tâche 1 : Tous les jours à 9h
   * - Vérifie les promesses en attente arrivées à leur date de rappel
   * - Envoie une notification au client
   */
  cron.schedule("0 14 * * *", async () => {
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
   * 📦 Tâche 2 : Tous les jours à 12h
   * - Vérifie les promesses arrivées à échéance (dueDate dépassée)
   * - Remet en stock les produits réservés
   * - Marque la promesse comme expirée
   */
  cron.schedule("0 14 * * *", async () => {
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
};
