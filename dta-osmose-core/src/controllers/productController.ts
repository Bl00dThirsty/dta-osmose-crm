import { Request, Response } from "express";
import { PrismaClient, Prisma } from "@prisma/client";
import { v4 as uuidv4 } from 'uuid';
import { z } from 'zod';

const prisma = new PrismaClient();

const ProductSchema = z.object({
  EANCode: z.string().min(1, "EANCode requis"),
  brand: z.string().min(1, "Brand requis"),
  designation: z.string().min(1, "Designation requis"),
  quantity: z.number().int().min(0).default(0),
  restockingThreshold: z.number().int().min(0).default(0),
  warehouse: z.string().min(1, "Warehouse requis"),
  sellingPriceTTC: z.number().min(0).default(0),
  purchase_price: z.number().min(0).default(0),
});

type ProductData = z.infer<typeof ProductSchema>;

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
  } catch (error: any) {
    console.error("Erreur lors de la recherche des produits :", error.stack || error.message);
    res.status(500).json({ message: "Erreur lors de la recherche des produits." });
  }
};

export const createProduct = async (req: Request, res: Response): Promise<void> => {
  try {
    const institutionSlug = req.params.institution;
    const rawData = req.body;

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

    const validatedData = ProductSchema.parse({
      ...rawData,
      quantity: Number(rawData.quantity) || 0,
      restockingThreshold: Number(rawData.restockingThreshold) || 0,
      sellingPriceTTC: Number(rawData.sellingPriceTTC) || 0,
      purchase_price: Number(rawData.purchase_price) || 0,
    });

    const createData = {
      id: uuidv4(),
      ...validatedData,
      institution: {
        connect: { id: institution.id },
      },
      created_at: new Date(),
      updated_at: new Date(),
      imageName: null,
      idSupplier: null,
      product_category_id: null,
      unit_measurement: null,
      unit_type: null,
      sku: null,
      reorder_quantity: null,
    } as Prisma.productCreateInput;
    const product = await prisma.product.create({ data: createData });

    res.status(201).json(product);
  } catch (error: any) {
    console.error("Erreur lors de la création du produit :", error.stack || error.message);
    if (error instanceof z.ZodError) {
      res.status(400).json({ message: "Données invalides", issues: error.issues });
    } else {
      res.status(500).json({ message: "Erreur lors de la création du produit." });
    }
  }
};

export const importProducts = async (req: Request, res: Response): Promise<void> => {
  try {
    const institutionSlug = req.params.institution;
    const rawProducts: any[] = req.body;

    if (!Array.isArray(rawProducts) || rawProducts.length === 0) {
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

    const existingProducts = await prisma.product.findMany({
      where: { institutionId: institution.id },
      select: { id: true, EANCode: true, quantity: true },
    });
    const existingMap = new Map(existingProducts.map(p => [p.EANCode, { id: p.id, quantity: p.quantity }]));

    const toCreate: ProductData[] = [];
    const toUpdate: { id: string, additionalQuantity: number }[] = [];
    const skipped: string[] = [];

    for (const row of rawProducts) {
      try {
        const parsedRow = {
          EANCode: row.EANCode,
          brand: row.brand || "",
          designation: row.designation || "",
          quantity: Number(row.quantity) || 0,
          purchase_price: Number(row.purchase_price) || 0,
          sellingPriceTTC: Number(row.sellingPriceTTC) || 0,
          restockingThreshold: Number(row.restockingThreshold) || 0,
          warehouse: row.warehouse || "",
        };

        const validated = ProductSchema.parse(parsedRow);

        const existing = existingMap.get(validated.EANCode);
        if (existing) {
          toUpdate.push({ id: existing.id, additionalQuantity: validated.quantity });
          continue;
        }

        toCreate.push(validated);
      } catch (err) {
        skipped.push(`Ligne invalide: ${JSON.stringify(row)}`);
      }
    }

    if (toCreate.length === 0 && toUpdate.length === 0) {
      res.status(400).json({ message: "Aucun produit valide à importer ou mettre à jour.", skipped });
      return;
    }

    await prisma.$transaction(async (tx) => {
      if (toCreate.length > 0) {
        await tx.product.createMany({
          data: toCreate.map(product => ({
            id: uuidv4(),
            ...product,
            institutionId: institution.id,
            created_at: new Date(),
            updated_at: new Date(),
            imageName: null,
            idSupplier: null,
            product_category_id: null,
            unit_measurement: null,
            unit_type: null,
            sku: null,
            reorder_quantity: null,
          })) as Prisma.productCreateManyInput[],
        });
      }

      for (const update of toUpdate) {
        await tx.product.update({
          where: { id: update.id },
          data: { 
            quantity: { increment: update.additionalQuantity },
            updated_at: new Date(),
          },
        });
      }
    });

    console.log("Produits sautés :", skipped);

    res.status(201).json({ 
      message: `${toCreate.length} produits créés, ${toUpdate.length} produits mis à jour.`,
      skippedCount: skipped.length 
    });
  } catch (error: any) {
    console.error("Erreur lors de l'import :", error.stack || error.message);
    if (error instanceof z.ZodError) {
      res.status(400).json({ message: "Données invalides dans l'import", issues: error.issues });
    } else {
      res.status(500).json({ message: "Erreur lors de l'import." });
    }
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
  } catch (error: any) {
    console.error("Erreur lors de la récupération du produit :", error.stack || error.message);
    res.status(500).json({ message: "Erreur serveur." });
  }
};