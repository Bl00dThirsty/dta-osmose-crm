import { Request, Response } from "express";
const { PrismaClient } = require("@prisma/client");
const { getPagination } = require("../query");
import { v4 as uuidv4 } from 'uuid'

const prisma = new PrismaClient();

export const createRolePermission = async (
    req: Request,
    res: Response
  ): Promise<void> => {
    try {
        if (req.query.query === "deletemany") {
            const deletedRolePermission = await prisma.rolePermission.deleteMany({
              where: {
                id: {
                  in: req.body,
                },
              },
            });
            res.json(deletedRolePermission);
          } else {
            // convert all incoming data to a specific format.
            const data = req.body.permission_id.map((permission_id:any) => {
              return {
                role_id: req.body.role_id,
                permission_id: permission_id,
              };
            });
            const createdRolePermission = await prisma.rolePermission.createMany({
              data: data,
              skipDuplicates: true,
            });
            res.status(200).json(createdRolePermission);
          }
    } catch (error) {
      res.status(500).json({ message: "Erreur lors de la recherche du produit" });
    }
  };

  export const getAllRolePermission = async (
    req: Request,
    res: Response
  ): Promise<void> => {
    if (req.query.query === "all") {
        const allRolePermission = await prisma.rolePermission.findMany({
          orderBy: [
            {
              id: "asc",
            },
          ],
          include: {
            role: true,
            permission: true,
          },
        });
        res.json(allRolePermission);
      } else {
        const { skip, limit } = getPagination(req.query);
        try {
          const allRolePermission = await prisma.rolePermission.findMany({
            orderBy: [
              {
                id: "asc",
              },
            ],
            
            include: {
              role: true,
              permission: true,
            },
          });
    
          res.json(allRolePermission);
      
        } catch (error) {
          res.status(400).json({ message: "Erreur lors de la recherche des produits" });
        }
      }
  };

  export const getSingleRolePermission = async (
    req: Request,
    res: Response
  ): Promise<void> => {
    try {
        const singleRolePermission = await prisma.rolePermission.findUnique({
            where: {
              id: Number(req.params.id),
            },
          });
          res.json(singleRolePermission);
    } catch (error) {
      res.status(400).json({ message: "Erreur lors de la recherche du produit" });
    }
  };

  export const updateRolePermission = async (
    req: Request,
    res: Response
  ): Promise<void> => {
    try {
        // convert all incoming data to a specific format.
        const data = req.body.permission_id.map((permission_id:any) => {
          return {
            role_id: req.body.role_id,
            permission_id: permission_id,
          };
        });
        const updatedRolePermission = await prisma.rolePermission.createMany({
          data: data,
          skipDuplicates: true,
        });
        res.json(updatedRolePermission);
      
    } catch (error) {
      res.status(400).json({ message: "Erreur lors de la modification" });
      console.log("Erreur lors de la modification");
    }
  };

  export const deleteSingleRolePermission = async (
    req: Request,
    res: Response
  ): Promise<void> => {
    try {
        const deletedRolePermission = await prisma.rolePermission.delete({
            where: {
              id: Number(req.params.id),
            },
          });
        res.status(200).json(deletedRolePermission);
    } catch (error) {
      res.status(500).json({ message: "Erreur lors de la suppression" });
      console.log("Erreur lors de la suppression");
    }
  };