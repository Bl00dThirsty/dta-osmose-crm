import { Request, Response } from 'express';
const { PrismaClient } = require("@prisma/client");
import { randomInt } from "crypto"; 
//import { generateInvoiceNumber } from '../utils/invoiceGenerator';
import { v4 as uuidv4 } from 'uuid';

const prisma = new PrismaClient();

export const createSaleInvoice = async (req: Request, res: Response): Promise<void> =>  {
    console.log('=== DEBUT DE LA REQUETE ===');
    console.log('Headers:', req.headers);
    console.log('Params:', req.params);
    console.log('Body:', req.body);
    console.log('Auth:', req.auth);
  
    try {
      interface SaleItemInput {
        productId: number;
        quantity: number;
        unitPrice: number;
        
      }
      
    const { customerId, items, discount, paymentMethod }: {
      customerId: number;
      items: SaleItemInput[];
      discount?: number;
      paymentMethod: string;} = req.body;
   
    const institutionSlug = req.params.institution;
    const randomSuffix = randomInt(1000, 9999);
    const invoiceNumber = `${institutionSlug}-fac-${customerId}-${randomSuffix}`;
    // if (!req.auth) {
    //     res.status(401).json({ error: 'Non autorisé' });
    //     return;
    // }
    //const userId = req.auth.sub;
    const payload = req.auth;
    if (!payload?.sub) {
      res.status(401).json({ error: "Utilisateur non authentifié" });
      return;
    }
    const userId = payload.sub;
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
        where: { id: item.productId }
      });

      if (!product || product.quantity < item.quantity) {
          res.status(400).json({
          error: `Stock insuffisant pour le produit ${product?.designation}`
        });
      }
    }

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
        userId,
        institutionId: institution.id,
        totalAmount: items.reduce((sum:any, item) => sum + (item.quantity * item.unitPrice), 0),
        discount: discount || 0,
        finalAmount: 0,
        profit: 0,
        paymentMethod,
        items: {
          create: items.map((item) => ({
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


    // Mise à jour finale
    const updatedInvoice = await prisma.saleInvoice.update({
        where: { id: invoice.id },
        data: {
          finalAmount: invoice.totalAmount - (invoice.discount || 0),
          profit: (invoice.totalAmount - (invoice.discount || 0)) - totalPurchasePrice
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

    // Mise à jour des stocks
    await Promise.all(items.map((item) => 
      prisma.product.update({
        where: { id: item.productId },
        data: { 
          quantity: { decrement: item.quantity } 
        }
      })
    ));

    res.status(201).json(updatedInvoice);
  } catch (error) {
    console.error('ERREUR COMPLETE:', error);
    if (error instanceof Error) {
      console.error('Stack trace:', error.stack);
    }
    res.status(500).json({ error: 'Internal server error' });
  }
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
        customer: true,
        user: true,
        items: {
          include: {
            product: true
          }
        }
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
    const { ready, delivred } = req.body;
    const institutionslug = req.params.institution;

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
      },
    });

    res.status(200).json(updatedInvoice);
  } catch (error) {
    console.error("Erreur lors de la mise à jour du statut de la facture:", error);
    res.status(500).json({ error: "Erreur interne du serveur" });
  }
};

export const updatePayment = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const { paymentMethod, paidAmount } = req.body;

    const invoice = await prisma.saleInvoice.findUnique({ where: { id } });
    if (!invoice) {
      res.status(404).json({ error: 'Invoice not found' });
      return;
    }

    const totalPaid = (invoice.paidAmount ?? 0) + paidAmount;
    const remainingAmount = Math.max((invoice.finalAmount ?? 0) - totalPaid, 0); // toujours >= 0

    let newStatus = invoice.paymentStatus;
    if (remainingAmount === 0) newStatus = 'PAID';
    else if (totalPaid > 0) newStatus = 'PARTIAL';

    const updatedInvoice = await prisma.saleInvoice.update({
      where: { id },
      data: {
        paymentMethod,
        paymentStatus: newStatus,
        paidAmount: totalPaid,
        dueAmount: remainingAmount, // bien mis à jour ici
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


