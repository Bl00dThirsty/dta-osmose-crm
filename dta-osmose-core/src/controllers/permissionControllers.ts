import { Request, Response } from "express";
const { PrismaClient } = require("@prisma/client");
import { v4 as uuidv4 } from 'uuid'

const prisma = new PrismaClient();

export const getAllPermission = async (
    req: Request,
    res: Response
  ): Promise<void> => {
    if (req.query.query === "all") {
        const allRole = await prisma.permission.findMany({
          orderBy: [
            {
              id: "asc",
            },
          ],
        });
        res.json(allRole);
      } else {
        //const { skip, limit } = getPagination(req.query);
        try {
          const allRole = await prisma.permission.findMany({
            orderBy: [
              {
                id: "asc",
              },
            ],
            //skip: Number(skip),
            //take: Number(limit),
          });
          res.json(allRole);
        
    } catch (error) {
      res.status(400).json({ message: "Erreur lors de la recherche" });
      console.log("Erreur lors de la recherche");
    }
  }
  };