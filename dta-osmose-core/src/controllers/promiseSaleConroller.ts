import { Request, Response } from "express";
import { PrismaClient, Prisma } from "@prisma/client";
import { v4 as uuidv4 } from 'uuid';
const {
  notifyUserOrCustomer,
  notifyAllUsers
} = require("../websocketNotification");

const prisma = new PrismaClient();

export const createSalePromise = async (req: Request, res: Response): Promise<void> =>  {
    console.log('=== DEBUT DE LA REQUETE ===');
    console.log('Headers:', req.headers);
    console.log('Params:', req.params);
    console.log('Body:', req.body);
    console.log('Auth:', req.auth);
  
    try {
      interface salePromiseProduct {
        product_id: string;
        product_quantity: number;
        product_sale_price: number;
        
      }
      
    const { 
  customerId, 
  items, 
  discount, 
  note, 
  reminderDate, 
  dueDate, 
  customer_address, 
  customer_name, 
  customer_phone  
} = req.body as {
  customerId?: number;
  items: salePromiseProduct[];
  discount?: number;
  note?: string;
  reminderDate?: Date | null;
  dueDate?: Date | null;
  customer_phone?: string;
  customer_name?: string;
  customer_address?: string;
};

   
    const institutionSlug = req.params.institution;

    const payload = req.auth;
    if (!payload?.sub) {
      res.status(401).json({ error: "Utilisateur non authentifié" });
      return;
    }
    const userId = payload.sub;
    const creatorType = req.auth.userType; // Type de créateur ("user" ou "customer")
    const creatorId = req.auth.sub;
    let user = null;
    if (creatorType === "user") {
      user = await prisma.user.findUnique({
        where: { id: Number(creatorId) }
      });
      if (!user) {
        res.status(400).json({ error: "Utilisateur non trouvé" });
      }
    } else if (creatorType === "customer") {
      const creatorCustomer = await prisma.customer.findUnique({
        where: { id: Number(creatorId) }
      });
      if (!creatorCustomer) {
        res.status(400).json({ error: "Client créateur non trouvé" });
      }
    } else {
        res.status(400).json({ error: "Type de créateur non valide" });
    }
    const institution = await prisma.institution.findUnique({
        where: { slug: institutionSlug },
    });
  
    if (!institution) {
        res.status(404).json({ message: "Institution introuvable." });
        return;
    }


// Calcul des totaux
    //const subtotal = items.reduce((sum:any, item:any) => sum + (item.quantity * item.unitPrice), 0);
    //const finalAmount = subtotal - (discount || 0);

    // Vérification des stocks
    for (const item of items) {
      const product = await prisma.product.findUnique({
        where: { id: item.product_id }
      });

      if (!product || product.quantity < item.product_quantity) {
          res.status(400).json({
          error: `Stock insuffisant pour le produit ${product?.designation}`
        });
      }
    }

    // Création de la facture
    const invoice = await prisma.salePromise.create({
      data: {
        customerId,
        userId: creatorType === "user" ? Number(creatorId) : undefined,
        customerCreatorId: creatorType === "customer" ? Number(creatorId) : undefined,
        institutionId: institution.id,
        total_amount: items.reduce((sum:any, item) => sum + (item.product_quantity * item.product_sale_price), 0),
        discount: discount,
        note,
        reminderDate,
        dueDate,
        customer_phone,
        customer_name,
        customer_address,
        items: {
          create: items.map((item) => ({
            product_id: item.product_id,
            product_quantity: item.product_quantity,
            product_sale_price: item.product_sale_price,
            totalPrice: item.product_quantity * item.product_sale_price
          }))
        }
      },
      include: {
        items: {
          include: {
            product: true
          }
        },
        customer: true,
        user: true
      }
    });

    const totalSansRemise = invoice.total_amount;
    const montantAvecRemise = totalSansRemise - (invoice.discount || 0);

    // Mise à jour finale
    const updatedInvoice = await prisma.salePromise.update({
      where: { id: invoice.id },
      data: {
        total_amount: montantAvecRemise,
      },
      include: {
        items: { include: { product: true } },
        customer: true,
        user: true
      }
    });

    if (creatorType === "customer") {
       await notifyAllUsers(
        null,
        //institution.id,
       `Nouvelle promesse d'achat créée par le client ${creatorId}`
       );
    }
     
    if (creatorType === "user") {
      await notifyUserOrCustomer({
        saleId: null,
        customerId: invoice.customerId,
        institutionId: institution.id,
        productId: null,
        message: `Votre promesse d'achat a été créée et la valeur est de: ${updatedInvoice.total_amount} fcfa.`,
        type: "order"
      });
    }

    console.log("le type user", creatorType)
    // Mise à jour des stocks
    await Promise.all(items.map((item) => 
      prisma.product.update({
        where: { id: item.product_id },
        data: { 
          quantity: { decrement: item.product_quantity } 
        }
      })
    ));
    for (const item of items) {
      const product = await prisma.product.findUnique({
        where: { id: item.product_id }
      });
      if (!product) {
       console.warn(`Produit non trouvé pour id ${item.product_id}`);
       continue;
      }
    if (product.quantity <= product.restockingThreshold) {
      const users = await prisma.user.findMany({
        where: {
          role: {
            in: ['manager', 'admin']
          }
        }
      });
    
      for (const u of users) {
        await notifyUserOrCustomer({
          saleId: null,
          userId: u.id,
          productId: product?.id,
          institutionId: institution.id,
          message: `Le stock du produit "${product?.designation}" est bas (seuil atteint), "${product?.restockingThreshold}" Produits restants"`,
          type: "stock_alert"
        });
      }
    }
  }



    res.status(201).json(updatedInvoice);
  } catch (error) {
    console.error('ERREUR COMPLETE:', error);
    if (error instanceof Error) {
      console.error('Stack trace:', error.stack);
    }
    res.status(500).json({ error: 'Internal server error' });
  }
};

