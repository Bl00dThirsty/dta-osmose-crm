import { Request, Response } from "express";
import { PrismaClient } from "@prisma/client";
import { v4 as uuidv4 } from 'uuid'

const prisma = new PrismaClient();

export const getProducts = async (
    req: Request,
    res: Response
  ): Promise<void> => {
    try {
      const search = req.query.search?.toString();
      const products = await prisma.product.findMany({
        where: {
          name: {
            contains: search,
          },
        },
      });
      res.json(products);
    } catch (error) {
      res.status(500).json({ message: "Erreur lors de la recherche du produit" });
    }
  };

export const createProduct = async (req: Request, res: Response): Promise<void> => {
    try {
        const { name, quantity, signature, gtsPrice, sellingPriceHT, sellingPriceTTC, purchase_price, collisage, label, status } = req.body;

        const product = await prisma.product.create({
            data: {
              id: uuidv4(),
              name,
              quantity,
              signature,
              gtsPrice,
              sellingPriceHT,
              sellingPriceTTC,
              purchase_price,
              collisage,
              label,
              status
            },
          });
    res.status(201).json(product);
    } catch(error) {
        res.status(500).json({})
    }
}