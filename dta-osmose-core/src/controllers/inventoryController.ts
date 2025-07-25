import { Request, Response } from "express";
//import { PrismaClient } from "@prisma/client";
const { PrismaClient } = require("@prisma/client");
import { v4 as uuidv4 } from 'uuid'

const prisma = new PrismaClient();

// POST /api/inventory
export const createInventory = async (
    req: Request,
    res: Response
  ): Promise<void> => {
    try {
      const { inventoryItems, performedById, note, titre, location } = req.body;
      if (!Array.isArray(inventoryItems) || inventoryItems.length === 0) {
        res.status(400).json({ message: "Le champ 'items' est requis et doit être un tableau non vide." });
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
  
      const inventory = await prisma.inventory.create({
        data: {
          institutionId: institution.id,
          performedById,
          note,
          titre,
          location,
          inventoryItems: {
            create: await Promise.all(
                inventoryItems.map(async (item: any) => {
                const product = await prisma.product.findUnique({
                  where: { id: item.productId },
                });
  
                const systemQty = product?.quantity || 0;
                const countedQty = item.countedQty;
                const difference =
                  countedQty && countedQty > 0
                    ? Math.abs(countedQty - systemQty)
                    : 0;
  
                return {
                  productId: item.productId,
                  countedQty,
                  systemQty,
                  difference,
                  comment: item.comment || null,
                };
              })
            ),
          },
        },
        include: {
          inventoryItems: {
            include: { product: true }
          }
        }
      });
  
      res.status(201).json(inventory);
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Erreur lors de la création de l'inventaire." });
    }
  };
  

// GET /api/inventory?institutionId=xxx
export const getAllInventories = async (
    req: Request,
    res: Response
  ): Promise<void> => {
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
    const inventories = await prisma.inventory.findMany({
      where: { institutionId: institution.id },
      include: {
        inventoryItems: { include: { product: true } },
        user: true
      },
      orderBy: { createdAt: 'desc' }
    });
  
    res.json(inventories);
  };

  export const getInventoryById = async (req: Request, res: Response): Promise<void> => {
    try {
      const inventory = await prisma.inventory.findUnique({
        where: { id: req.params.id },
        include: {
          inventoryItems: {
            include: {
              product: true
            }
          },
          user: true
        }
      });
  
      if (!inventory) {
        res.status(404).json({ error: 'Invoice not found' });
      }
  
      res.json(inventory);
    } catch (error) {
      res.status(500).json({ error: 'Internal server error' });
    }
  };

  export const updateInventory = async (req: Request, res: Response): Promise<void> => {
    try {
      const { inventoryItems, performedById, note, titre, location } = req.body;
      const inventoryId = req.params.id;
      const institutionSlug = req.params.institution;
  
      if (!Array.isArray(inventoryItems) || inventoryItems.length === 0) {
        res.status(400).json({ message: "Le champ 'items' est requis et doit être un tableau non vide." });
        return;
      }
  
      const institution = await prisma.institution.findUnique({
        where: { slug: institutionSlug },
      });
  
      if (!institution) {
        res.status(404).json({ message: "Institution introuvable." });
        return;
      }
  
      // Supprimer les anciens items liés à l’inventaire
      await prisma.inventoryItem.deleteMany({
        where: { inventoryId: inventoryId },
      });
  
      // Mettre à jour l’inventaire
      const updatedInventory = await prisma.inventory.update({
        where: { id: inventoryId },
        data: {
          performedById,
          note,
          titre,
          location,
          inventoryItems: {
            create: await Promise.all(
              inventoryItems.map(async (item: any) => {
                const product = await prisma.product.findUnique({
                  where: { id: item.productId },
                });
  
                const systemQty = product?.quantity || 0;
                const countedQty = item.countedQty;
                const difference = countedQty && countedQty > 0
                  ? Math.abs(countedQty - systemQty)
                  : 0;
  
                return {
                  productId: item.productId,
                  countedQty,
                  systemQty,
                  difference,
                  comment: item.comment || null,
                };
              })
            ),
          },
        },
        include: {
          inventoryItems: {
            include: { product: true }
          }
        }
      });
  
      res.status(200).json(updatedInventory);
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Erreur lors de la mise à jour de l'inventaire." });
    }
  };
  

  export const deleteInventory = async (
    req: Request,
    res: Response
  ): Promise<void> => {
    try {
      const { id } = req.params;
      const deleteItem = await prisma.inventoryItem.deleteMany({
        where: {
            inventoryId: id,
        },

      });
      if (!deleteItem){
        res.status(404).json({ message: "Items no deleted" });
        return;
      }
        const deletedInventory = await prisma.inventory.delete({
            where: {
              id,
            },
            
          });   
      
          if (!deletedInventory) {
            res.status(404).json({ message: "Inventory delete to failed" });
          }
            res.status(200).json(deletedInventory);
    } catch (error) {
      res.status(500).json({ message: "Erreur lors de la suppression de l'Inventaire" });
    }
  };


  
  