//Cette fonction permet d'envoyer une notification a un client lorsque la date de rappel de sa promesse de vente est atteinte ou depasser
// export async function checkReminderDateStatus () {
//   const { customerId } = req.params;
  
//   const now = new Date();

//   const unpaidOldInvoices = await prisma.salePromise.findMany({
//     where: {
//       customerId: parseInt(customerId),
//       status: "pending",
//       reminderDate: { lt: now },
//     },
    
//   });

//   const hasDebt = unpaidOldInvoices.length > 0;

//   if (unpaidOldInvoices.length > 0) {
//     const firstInvoice = unpaidOldInvoices[0];
//     const client = await prisma.customer.findUnique({
//       where: { id: Number(firstInvoice.customerId), }
//     });
  
//     if (client) {
//       await notifyUserOrCustomer({
//         saleId: null,
//         customerId: client.id,
//         message: `Vous avez crée une promesse d'achat le ${firstInvoice.createdAt}; Souhaitez-vous la valider? Rendez-vous dans la liste des promesses`,
//         type: "order"
//       });
//     }
  
//   }
//   console.log({
//   customerId: parseInt(customerId),
//   now,
//   unpaidOldInvoicesCount: unpaidOldInvoices.length,
//   unpaidOldInvoices,
//   });
  
//   return hasDebt;
// };


export async function expireSalePromiseIfNeeded(promiseId: number) {
  const sp = await prisma.salePromise.findUnique({
    where: { id: promiseId },
    include: { items: true },
  });
  if (!sp) return null;

  const now = new Date();
  const due = sp.dueDate ? new Date(sp.dueDate) : null;

  // déjà validée → ne rien faire
  if (sp.status === "validated") return sp;

  // si pas d'échéance ou pas dépassée → ne rien faire
  if (!due || due >= now) return sp;

  // déjà expirée & déjà restockée → ne rien faire
  if (sp.status === "expired" && sp.restocked == true) return sp;

  // Rendre tout le stock réservé
  await Promise.all(
    sp.items.map((it) =>
      prisma.product.update({
        where: { id: it.product_id },
        data: { quantity: { increment: it.product_quantity } },
      })
    )
  );

  const updated = await prisma.salePromise.update({
    where: { id: sp.id },
    data: { status: "expired", restocked: true },
  });

  return updated;
}


