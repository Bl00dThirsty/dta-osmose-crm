import { Request, Response } from 'express';
const { PrismaClient } = require("@prisma/client");
import { randomInt } from "crypto"; 
//import { generateInvoiceNumber } from '../utils/invoiceGenerator';
import { v4 as uuidv4 } from 'uuid';
const {
  notifyUserOrCustomer,
  notifyAllUsers
} = require("../websocketNotification");
import { expireSalePromiseIfNeeded } from "./promiseSaleConroller"

const prisma = new PrismaClient();

/**
 * @desc    Crée une nouvelle facture de vente avec gestion complète
 * @route   POST /api/institutions/:institution/sale-invoices
 * @access  Privé (Authentifié)
 * 
 * @param   {string} institution - Slug de l'institution
 * @body    {number} customerId - ID du client
 * @body    {Array} items - Liste des produits avec quantité et prix
 * @body    {number} [discount] - Remise globale sur la facture
 * @body    {number} paidAmount - Montant payé immédiatement
 * @body    {string} paymentMethod - Méthode de paiement
 * 
 * @returns {Object} Facture créée avec tous les détails
 * @throws  {400} Stock insuffisant ou données invalides
 * @throws  {401} Utilisateur non authentifié
 * @throws  {404} Institution non trouvée
 * @throws  {500} Erreur serveur
 */
