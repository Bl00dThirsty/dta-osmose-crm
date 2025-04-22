import { Request, Response } from "express";
import { PrismaClient } from "@prisma/client";
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
        const { name, phone, address, nameresponsable, email, website, status, type_customer } = req.body;

        const customer = await prisma.customer.create({
            data: {
              id: uuidv4(),
              name,
              phone,
              address,
              nameresponsable,
              email,
              website,
              status,
              type_customer,
            },
          });
    res.status(201).json(customer);
    } catch(error) {
        res.status(500).json({})
    }
}