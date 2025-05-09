import { Request, Response } from "express";
//import { PrismaClient } from "@prisma/client";
const { PrismaClient } = require("@prisma/client");
import { v4 as uuidv4 } from 'uuid'

const prisma = new PrismaClient();

export const createSingleDepartment = async (
    req: Request,
    res: Response
  ): Promise<void> => {
    try {
        const createdDepartment = await prisma.department.create({
            data: {
              name: req.body.name,
            },
        });
        res.status(201).json(createdDepartment);
    } catch (error) {
      res.status(500).json({ message: "Erreur lors de l'ajout du department" });
    }
  };

//   export const getSingleDepartment = async (
//     req: Request,
//     res: Response
//   ): Promise<void> => {
    
//   };

  export const getAllDepartment = async (
    req: Request,
    res: Response
  ): Promise<void> => {
    if (req.query.query === "all") {
        const allDepartment = await prisma.department.findMany({
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
        res.status(200).json(allDepartment);
      } else {
        // const { skip, limit } = getPagination(req.query);
        try {
          const allDepartment = await prisma.department.findMany({
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
           res.status(200).json(allDepartment);
        } catch (error) {
           res.status(400).json({});
        }
      }
  };

  export const deleteDepartment = async (
    req: Request,
    res: Response
  ): Promise<void> => {
    try {
        const deletedDepartment = await prisma.department.delete({
            where: {
              id: Number(req.params.id),
            },
          });
        res.status(200).json({message: "User deleted successfully", deletedDepartment});
    } catch (error) {
      res.status(500).json({ message: "Erreur lors de la recherche du produit" });
    }
  };