export const createSaleInvoice = async (req: Request, res: Response): Promise<void> =>  {
    console.log('=== DEBUT DE LA REQUETE ===');
    console.log('Headers:', req.headers);
    console.log('Params:', req.params);
    console.log('Body:', req.body);
    console.log('Auth:', req.auth);
  
    try {
      interface SaleItemInput {
        productId: string;
        quantity: number;
        unitPrice: number;
        
      }
      
    const { customerId, items, discount, paidAmount, paymentMethod, salePromiseId, }: {
      customerId: number;
      items: SaleItemInput[];
      discount?: number;
      paidAmount: number;
      paymentMethod: string;
      salePromiseId?: number;} = req.body;
   
    const institutionSlug = req.params.institution;
    const randomSuffix = randomInt(1000, 9999);
    const invoiceNumber = `${institutionSlug}-fac-${customerId}-${randomSuffix}`;

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


      const credit = await prisma.credit.findFirst({
        where: {
          customerId,
          amount: { gt: 0 },
          usedAmount: { lt: prisma.credit.fields.amount },
        },
        orderBy: { createdAt: 'asc' }, // on utilise le crédit le plus ancien
      });

  // 🔒 Si on vient d'une promesse : vérifier non expirée / non validée
    let promiseItems: { product_id: string; product_quantity: number }[] = [];
    if (salePromiseId) {
      const sp = await expireSalePromiseIfNeeded(salePromiseId);
      if (!sp){
         res.status(404).json({ message: "Promesse introuvable" });
         return;
      }
      if (sp?.status === "expired"){        
        res.status(400).json({ message: "Promesse expirée, impossible de valider." });
        return;
      }
      if (sp?.status === "validated"){
        res.status(400).json({ message: "Promesse déjà validée." });
        return;
      }
      // Charger items pour calculer le delta
      const spFull = await prisma.salePromise.findUnique({
        where: { id: salePromiseId },
        include: { items: true },
      });
      promiseItems = spFull?.items?.map((i:any) => ({
        product_id: i.product_id,
        product_quantity: i.product_quantity,
      })) ?? [];
    }
      
// Validation & application des promotions 
const now = new Date();

const validatedItems = await Promise.all(
  items.map(async (item) => {
    const product = await prisma.product.findUnique({
      where: { id: item.productId }
    });

    if (!product || product.quantity < item.quantity) {
      throw new Error(`Stock insuffisant pour le produit "${product?.designation}". 
                       Quantité demandée : ${item.quantity}, Stock disponible : ${product?.quantity || 0}`);
    }

    const activePromo = await prisma.promotion.findFirst({
      where: {
        productId: item.productId,
        startDate: { lte: now },
        endDate: { gte: now },
        status: true,
      }
    });

    const unitPrice = activePromo
      ? product.sellingPriceTTC * (1 - activePromo.discount / 100)
      : product.sellingPriceTTC;

    return {
      productId: item.productId,
      quantity: item.quantity,
      unitPrice,
      totalPrice: unitPrice * item.quantity,
    };
  })
);

// Si une erreur est levée dans `Promise.all`, elle sera capturée dans le bloc `catch`.
console.log("Produits validés :", validatedItems);


    // Vérification des stocks
    // for (const item of items) {
    //   const product = await prisma.product.findUnique({
    //     where: { id: item.productId }
    //   });

    //   if (!product || product.quantity < item.quantity) {
    //       res.status(400).json({
    //       error: `Stock insuffisant pour le produit ${product?.designation}`
    //     });
    //     return;
    //   }
    // }

    const allProduct = await Promise.all(
      items.map(async (item) => {
        const product1 = await prisma.product.findUnique({
          where: {
            id: item.productId
          },
        });
        return product1;
      })
    );

    // Calcul du total purchase price
    let totalPurchasePrice = 0;
    items.forEach((item, index:any) => {
      totalPurchasePrice +=
        allProduct[index].purchase_price * item.quantity;
    });

    // Création de la facture
    const invoice = await prisma.saleInvoice.create({
      data: {
        //invoiceNumber: generateInvoiceNumber(),
        invoiceNumber,
        customerId,
        userId: creatorType === "user" ? Number(creatorId) : undefined,
        customerCreatorId: creatorType === "customer" ? Number(creatorId) : undefined,
        institutionId: institution.id,
        totalAmount: validatedItems.reduce((sum:any, item) => sum + (item.quantity * item.unitPrice), 0),
        discount: discount || 0,
        finalAmount: 0,
        profit: 0,
        paidAmount: 0,
        dueAmount: 0,
        paymentMethod,
        items: {
          create: validatedItems.map((item) => ({
            productId: item.productId,
            quantity: item.quantity,
            unitPrice: item.unitPrice,
            totalPrice: item.quantity * item.unitPrice
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

    const totalSansRemise = invoice.totalAmount;
    const montantAvecRemise = totalSansRemise - (invoice.discount || 0);
    let montantApresCredit = montantAvecRemise;
    let creditUtilise = 0;

    if (credit) {
      const disponible = credit.amount - credit.usedAmount;
      creditUtilise = Math.min(disponible, montantAvecRemise);
      montantApresCredit = montantAvecRemise - creditUtilise;

      await prisma.credit.update({
        where: { id: credit.id },
        data: {
          usedAmount: {
          increment: creditUtilise
          }
        }
      });
    }

     if (salePromiseId) {
      // Map promesse
      const promised = new Map<string, number>();
      for (const i of promiseItems) {
        promised.set(i.product_id, (promised.get(i.product_id) ?? 0) + i.product_quantity);
      }
      // Map facture
      const invoiced = new Map<string, number>();
      for (const i of validatedItems) {
        invoiced.set(i.productId, (invoiced.get(i.productId) ?? 0) + i.quantity);
      }

      // 1) Pour chaque produit facturé, si quantité > promise → décrémenter la différence
      for (const [pid, qtyInv] of invoiced.entries()) {
        const qtyProm = promised.get(pid) ?? 0;
        const diff = qtyInv - qtyProm;
        if (diff > 0) {
          await prisma.product.update({
            where: { id: pid },
            data: { quantity: { decrement: diff } },
          });
        }
      }

      // 2) Pour chaque produit promis, si quantité > facture → ré-incrémenter la différence
      for (const [pid, qtyProm] of promised.entries()) {
        const qtyInv = invoiced.get(pid) ?? 0;
        const diff = qtyProm - qtyInv;
        if (diff > 0) {
          await prisma.product.update({
            where: { id: pid },
            data: { quantity: { increment: diff } },
          });
        }
      }

      // 3) Marquer la promesse validée
      await prisma.salePromise.update({
        where: { id: salePromiseId },
        data: { status: "validated" }, // restocked true = plus rien à rendre plus tard
      });
    } else {
      // 💡 cas classique: pas de promesse → décrémenter comme avant
      await Promise.all(
        validatedItems.map((it) =>
          prisma.product.update({
            where: { id: it.productId },
            data: { quantity: { decrement: it.quantity } },
          })
        )
      );
    }


    // Mise à jour finale
    const updatedInvoice = await prisma.saleInvoice.update({
      where: { id: invoice.id },
      data: {
        finalAmount: montantAvecRemise,
        profit: montantAvecRemise - totalPurchasePrice,
        dueAmount: montantApresCredit - (paidAmount || 0),
        paidAmount,
      },
      include: {
        items: { include: { product: true } },
        customer: true,
        user: true
      }
    });

    // Vérifier si la commande est intégralement couverte (par crédit et/ou paiement)
     let paymentStatus: 'PAID' | 'PENDING' | 'PARTIAL' = 'PENDING';

     if (montantApresCredit - (paidAmount || 0) <= 0) {
        paymentStatus = 'PAID';
     } else if ((paidAmount || 0) > 0) {
        paymentStatus = 'PARTIAL';
     }

    // Mise à jour du statut de paiement
     await prisma.saleInvoice.update({
       where: { id: invoice.id },
       data: { paymentStatus }
     });
     
     if (creatorType === "customer") {
    //   await notifyAllUsers({
    //     saleId: invoice.id,
    //     institutionId: institution.id,
    //     message: `Nouvelle commande créée avec ID : ${invoice.invoiceNumber} par le client No ${invoice.customerId}`,
    //     type: "order"
    //  });
    await notifyAllUsers(
      invoice.id,
      //institution.id,
      `Nouvelle commande créée avec ID : ${invoice.invoiceNumber} par le client ${creatorId}`
    );
     }
     
     if (creatorType === "user") {
      await notifyUserOrCustomer({
        saleId: invoice.id,
        customerId: invoice.customerId,
        institutionId: institution.id,
        productId: null,
        message: `Votre commande N°: ${invoice.invoiceNumber} a été créée et la valeur à payer est de: ${updatedInvoice.finalAmount} fcfa.`,
        type: "order"
      });
     }

    console.log("le type user", creatorType)
    // Mise à jour des stocks
    // await Promise.all(validatedItems.map((item) => 
    //   prisma.product.update({
    //     where: { id: item.productId },
    //     data: { 
    //       quantity: { decrement: item.quantity } 
    //     }
    //   })
    // ));
    for (const item of items) {
      const product = await prisma.product.findUnique({
        where: { id: item.productId }
      });
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
          productId: product.id,
          institutionId: institution.id,
          message: `Le stock du produit "${product.designation}" est bas (seuil atteint), "${product.restockingThreshold}" Produits restants"`,
          type: "stock_alert"
        });
      }
    }
  }

    const users = await prisma.user.findMany();


    res.status(201).json(updatedInvoice);
  } catch (error) {
    console.error('ERREUR COMPLETE:', error);
    if (error instanceof Error) {
      console.error('Stack trace:', error.stack);
    }
    res.status(500).json({ error: 'Internal server error' });
  }
};

/** @titre Récupération des factures impayées depuis plus d'un mois
 * DPAV: Delais de paiement apres vente par defaut nous avons chois 1 mois 
 * */ 
export const checkCustomerDebtStatus = async (req: Request, res: Response) => {
  const { customerId } = req.params;
  const institutionSlug = req.params.institution;
  const institution = await prisma.institution.findUnique({
        where: { slug: institutionSlug },
    });
  
      if (!institution) {
        res.status(404).json({ message: "Institution introuvable." });
        return;
      }
  const now = new Date();
  const oneMonthAgo = new Date();
  oneMonthAgo.setMonth(oneMonthAgo.getMonth() - 1);
  //oneMonthAgo.setMonth(now.getMonth() - 25);
  //const oneMonthAgo = new Date(now.setDate(now.getDate() - 20));

  const unpaidOldInvoices = await prisma.saleInvoice.findMany({
    where: {
      customerId: parseInt(customerId),
      paymentStatus: { not: "PAID" },
      delivred: true,
      createdAt: { lt: oneMonthAgo },
    },
    
  });

  const hasDebt = unpaidOldInvoices.length > 0;

  if (unpaidOldInvoices.length > 0) {
    const firstInvoice = unpaidOldInvoices[0];
    const client = await prisma.customer.findUnique({
      where: { id: firstInvoice.customerId }
    });
  
    if (client) {
      await notifyUserOrCustomer({
        saleId: firstInvoice.id,
        customerId: client.id,
        message: `Vous avez une dette de ${firstInvoice.dueAmount} F CFA`,
        type: "order"
      });
    }
  
    const users = await prisma.user.findMany({
      where: {
        role: {
          in: ['manager', 'admin']
        }
      }
    });

    // await notifyAllUsers(
    //   firstInvoice.id,
    //   //institution.id,
    //   `Le client: ${client.name} n'a pas terminé de payer sa dette de ${firstInvoice.dueAmount} F CFA, cela fait plus d'un mois`      
    // );
  
    for (const u of users) {
      await notifyUserOrCustomer({
          saleId: firstInvoice.id,
          userId: u.id,
          institutionId: institution.id,
          message: `Le client: ${client.name} n'a pas terminé de payer sa dette de ${firstInvoice.dueAmount} F CFA, cela fait plus d'un mois`,
          type: "order"
        });
    }
  }
  console.log({
  customerId: parseInt(customerId),
  oneMonthAgo,
  unpaidOldInvoicesCount: unpaidOldInvoices.length,
  unpaidOldInvoices,
  });
  


  res.json({ hasDebt });
};


export const getSaleInvoices = async (req: Request, res: Response): Promise<void> => {
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
    const invoices = await prisma.saleInvoice.findMany({
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

export const getSaleInvoiceById = async (req: Request, res: Response): Promise<void> => {
  try {
    const invoice = await prisma.saleInvoice.findUnique({
      where: { id: req.params.id },
      include: {
        customer: {
          include: {
            credits: true
          }
        },
        user: true,
        items: {
          include: {
            product: true
          }
        },
        claims: true
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

export const updateSaleStatus = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const { ready, delivred, date } = req.body;
    const institutionslug = req.params.institution;
    const now = new Date();
    // Validation
    const invoice = await prisma.saleInvoice.findUnique({
      where: { id },
    });

    if (!invoice) {
      res.status(404).json({ error: "Facture non trouvée" });
      return;
    }

    const updatedInvoice = await prisma.saleInvoice.update({
      where: { id },
      data: {
        ready: typeof ready === 'boolean' ? ready : invoice.ready,
        delivred: typeof delivred === 'boolean' ? delivred : invoice.delivred,
        date: delivred === true ? new Date() : invoice.date,

      },
    });
    
    if (ready === true) {
      const clientId = updatedInvoice.customerId; // Utilisation de l'id du client associé à la commande

      // Envoi de la notification au client
      const client = await prisma.customer.findUnique({
        where: { id: clientId }
      });

      if (client) {
        // Assurez-vous que notifyUser accepte l'identifiant du client
        await notifyUserOrCustomer({
          saleId: updatedInvoice.id,
          customerId: updatedInvoice.customerId,
          message: `Votre commande N°: ${updatedInvoice.invoiceNumber} est prête.`,
          type: "update_order"
        });
      }
    }

    if (delivred === true) {
      const clientId = updatedInvoice.customerId; // Utilisation de l'id du client associé à la commande

      // Envoi de la notification au client
      const client = await prisma.customer.findUnique({
        where: { id: clientId }
      });

      if (client) {
        // Assurez-vous que notifyUser accepte l'identifiant du client
        await notifyUserOrCustomer({
          saleId: updatedInvoice.id,
          customerId: updatedInvoice.customerId,
          message: `Votre commande N°: ${updatedInvoice.invoiceNumber} a été livrée.`,
          type: "update_order"
        });
      }
    }


    res.status(200).json(updatedInvoice);
  } catch (error) {
    console.error("Erreur lors de la mise à jour du statut de la facture:", error);
    res.status(500).json({ error: "Erreur interne du serveur" });
  }
};


/**
 * @desc    Met à jour le paiement d'une facture et recalcule les montants
 * @route   PATCH /api/invoices/:id/payment
 * @access  Privé (Authentifié)
 * 
 * @param   {string} id - ID de la facture à mettre à jour
 * @body    {string} paymentMethod - Méthode de paiement (cash, card, etc.)
 * @body    {number} paidAmount - Montant payé
 * @body    {number} [discount=0] - Remise supplémentaire à appliquer
 * @body    {number} [dueAmount] - Montant dû après paiement (optionnel)
 * 
 * @returns {Object} Facture mise à jour avec les nouveaux calculs
 * @throws  {400} Items invalides ou crédit non trouvé
 * @throws  {404} Facture non trouvée
 * @throws  {500} Erreur serveur
 */
export const updatePayment = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const { paymentMethod, paidAmount, discount = 0, dueAmount } = req.body;

    const items = await prisma.saleItem.findMany({
      where: {
        invoiceId: id, // Utiliser l'ID converti
      },
      include: {
        product: true, // Inclure les détails des produits
      }
    });

    if (!Array.isArray(items) || items.length === 0) {
      res.status(400).json({ error: 'Items invalides ou manquants pour recalculer le profit.' });
      return;
    }
       
    const invoice = await prisma.saleInvoice.findUnique({ where: { id } });
   
    // Recherche du crédit disponible pour ce client
    const credit = await prisma.credit.findFirst({
      where: {
        customer: { // Relation vers le modèle `customer`
          saleInvoice: { // Relation vers les factures du client
            some: { // Au moins une facture correspondante
              id: invoice.id // ID de la facture cible
            }
          }
        },
        amount: { gt: 0 }, // Crédit non nul
        // usedAmount: { lt: prisma.credit.fields.amount }, // Crédit non entièrement utilisé
      },
      orderBy: { createdAt: 'asc' }, // Utiliser le crédit le plus ancien en premier (FIFO)
    });
    if (!invoice) {
      res.status(404).json({ error: 'Invoice not found' });
      return;
    }
    // if (credit){
    //   res.status(404).json({ error: 'Credit not found' });
    //   return;
    // }

    const allProduct = await Promise.all(
      items.map(async (item: any) => {
        const product = await prisma.product.findUnique({
          where: { id: item.productId },
        });
        if (!product) throw new Error(`Produit introuvable: ${item.productId}`);
        return product;
      })
    );    

    let totalPurchasePrice = 0;
    items.forEach((item: any, index: number) => {
      totalPurchasePrice += allProduct[index].purchase_price * item.quantity;
    });

    const totalDiscount = (invoice.discount ?? 0) + discount;
    const totalPaid = (invoice.paidAmount ?? 0) + paidAmount;
    const finalAmount = (invoice.totalAmount ?? 0) - totalDiscount;
    //const remainingAmount = Math.max(newFinalAmount - totalPaid, 0); // toujours >= 0

    // Appliquer le crédit disponible
    let remainingAmount = 0;
    let creditUsed = 0;

    // if (credit && credit.usedAmount < credit.amount) {
    //   const availableCredit = credit.amount - credit.usedAmount;
    //   creditUsed = Math.min(availableCredit, finalAmount);
    //   remainingAmount -= creditUsed;

    //   // Mettre à jour l'état du crédit
    //   // await prisma.credit.update({
    //   //   where: { id: credit.id },
    //   //   data: {
    //   //     usedAmount: {
    //   //       increment: creditUsed,
    //   //     },
    //   //   },
    //   // });
    // }
    if(credit){
      remainingAmount = invoice.dueAmount - (discount ?? 0)
    }else{
      remainingAmount = (invoice.totalAmount ?? 0) - totalDiscount;
    }
    // if (credit && dueAmount > 0){
    //   remainingAmount = dueAmount;
    // }else{
    //   remainingAmount = finalAmount;
    // }
    // Calcul du montant dû après paiement
    remainingAmount = Math.max(remainingAmount - totalPaid, 0); // Assurez-vous que le montant restant est >= 0
    let newStatus = invoice.paymentStatus;
    if (remainingAmount === 0) newStatus = 'PAID';
    else if (totalPaid > 0) newStatus = 'PARTIAL';
    const profit = totalPaid - totalPurchasePrice;

    const updatedInvoice = await prisma.saleInvoice.update({
      where: { id },
      data: {
        paymentMethod,
        paymentStatus: newStatus,
        discount: totalDiscount,
        finalAmount: finalAmount,
        paidAmount: totalPaid,
        dueAmount: remainingAmount,
        profit: profit, // bien mis à jour ici
      },
    });


    res.json(updatedInvoice);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal server error' });
  }
};


export const deleteSaleInvoice = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params; // Utiliser "id"

    // Afficher l'ID pour vérifier sa réception
    console.log("ID de la facture reçu : ", id);

    if (!id) {
      res.status(400).json({ error: "ID de facture invalide" });
      return; 
    }
    

    // Récupérer les produits associés à la facture
    const items = await prisma.saleItem.findMany({
      where: {
        invoiceId: id, // Utiliser l'ID converti
      },
      include: {
        product: true, // Inclure les détails des produits
      }
    });

    // Restaurer les quantités en stock
    for (const item of items) {
      await prisma.product.update({
        where: {
          id: item.productId,
        },
        data: {
          quantity:
            item.product.quantity +
            item.quantity,
        },
      });
    }

    // Supprimer d'abord les items 
    await prisma.saleItem.deleteMany({
      where: {
        invoiceId: id,
      },
    });

    // Supprimer les reclamation qui y sont reliers
    // await prisma.claim.delete({
    //   where: {
    //     invoiceId: id,
    //   },
    // });

    // Supprimer la facture
    await prisma.saleInvoice.delete({
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

// let totalPurchasePrice = 0;
//     items.forEach((item: any, index: number) => {
//       totalPurchasePrice += allProduct[index].purchase_price * item.quantity;
//     });

//     const totalDiscount = (invoice.discount ?? 0) + discount;
//     const totalPaid = (invoice.paidAmount ?? 0) + paidAmount;
//     const newFinalAmount = (invoice.totalAmount ?? 0) - totalDiscount;
//     const remainingAmount = Math.max(newFinalAmount - totalPaid, 0); // toujours >= 0

//     let newStatus = invoice.paymentStatus;
//     if (remainingAmount === 0) newStatus = 'PAID';
//     else if (totalPaid > 0) newStatus = 'PARTIAL';
//     const profit = totalPaid - totalPurchasePrice;

//     const updatedInvoice = await prisma.saleInvoice.update({
//       where: { id },
//       data: {
//         paymentMethod,
//         paymentStatus: newStatus,
//         discount: totalDiscount,
//         finalAmount: newFinalAmount,
//         paidAmount: totalPaid,
//         dueAmount: remainingAmount,
//         profit: profit, // bien mis à jour ici
//       },
//     });



