import { Request, Response } from "express";
const { PrismaClient } = require("@prisma/client");
import { v4 as uuidv4 } from 'uuid';

const prisma = new PrismaClient();

export const getProducts = async (req: Request, res: Response): Promise<void> => {
  try {
    const search = req.query.search?.toString();
    const institutionSlug = req.params.institution;

    if (!institutionSlug) {
      res.status(400).json({ message: "Institution manquante." });
      return;
    }

    // Étape 1 : Chercher l'institution à partir du slug
    const institution = await prisma.institution.findUnique({
      where: { slug: institutionSlug },
    });

    if (!institution) {
      res.status(404).json({ message: "Institution introuvable." });
      return;
    }

    const products = await prisma.product.findMany({
      where: {
        institutionId: institution.id,
        ...(search && {
          designation: {
            contains: search,
            mode: "insensitive",
          },
        }),
      },
    });
    

    res.json(products);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Erreur lors de la recherche du produit" });
  }
};


export const createProduct = async (req: Request, res: Response): Promise<void> => {
  try {
    const institutionSlug = req.params.institution;

    const {
      quantity,
      EANCode,
      brand,
      designation,
      restockingThreshold,
      warehouse,
      sellingPriceTTC,
      purchase_price,
    } = req.body;

    if (!institutionSlug) {
      res.status(400).json({ message: "Institution manquante dans l'URL." });
      return;
    }

    // 🔍 Chercher l'institution à partir du slug
    const institution = await prisma.institution.findUnique({
      where: { slug: institutionSlug },
    });

    if (!institution) {
      res.status(404).json({ message: "Institution introuvable." });
      return;
    }

    const product = await prisma.product.create({
      data: {
        id: uuidv4(),
        quantity,
        EANCode,
        brand,
        designation,
        restockingThreshold,
        warehouse,
        sellingPriceTTC,
        purchase_price,
        institution: {
          connect: { id: institution.id },
        },
      },
    });

    res.status(201).json(product);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Erreur lors de la création du produit." });
  }
};
