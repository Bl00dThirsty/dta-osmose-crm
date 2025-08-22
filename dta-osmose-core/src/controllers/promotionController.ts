import { Request, Response } from "express";
const { PrismaClient } = require("@prisma/client");
import { v4 as uuidv4 } from 'uuid';

const prisma = new PrismaClient();

export const createPromotion = async (req: Request, res: Response) => {
  try {
    const { productId, discount, startDate, endDate, title } = req.body;
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
    const userAuth = req.auth as { sub?: number };
    if (!userAuth?.sub) {
      res.status(401).json({ error: "Utilisateur non authentifié" });
      return;
    } // selon ton middleware d'auth

    const product = await prisma.product.findUnique({ where: { id: productId } });
    if (!product) {
      return res.status(404).json({ error: "Produit introuvable" });
    }

    const overlappingPromotion = await prisma.promotion.findFirst({
      where: {
        productId,
        institutionId: institution.id,
        // condition de chevauchement
        AND: [
          { startDate: { lte: new Date(endDate) } },
          { endDate: { gte: new Date(startDate) } }
        ]
      }
    });

    if (overlappingPromotion) {
      return res.status(400).json({
        error: "Une promotion existe déjà pour ce produit dans cette période.",
        existingPromotion: overlappingPromotion,
      });
    }

    const promotion = await prisma.promotion.create({
      data: {
        productId,
        discount,
        startDate: new Date(startDate),
        endDate: new Date(endDate),
        title,
        creatorId: userAuth.sub,
        institutionId: institution.id
      },
      include: { product: true, user: true },
    });

    res.status(201).json(promotion);
  } catch (error) {
    console.error("Erreur création promotion:", error);
    res.status(500).json({ error: "Erreur serveur" });
  }
};

export const getActivePromotions = async (req: Request, res: Response): Promise<void> => {
  try {
    const now = new Date();
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

    // 1. Désactiver d'abord les promotions expirées
    await prisma.promotion.updateMany({
     where: {
       institutionId: institution.id,
       status: true,
       endDate: { lt: now } // lt = inférieur à maintenant = expirées
      },
       data: { status: false }
    });

   // 2. Récupérer les promotions ACTIVES (incluant celles qu'on vient de mettre à jour)
    const promotions = await prisma.promotion.findMany({
      where: {
        status: true,
        startDate: { lte: now },
        endDate: { gte: now },
        institutionId: institution.id,
      },
      include: {
        product: true, // pour avoir les infos produit directement
        user: true
      },
    });

    res.status(200).json(promotions);
  } catch (error: any) {
    console.error("Erreur lors de la récupération des promotions actives :", error);
    res.status(500).json({ message: "Erreur serveur", error: error.message });
  }
};



export const getAllPromotion = async (req: Request, res: Response): Promise<void> => {
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

    const promotions = await prisma.promotion.findMany({
      where: {
        institutionId: institution.id
      },
      include: {
        product: true, // pour avoir les infos produit directement
        user: true // pour avoir les infos users directement
      },
      orderBy: { createdAt: 'desc' }
    });

    res.status(200).json(promotions);
  } catch (error: any) {
    console.error("Erreur lors de la récupération des promotions :", error);
    res.status(500).json({ message: "Erreur serveur", error: error.message });
  }
};

export const getSinglePromotions = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;

    if (!id) {
      res.status(400).json({ message: "ID du produit manquant." });
      return;
    }

    const promotion = await prisma.promotion.findUnique({
      where: { id },
      include: {
        product: true, // pour avoir les infos produit directement
        user: true 
      }
    });

    if (!promotion) {
      res.status(404).json({ message: "promotion non trouvé." });
      return;
    }

    res.status(200).json(promotion);
  } catch (error: any) {
    console.error("Erreur lors de la récupération du produit :", error.stack || error.message);
    res.status(500).json({ message: "Erreur serveur." });
  }

};

export const updateStatusPromotions = async (req:Request, res:Response): Promise<void> => {
    try{
      const { id } = req.params;
      const { status } = req.body;
      const promotion = await prisma.promotion.findUnique({
        where: { id },
      });

      if (!promotion) {
        res.status(404).json({ error: "Promotion non trouvée" });
        return;
      }
      const updatedpromo = await prisma.promotion.update({
        where: { id },
        data: {
          status: typeof status === 'boolean' ? status : promotion.status,
        },
      
      });
      res.status(200).json(updatedpromo);

    } catch (error){
       console.error("Erreur lors de la mise à jour du statut de la promo:", error);
       res.status(500).json({ error: "Erreur interne du serveur" });
    }
}

export const updatePromotion = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const { discount, productId, startDate, endDate, title } = req.body;
    const userAuth = req.auth as { sub?: number };
    if (!userAuth?.sub) {
      res.status(401).json({ error: "Utilisateur non authentifié" });
      return;
    } //

    const promotion = await prisma.promotion.update({
      where: { id },
      data: {
        discount,
        productId,
        startDate: startDate ? new Date(startDate) : undefined,
        endDate: endDate ? new Date(endDate) : undefined,
        title,
        creatorId: userAuth.sub,
        updatedAt: new Date(),
      },
      include: { product: true, user: true },
    });

    res.status(200).json(promotion);
  } catch (error) {
    console.error("Erreur update promotion:", error);
    res.status(500).json({ error: "Erreur serveur" });
  }
};

export const deletePromotion = async (
    req: Request,
    res: Response
  ): Promise<void> => {
    try {
        const { id } = req.params;
        const deletedPromotion = await prisma.promotion.delete({
            where: {
              id,
            },
          });
        res.status(200).json({message: "Promotion deleted successfully", deletedPromotion});
    } catch (error) {
      res.status(500).json({ message: "Erreur lors de la recherche du Promotion" });
    }
  };