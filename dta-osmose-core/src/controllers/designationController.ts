import { Request, Response } from "express";
//import { PrismaClient } from "@prisma/client";
const { PrismaClient } = require("@prisma/client");
import { v4 as uuidv4 } from 'uuid'

const prisma = new PrismaClient();

export const createDesignation = async (
    req: Request,
    res: Response
  ): Promise<void> => {
    try {
        const createdDesignation = await prisma.designation.create({
            data: {
              name: req.body.name,
            },
          });
    
          if (!createdDesignation) {
            res.status(404).json({ message: "Designation not created" });
          }
          res.status(201).json(createdDesignation);
    } catch (error) {
      res.status(500).json({ message: "Erreur lors de la recherche du produit" });
    }
  };

  export const getAllDesignation  = async (
    req: Request,
    res: Response
  ): Promise<void> => {
    if (req.query.query === "all") {
        const allDesignation = await prisma.designation.findMany({
          include: {
            user: {
              select: {
                id: true,
                firstName: true,
                lastName: true,
                userName: true,
                role: true,
              },
            },
          },
          orderBy: [
            {
              id: "asc",
            },
          ],
        });
        res.status(200).json(allDesignation);
      } else {
        // const { skip, limit } = getPagination(req.query);
        try {
          const allDesignation = await prisma.designation.findMany({
            orderBy: [
              {
                id: "asc",
              },
            ],
            // skip: Number(skip),
            // take: Number(limit),
            include: {
              user: {
                select: {
                  id: true,
                  firstName: true,
                  lastName: true,
                  userName: true,
                  role: true,  
                },
              },
            },
          });
           res.status(200).json(allDesignation);
        } catch (error) {
           res.status(400).json({});
        }
      }
  };

  export const deleteDesignation = async (
    req: Request,
    res: Response
  ): Promise<void> => {
    try {
        const deletedDesignation = await prisma.designation.delete({
            where: {
              id: parseInt(req.params.id),
            },
            
          });   
      
          if (!deletedDesignation) {
            res.status(404).json({ message: "Designation delete to failed" });
          }
            res.status(200).json(deletedDesignation);
    } catch (error) {
      res.status(500).json({ message: "Erreur lors de la recherche du produit" });
    }
  };