export const getSalePromise = async (req: Request, res: Response): Promise<void> => {
  try {
    const { startDate, endDate } = req.query;
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
    const invoices = await prisma.salePromise.findMany({
      where: { 
        createdAt: {
          gte: startDate ? new Date(startDate as string) : undefined,
          lte: endDate ? new Date(endDate as string) : undefined,
        },
        institutionId: institution.id, },
      include: {
        customer: true,
        user: true,
        items: {
          include: {
            product: true
          }
        }
      },
      orderBy: { createdAt: 'desc' }
    });
    res.json(invoices);
  } catch (error) {
    res.status(500).json({ error: 'Internal server error' });
  }
};

export const getSalePromiseByCustomer = async (req: Request, res: Response): Promise<void> => {
  try {
    const { startDate, endDate } = req.query;
    const creatorType = req.auth.userType; // Type de créateur ("user" ou "customer")
      
    const creator = req.auth.sub;  
      
      if (creatorType !== "customer") {
        res.status(403).json({ message: "Seuls les clients peuvent accéder à leurs notifications." });
        return;
      }
     
      if (!creator) {
         res.status(400).json({ message: "Identifiant du client manquant." });
         return;
      }
    
    const invoic = await prisma.salePromise.findMany({
      where: { 
        customerId: creator,
        createdAt: {
          gte: startDate ? new Date(startDate as string) : undefined,
          lte: endDate ? new Date(endDate as string) : undefined,
        },
        },
      include: {
        customer: true,
        user: true,
        items: {
          include: {
            product: true
          }
        }
      },
      orderBy: { createdAt: 'desc' }
    });
    res.json(invoic);
  } catch (error) {
    console.error("Erreur getSalePromiseByCustomer:", error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

export const getSalePromiseById = async (req: Request, res: Response): Promise<void> => {
  try {
    const promiseId = Number(req.params.id);
    await expireSalePromiseIfNeeded(promiseId);
    const invoice = await prisma.salePromise.findUnique({
      where: { id: promiseId },
      include: {
        customer: true,
        user: true,
        items: {
          include: {
            product: true
          }
        },
      }
    });

    if (!invoice) {
      res.status(404).json({ error: 'Invoice not found' });
    }

    res.json(invoice);
  } catch (error) {
    res.status(500).json({ error: 'Internal server error' });
  }
};



export const deleteSalePromise = async (req: Request, res: Response): Promise<void> => {
  try {
    const id = Number(req.params.id); // Utiliser "id"

    // Afficher l'ID pour vérifier sa réception
    console.log("ID de la facture reçu : ", id);

    if (!id) {
      res.status(400).json({ error: "ID de facture invalide" });
      return; 
    }
    

    // Récupérer les produits associés à la facture
    const items = await prisma.salePromiseProduct.findMany({
      where: {
        promise_id: id, // Utiliser l'ID converti
      },
      include: {
        product: true, // Inclure les détails des produits
      }
    });

    // Restaurer les quantités en stock
    for (const item of items) {
      await prisma.product.update({
        where: {
          id: item.product_id,
        },
        data: {
          quantity:
            item.product.quantity +
            item.product_quantity,
        },
      });
    }

    // Supprimer d'abord les items 
    await prisma.salePromiseProduct.deleteMany({
      where: {
        promise_id: id,
      },
    });


    // Supprimer la facture de prommesse d'achat
    await prisma.salePromise.delete({
      where: {
        id
      },
    });

    console.log(
      `La commande avec l'ID ${id} a été annulée et les produits ont été restaurés en stock.`
    );
      res.status(200).json({
      message: "Facture mise à jour avec succès",
      data: items
    });
  } catch (error) {
    console.error("Erreur lors de l'annulation de la commande :", error);
    res.status(500).json({ error: "Erreur lors de l'annulation de la commande." });
  }
};

