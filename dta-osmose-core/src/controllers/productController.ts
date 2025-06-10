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

export const importProducts = async (req: Request, res: Response): Promise<void> => {
  try {
    const institutionSlug = req.params.institution;
    const products: any[] = req.body;

    if (!Array.isArray(products) || products.length === 0) {
      res.status(400).json({ message: "Aucune donnée reçue." });
      return;
    }

    const institution = await prisma.institution.findUnique({
      where: { slug: institutionSlug },
    });

    if (!institution) {
      res.status(404).json({ message: "Institution introuvable." });
      return;
    }

    const createdProducts = [];

    for (const row of products) {
      if (!row.EANCode) continue;
     
      const existing = await prisma.product.findUnique({
        where: { EANCode: row.EANCode },
      });

      if (existing) continue;

      const product = await prisma.product.create({
        data: {
          id: uuidv4(),
          EANCode: row.EANCode,
          brand: row.brand,
          designation: row.designation,
          quantity: Number(row.quantity) || 0,
          purchase_price: Number(row.purchase_price) || 0,
          sellingPriceTTC: Number(row.sellingPriceTTC) || 0,
          restockingThreshold: Number(row.restockingThreshold) || 0,
          warehouse: row.warehouse,
          institution: {
            connect: { id: institution.id },
          },
        },
      });

      createdProducts.push(product);
    }

    res.status(201).json({ message: `${createdProducts.length} produits importés.` });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Erreur lors de l'import." });
  }
};

export const getSingleProduct = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;

    if (!id) {
      res.status(400).json({ message: "ID du produit manquant." });
      return;
    }

    const product = await prisma.product.findUnique({
      where: { id },
    });

    if (!product) {
      res.status(404).json({ message: "Produit non trouvé." });
      return;
    }

    res.status(200).json(product);
  } catch (error) {
    console.error("Erreur lors de la récupération du produit :", error);
    res.status(500).json({ message: "Erreur serveur" });
  }
};

