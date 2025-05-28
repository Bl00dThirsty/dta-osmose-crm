import { Request, Response } from 'express';
const { PrismaClient } = require("@prisma/client");
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
    const { customerId, items, discount, paymentMethod } = req.body;
   
    const institutionSlug = req.params.institution;
    //const institutionId = req.institution.id;
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

    // Création de la facture
    const invoice = await prisma.saleInvoice.create({
      data: {
        //invoiceNumber: generateInvoiceNumber(),
        invoiceNumber: uuidv4(),
        customerId,
        userId,
        institutionId: institution.id,
        totalAmount: items.reduce((sum:any, item:any) => sum + (item.quantity * item.unitPrice), 0),
        discount: discount || 0,
        finalAmount: 0,
        paymentMethod,
        items: {
          create: items.map((item:any) => ({
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
          finalAmount: invoice.totalAmount - (invoice.discount || 0)
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
    await Promise.all(items.map((item:any) => 
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
      where: { institutionId: institution.id, },
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