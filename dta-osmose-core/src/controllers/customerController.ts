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
      res.status(500).json({ message: "Erreur lors de la recherche de l'utilisateur" });
    }
  };

  export const createCustomer = async (req: Request, res: Response): Promise<void> => {
    try {
      const { name, phone, ville, region, nameresponsable, email, website, status, type_customer } = req.body;
  
      const now = new Date();
      const month = now.getMonth() + 1;
      const year = now.getFullYear();
  
      const newCustomer = await prisma.$transaction(async (tx) => {

        let counter = await tx.customerCounter.findUnique({
          where: {
            month_year: {
              month,
              year,
            },
          },
        });
  
        if (!counter) {
          counter = await tx.customerCounter.create({
            data: {
              month,
              year,
              count: 1,
            },
          });
        } else {
          counter = await tx.customerCounter.update({
            where: {
              month_year: {
                month,
                year,
              },
            },
            data: {
              count: {
                increment: 1,
              },
            },
          });
        }
  
        const counterStr = String(counter.count).padStart(3, '0');
        const monthStr = String(month).padStart(2, '0');
        const customId = `CLIENT-${counterStr}${monthStr}${year}`;
  
        const customer = await tx.customer.create({
          data: {
            id: uuidv4(),
            customId,
            name,
            phone,
            ville,
            region,
            nameresponsable,
            email,
            website,
            status,
            type_customer,
          },
        });
  
        return customer;
      });
  
      res.status(201).json(newCustomer);
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Erreur lors de la création du client' });
    }
  };
  