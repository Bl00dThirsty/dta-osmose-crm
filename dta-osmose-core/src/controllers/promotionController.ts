import { Request, Response } from "express";
const { PrismaClient } = require("@prisma/client");
import { v4 as uuidv4 } from 'uuid';

const prisma = new PrismaClient();

/**
 * @desc    Crée une nouvelle promotion pour un produit
 * @route   POST /promotions/:institution/
 * @access  Privé (Authentifié)
 * 
 * @body    {string}  productId   - ID du produit à promouvoir
 * @body    {number}  discount    - Pourcentage de remise (ex: 15 pour 15%)
 * @body    {string}  startDate   - Date de début de la promotion (ISO string)
 * @body    {string}  endDate     - Date de fin de la promotion (ISO string)
 * @body    {string}  [title]     - Titre optionnel de la promotion
 * 
 * @returns {Object} Promotion créée avec les informations du produit et créateur
 * @throws  {400} Si l'institution est manquante ou période chevauchante
 * @throws  {401} Si l'utilisateur n'est pas authentifié
 * @throws  {404} Si l'institution ou le produit n'existe pas
 * @throws  {500} Erreur serveur inattendue
 */
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
    /**
     * Vérification des chevauchements de promotions
     * Empêche la création de promotions sur le même produit
     * pendant des périodes qui se chevauchent
     * 
     * Condition: Une promotion existe si:
     * - startDate nouvelle promo ≤ endDate promo existante ET
     * - endDate nouvelle promo ≥ startDate promo existante
     */
    const overlappingPromotion = await prisma.promotion.findFirst({
      where: {
        productId,
        institutionId: institution.id,
        // condition de chevauchement TEMPORELLE
        AND: [
          { startDate: { lte: new Date(endDate) } }, // Début nouvelle promo ≤ Fin promo existante
          { endDate: { gte: new Date(startDate) } }  // Fin nouvelle promo ≥ Début promo existante
        ]
      }
    });

    if (overlappingPromotion) {
      return res.status(400).json({
        error: "Une promotion existe déjà pour ce produit dans cette période.",
        existingPromotion: overlappingPromotion, // Renvoie les infos de la promo existante pour debug
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

    const now = new Date();
    if (promotion.startDate > now){
      await prisma.promotion.update({
        where: { id: promotion.id },
        data: { status: false }, 
      });
    }

    res.status(201).json(promotion);
  } catch (error) {
    console.error("Erreur création promotion:", error);
    res.status(500).json({ error: "Erreur serveur" });
  }
};


/**
 * @desc    Lister les promotion actives
 * @route   GET /promotions/:institution/active
 * @access  Privé (Authentifié)
 * 
 * condition statue=true
 * 
 * @returns {Object} Promotion créée avec les informations du produit et créateur
 * @throws  {400} Si l'institution est manquante ou période chevauchante
 * @throws  {401} Si l'utilisateur n'est pas authentifié
 * @throws  {404} Si l'institution ou le produit n'existe pas
 * @throws  {500} Erreur serveur inattendue
 */
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
    // Activer les promotions dont la date de fin a ete modifier et dont le status est desactiver
     await prisma.promotion.updateMany({
     where: {
       institutionId: institution.id,
       status: false,
       startDate: { lte: now },
       endDate: { gte: now } // gte = supérieur à maintenant = expirées
      },
       data: { status: true }
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

    // Activer les promotions dont la date de fin a ete modifier et dont le status est a desactiver
     await prisma.promotion.updateMany({
     where: {
       institutionId: institution.id,
       status: false,
       endDate: { gte: now } // lt = superirieur à maintenant = expirées
      },
       data: { status: true }
    });

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
        if (!id) {
        res.status(404).json({ error: "Protion Id non trouvé" });
        return;
      }
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