import { Request, Response } from "express";
const { PrismaClient } = require("@prisma/client");
import { v4 as uuidv4 } from 'uuid'

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
    try {
        const { customId, name, phone, nameresponsable, email, ville, website, status, type_customer, role, quarter, region } = req.body;

        const customer = await prisma.customer.create({
            data: {
              id: uuidv4(),
              customId,
              name,
              phone,
              nameresponsable,
              email,
              ville,
              website,
              status,
              type_customer,
              role,
              quarter,
              region
            },
          });
    res.status(201).json(customer);
    } catch(error) {
        res.status(500).json({})
    }
}

export const getSingleCustomer = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const id = parseInt(req.params.id);
    if (isNaN(id)) {
      res.status(400).json({ message: "ID invalide" });
      return;
    }

    const singlecustomer = await prisma.customer.findUnique({
      where: { id },
    });

    if (!singlecustomer) {
      res.status(404).json({ message: "client non trouvé" });
      return;
    }

  } catch (error) {
    console.error("Erreur lors de la récupération du client :", error);
    res.status(500).json({ message: "Erreur serveur" });
  }
};