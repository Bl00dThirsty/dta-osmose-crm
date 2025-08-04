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
      const { institution: institutionSlug, claimId } = req.params;
      const { status, description } = req.body;
  
      // Vérifier que l'institution existe
      const institution = await prisma.institution.findUnique({
        where: { slug: institutionSlug }
      });
      if (!institution) {
        res.status(404).json({ message: "Institution introuvable." });
        return;
      }
  
      // Vérifier que la réclamation existe
      const claim = await prisma.claim.findUnique({
        where: { id: claimId },
        include: {
          invoice: {
            include: {
              items: {
                include: { product: true }
              },
              customer: true // Pour avoir accès au client concerné via la facture
            }
          },
          product: true,
          response: true 
        }
      });
  
      if (!claim) {
        res.status(404).json({ message: "Réclamation introuvable." });
        return;
      }
  
      // Créer la réponse à la réclamation
      const response = await prisma.claimResponse.create({
        data: {
          claimId,
          status,
          description
        }
      });
  
      // Si ACCEPTED → créer un crédit pour le client lié à la facture
      if (status === "ACCEPTED") {
        const customerId = claim.invoice.customerId;
  
        await prisma.credit.create({
          data: {
            customerId: customerId,
            amount: claim.totalAmount,
            usedAmount: 0
          }
        });
      }
  
      res.status(201).json(response);
  
    } catch (err) {
      console.error("Erreur lors de la réponse à une réclamation :", err);
      res.status(500).json({ message: "Erreur lors de l'enregistrement de la réponse." });
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
              },
              customer: true,
            }
          },
          product: true,
          response: true 
        },
        orderBy: { createdAt: 'desc' }
      });
      res.json(claims);
    } catch (error) {
      res.status(500).json({ error: 'Internal server error' });
    }
  };

  export const getClaimsById = async (req: Request, res: Response): Promise<void> => {
    try {
      const invoice = await prisma.claim.findUnique({
        where: { id: req.params.id },
        include: {
          invoice: {
            include: {
              items: {
                include: {
                  product: true,
                }
              },
              customer: true,
            }
          },
          product: true,
          response: true
        },
      });
  
      if (!invoice) {
        res.status(404).json({ error: 'Claim not found' });
      }
  
      res.json(invoice);
    } catch (error) {
      res.status(500).json({ error: 'Claim server error' });
    }
  };

  export const updateClaimResponse = async (req: Request, res: Response): Promise<void> => {
    try {
      const { responseId } = req.params;
      const { status, description } = req.body;
  
      // 1. Vérifier que la réponse existe
      const existingResponse = await prisma.claimResponse.findUnique({
        where: { id: responseId },
        include: {
          claim: {
            include: {
              invoice: {
                include: { customer: true }
              }
            }
          }
        }
      });
  
      if (!existingResponse) {
        res.status(404).json({ message: "Réponse introuvable." });
        return;
      }
  
      const claim = existingResponse.claim;
  
      // 2. Vérifier si un crédit existe pour cette réclamation (par montant équivalent et client)
      const credit = await prisma.credit.findFirst({
        where: {
          customerId: claim.invoice.customerId,
          amount: claim.totalAmount
        }
      });
  
      // 3. Si un crédit existe et a été utilisé, on empêche la modification
      if (credit && credit.usedAmount > 0) {
        res.status(400).json({
          message: "La réponse ne peut pas être modifiée car le crédit a déjà été utilisé."
        });
        return;
      }
  
      // 4. Mettre à jour la réponse
      const updatedResponse = await prisma.claimResponse.update({
        where: { id: responseId },
        data: {
          status,
          description
        }
      });
  
      // 5. Si le statut est devenu ACCEPTED, s'assurer qu'un crédit existe
      if (status === "ACCEPTED" && !credit) {
        await prisma.credit.create({
          data: {
            customerId: claim.invoice.customerId,
            amount: claim.totalAmount,
            usedAmount: 0
          }
        });
      }
  
      // 6. Si le statut devient autre que ACCEPTED et un crédit existe → le supprimer (optionnel selon logique)
      if (status !== "ACCEPTED" && credit) {
        await prisma.credit.delete({
          where: { id: credit.id }
        });
      }
  
      res.status(200).json(updatedResponse);
    } catch (error) {
      console.error("Erreur lors de la mise à jour de la réponse :", error);
      res.status(500).json({ message: "Erreur interne du serveur." });
    }
  };
  

  export const deleteSingleClaim = async (
    req: Request,
    res: Response
  ): Promise<void> => {
    try {
        const { id } = req.params; // Récupération de l'ID depuis les paramètres de la requête
  
        const existingClaim = await prisma.claim.findUnique({
          where: { 
            id 
          }
        });
        // Vérifier si le user existe
        if (!existingClaim) {
          res.status(404).json({ message: "Claim non trouvé" });
          console.log("Pas trouver de cliam")
          return;
        } 
        const deleteClaimREsponse = await prisma.claimResponse.findUnique({
             where: {
            claimId: id,
           },
        })
        if (!deleteClaimREsponse){
          console.log("Reponse de reclamation pas trouver")
        }
    // Supprimer d'abord claimResponse 
        await prisma.claimResponse.deleteMany({
           where: {
            claimId: id,
           },
        });
        await prisma.claim.delete({
            where: {
              id
            },
        });
           res.status(200).json({ message: "Claim deleted successfully" }); 
    } catch (error) {
      res.status(500).json({ message: "Claim deleted error" });
    }
  
  }
  