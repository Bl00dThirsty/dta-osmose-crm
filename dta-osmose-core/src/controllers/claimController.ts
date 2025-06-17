import { Request, Response } from "express";
const { PrismaClient } = require("@prisma/client");
import { v4 as uuidv4 } from 'uuid';

const prisma = new PrismaClient();

export const createClaims = async (
    req: Request,
    res: Response
  ): Promise<void> => {
    try {
        const { invoiceId, productId, quantity, reason, description } = req.body;
        const institutionSlug = req.params.institution;
        const institution = await prisma.institution.findUnique({
            where: { slug: institutionSlug },
          });
      
          if (!institution) {
            res.status(404).json({ message: "Institution introuvable." });
            return;
          }
    
        const item = await prisma.saleItem.findFirst({ where: { invoiceId, productId } });
      
        if (!item) 
            res.status(404).json({ message: "Produit non trouvé dans la commande" });
      
        const totalAmount = item.unitPrice * quantity;
      
        const claim = await prisma.claim.create({
          data: {
            invoiceId,
            productId,
            institutionId: institution.id,
            quantity,
            unitPrice: item.unitPrice,
            totalAmount,
            reason,
            description,
          },
        });
      
        res.status(201).json(claim);
    } catch (error) {
      res.status(500).json({ message: "Erreur lors de la creation de la reclamation" });
    }
  };

  export const respondToClaim = async (req: Request, res: Response): Promise<void> => {
    try {
      const institutionSlug = req.params.institution;
      const institution = await prisma.institution.findUnique({
            where: { slug: institutionSlug },
      });
      
          if (!institution) {
            res.status(404).json({ message: "Institution introuvable." });
            return;
          }
      const { claimId } = req.params;
      const { status, description } = req.body;
      const claim = await prisma.claim.findUnique({ 
        where: { 
            id: claimId 
        }, 
        include: { invoice: true } 
      });
      if (!claim) 
        res.status(404).json({ message: "Réclamation non trouvée" });
  
      const response = await prisma.claimResponse.create({ 
        data: { claimId, status, description } 
      });
  
      if (status === "ACCEPTED") {
        await prisma.credit.upsert({
          where: { 
            customerId: claim.invoice.customerId 
          },
          update: { 
            amount: { increment: claim.totalAmount } 
          },
          create: { 
            customerId: claim.invoice.customerId, amount: claim.totalAmount, usedAmount: 0 
          },
        });
      }
      res.json(response);
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Erreur lors de la réponse à la réclamation" });
    }
  };

  export const getClaims = async (req: Request, res: Response): Promise<void> => {
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
      const claims = await prisma.claim.findMany({
        where: { 
          createdAt: {
            gte: startDate ? new Date(startDate as string) : undefined,
            lte: endDate ? new Date(endDate as string) : undefined,
          },
          institutionId: institution.id, },
        include: {
          invoice: {
            include: {
              items: {
                include: {
                  product: true,
                }
              }
            }
          }
        },
        orderBy: { createdAt: 'desc' }
      });
      res.json(claims);
    } catch (error) {
      res.status(500).json({ error: 'Internal server error' });
    }
  };
  