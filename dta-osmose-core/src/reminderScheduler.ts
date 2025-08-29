import cron from "node-cron";
import { PrismaClient } from "@prisma/client";
import { notifyUserOrCustomer } from "./websocketNotification";
//import { checkReminderDateStatus } from "./controllers/promiseSaleConroller";

export const prisma = new PrismaClient();

export const startReminderScheduler = () => {
  // Toutes les heures 
  cron.schedule("0 9 * * *", async () => {
    console.log("⏰ Vérification des promesses arrivées à échéance...");
    const now = new Date();

    // On récupère toutes les promesses expirées
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
          saleId: "",
          customerId: promise.customer.id,
          message: `Vous avez créé une promesse d'achat le ${promise.createdAt.toLocaleDateString()} ; souhaitez-vous la valider ? Rendez-vous dans la liste des promesses.`,
          type: "order",
        });
      }
    }

    console.log(`🔔 Notifications envoyées : ${expiredPromises.length}`);
  });
};