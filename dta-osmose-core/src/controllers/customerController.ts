import { Request, Response } from "express";
const { PrismaClient } = require("@prisma/client");
import { v4 as uuidv4 } from 'uuid';

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

    // 2. Nettoyage des données
    const payload = {
        ...req.body,
        id: undefined, // Force l'utilisation de l'UUID auto-généré
        created_at: undefined,
        updated_at: undefined
    };

    try {
        // 3. Création avec gestion explicite des erreurs Prisma
        const customer = await prisma.customer.create({
            data: {
                id: uuidv4(), // Génération UUID
                ...payload
            }
        });

        res.status(201).json(customer);
    } catch (error) {
        console.error("Full error stack:", error);
        
        // Gestion spécifique des erreurs Prisma
        if (error instanceof prisma.PrismaClientKnownRequestError) {
            if (error === 'P2002') {
                res.status(400).json({
                    error: "Violation de contrainte unique",
                    field: error
                });
            }
            if (error === 'P2023') {
                res.status(400).json({
                    error: "Format de données invalide",
                    details: error
                });
            }
        }

        res.status(500).json({
            error: "Erreur serveur",
            details: process.env.NODE_ENV !== 'production' ? error : undefined
        });
    }
};

export const getSingleCustomer = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {

    const singlecustomer = await prisma.customer.findUnique({
      where: { id: Number(req.params.id), },
    });

    if (!singlecustomer) {
      res.status(404).json({ message: "client non trouvé" });
      return;
    }
    res.json(singlecustomer);
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