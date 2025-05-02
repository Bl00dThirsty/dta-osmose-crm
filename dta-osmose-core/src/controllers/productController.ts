import { Request, Response } from "express";
import { PrismaClient } from "@prisma/client";
import { v4 as uuidv4 } from 'uuid'

const prisma = new PrismaClient();

export const getProducts = async (req: Request, res: Response): Promise<void> => {
  try {
    const search = req.query.search?.toString();
    const institution = req.query.institution?.toString();

    if (!institution) {
      res.status(400).json({ message: "Institution manquante." });
      return;
    }

    const products = await prisma.product.findMany({
      where: {
        institution, 
        ...(search && {
          name: {
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
      const {
        quantity,
        EANCode,
        brand,
        designation,
        restockingThreshold,
        warehouse,
        sellingPriceTTC,
        purchase_price,
        institution,
      } = req.body;
  
      if (!institution) {
        res.status(400).json({ message: "Institution manquante." });
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
          institution,
        },
      });
  
      res.status(201).json(product);
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Erreur lors de la création du produit." });
    }
  };
  