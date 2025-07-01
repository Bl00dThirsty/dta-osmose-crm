import { Request, Response } from "express";
const { PrismaClient } = require("@prisma/client");
import { v4 as uuidv4 } from 'uuid';
const bcrypt = require("bcrypt");
const saltRounds = 10;
const jwt = require("jsonwebtoken");
const prisma = new PrismaClient();

export const getCustomers = async (
    req: Request,
    res: Response
  ): Promise<void> => {
    try {
      const search = req.query.search?.toString();
      const customers = await prisma.customer.findMany({
        where: {
          name: {
            contains: search,
          },
        },
      });
      res.json(customers);
    } catch (error) {
      res.status(500).json({ message: "Erreur lors de la recherche du produit" });
    }
  };

  export const createCustomer = async (req: Request, res: Response): Promise<void> => {
    // 1. Log du payload reçu
    console.log("Received payload:", req.body);
    try {
    // 2. Nettoyage des données
    
    const hash = await bcrypt.hash(req.body.password, saltRounds);
    const payload = {
      ...req.body,
      //id: uuidv4(),
      password: hash, // Force l'utilisation de l'UUID auto-généré
      created_at: undefined,
      updated_at: undefined
    };
        // 3. Création avec gestion explicite des erreurs Prisma
        const customer = await prisma.customer.create({
          data: payload
        });

        const { password: _pw, ...customerWithoutPassword } = customer;
        res.status(201).json(customerWithoutPassword);
      } catch (error: any) {
        console.error("Full error stack:", error);
      
        if (error instanceof prisma.PrismaClientKnownRequestError) {
          if (error.code === 'P2002') {
            res.status(400).json({
              error: "Violation de contrainte unique",
              field: error.meta?.target
            });
            return;
          }
        }
      
        res.status(500).json({
          error: "Erreur serveur",
          details: process.env.NODE_ENV !== 'production' ? error.message : undefined
        });
      }
};

// src/controllers/customerController.ts
export const getSingleCustomer = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { startDate, endDate } = req.query; // Récupérer les dates de la requête
    const customerId = Number(req.params.id);

    // Vérification de l'existence du client
    const singleCustomer = await prisma.customer.findUnique({
      where: { id: customerId },
      include: {
        saleInvoice: {
          where: {
            createdAt: {
              gte: startDate ? new Date(startDate as string) : undefined,
              lte: endDate ? new Date(endDate as string) : undefined,
            },
          },
          orderBy: {
            createdAt: "desc", 
          },
        },
        credits: true
      },
    });

    if (!singleCustomer) {
      res.status(404).json({ message: "Client non trouvé" });
      return;
    }
    console.log("Factures du client :", singleCustomer.saleInvoice);
    res.json(singleCustomer);
  } catch (error) {
    console.error("Erreur lors de la récupération du client :", error);
    res.status(500).json({ message: "Erreur serveur" });
  }
};

export const deleteSingleCustomer = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
      const { id } = req.params; // Récupération de l'ID depuis les paramètres de la requête

      const existingCustomer = await prisma.customer.findUnique({
        where: { id: Number(id) }
      });
      // Vérifier si le user existe
      if (!existingCustomer) {
        res.status(404).json({ message: "Customer non trouvé" });
        return;
      }
      await prisma.customer.delete({
          where: {
            id: Number(req.params.id)
          },
      });
        // if (!deleteUser) {
        //   res.status(404).json({ message: "User delete to failed" });
        // }
        // await produceUserEvent('delete', deleteUser);
         res.status(200).json({ message: "Customer deleted successfully" }); 
  } catch (error) {
    res.status(500).json({ message: "Customer deleted error" });
  }

}
