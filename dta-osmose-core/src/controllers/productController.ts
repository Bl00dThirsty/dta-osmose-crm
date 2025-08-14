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
  // try {
  //   const institutionSlug = req.params.institution;
  //   const products: any[] = req.body;

  //   if (!Array.isArray(products) || products.length === 0) {
  //     res.status(400).json({ message: "Aucune donnée reçue." });
  //     return;
  //   }

  //   const institution = await prisma.institution.findUnique({
  //     where: { slug: institutionSlug },
  //   });

  //   if (!institution) {
  //     res.status(404).json({ message: "Institution introuvable." });
  //     return;
  //   }

  //   const createdProducts = [];

  //   for (const row of products) {
  //     if (!row.EANCode) continue;
     
  //     const existing = await prisma.product.findUnique({
  //       where: { EANCode: row.EANCode },
  //     });

  //     if (existing) continue;

  //     const product = await prisma.product.create({
  //       data: {
  //         id: uuidv4(),
  //         EANCode: row.EANCode,
  //         brand: row.brand,
  //         designation: row.designation,
  //         quantity: Number(row.quantity) || 0,
  //         purchase_price: Number(row.purchase_price) || 0,
  //         sellingPriceTTC: Number(row.sellingPriceTTC) || 0,
  //         restockingThreshold: Number(row.restockingThreshold) || 0,
  //         warehouse: row.warehouse,
  //         institution: {
  //           connect: { id: institution.id },
  //         },
  //       },
  //     });

  //     createdProducts.push(product);
  //   }

  //   res.status(201).json({ message: `${createdProducts.length} produits importés.` });
  // } catch (error) {
  //   console.error(error);
  //   res.status(500).json({ message: "Erreur lors de l'import." });
  // }
 try {
    // ✅ Récupérer la liste de produits quelle que soit la structure reçue
    const products = Array.isArray(req.body)
      ? req.body
      : Array.isArray(req.body.products)
      ? req.body.products
      : [];

    if (!products.length) {
      res.status(400).json({ message: "Aucune donnée à importer." });
      return;
    }

    const institutionSlug = req.params.institution;
    const institution = await prisma.institution.findUnique({
      where: { slug: institutionSlug },
    });

    if (!institution) {
      res.status(404).json({ message: "Institution introuvable." });
      return;
    }

    let importedCount = 0;
    let updatedCount = 0;
    let skippedCount = 0;
    let errors: any[] = [];
  // || (typeof item.EANCode !== "string" && typeof item.EANCode !== "number")
    for (const [index, item] of products.entries()) {
      try {
        if (!item.EANCode || typeof item.EANCode !== "string") {
          skippedCount++;
          errors.push({ index, reason: "EANCode manquant ou invalide" });
          continue;
        }

        const quantity = Number(item.quantity) || 0;
        const purchase_price = Number(item.purchase_price) || 0;
        const sellingPriceTTC = Number(item.sellingPriceTTC) || 0;
        const restockingThreshold = Number(item.restockingThreshold) || 0;

        const brand = (item.brand || "").trim();
        const designation = (item.designation || "").trim();
        const warehouse = (item.warehouse || "").trim();
        
        // ✅ Vérifier si le produit existe
        const existing = await prisma.product.findUnique({
          where: { EANCode: item.EANCode },
        });

        const result = await prisma.product.upsert({
          where: { EANCode: item.EANCode },
          update: {
            brand,
            designation,
            quantity,
            purchase_price,
            sellingPriceTTC,
            restockingThreshold,
            warehouse,
            institutionId: institution.id, // ✅ liaison directe
          },
          create: {
            id: uuidv4(),
            EANCode: item.EANCode,
            brand,
            designation,
            quantity,
            purchase_price,
            sellingPriceTTC,
            restockingThreshold,
            warehouse,
            institutionId: institution.id,
          },
        });

        if (existing) {
          updatedCount++;
        } else {
          importedCount++;
        }
      } catch (err: any) {
        skippedCount++;
        errors.push({ index, reason: err.message || "Erreur inconnue" });
      }
    }

    res.status(200).json({
      message: "Import terminé",
      imported: importedCount,
      updated: updatedCount,
      skipped: skippedCount,
      errors,
    });
  } catch (error: any) {
    console.error("Erreur lors de l'import :", error);
    res.status(500).json({
      message: "Erreur lors de l'import",
      details: error.message,
      code: error.code || null,
    });
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

export const updateSingleProduct = async (req: Request, res: Response): Promise<void> => {
    try {
      const { id } = req.params;
      const updateData: any = {
      EANCode: req.body.EANCode,
      brand: req.body.brand,
      designation: req.body.designation,
      quantity: req.body.quantity,
      purchase_price: req.body.purchase_price,
      sellingPriceTTC: req.body.sellingPriceTTC,
      restockingThreshold: req.body.restockingThreshold,
      warehouse: req.body.warehouse,
    };

    const updateProduct = await prisma.product.update({
      where: { id },
      data: updateData,
    });
   
    res.status(200).json(updateProduct);

    } catch (error) {
      console.error("Erreur lors de la mise à jour du produit :", error);
      res.status(500).json({ message: "Erreur interne du serveur." });
    }
  };

export const deleteProduct = async (
    req: Request,
    res: Response
  ): Promise<void> => {
    try {
        const { id } = req.params;
        const deletedProduct = await prisma.product.delete({
            where: {
              id,
            },
          });
        res.status(200).json({message: "Product deleted successfully", deletedProduct});
    } catch (error) {
      res.status(500).json({ message: "Erreur lors de la recherche du produit" });
    }
  }

