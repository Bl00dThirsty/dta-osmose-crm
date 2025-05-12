import { Request, Response } from "express";
//import { PrismaClient } from "@prisma/client";
const { PrismaClient } = require("@prisma/client");
const bcrypt = require("bcrypt");
const saltRounds = 10;
import { v4 as uuidv4 } from 'uuid'

const prisma = new PrismaClient();

export const getAllUser = async (
    req: Request,
    res: Response
  ): Promise<void> => {
    if (req.query.query === "all") {
        try {
          const allUser = await prisma.user.findMany({
            include: {  
              designation: true, 
              department: true,
              
            }
          });
          res.json(
            allUser
              .map((u:any) => {
                const { password, ...userWithoutPassword } = u;
                return userWithoutPassword;
              })
              .sort((a:any, b:any) => a.id - b.id)
          );
        } catch (error) {
          res.status(500).json({ message: "Erreur lors de la recherche du produit" });
        }
      } else if (req.query.status === "false") {
        try {
          const allUser = await prisma.user.findMany({
            where: {
              status: false
            },
            include: {              
              designation: true,  
              department: true,
              
            }
          });
          res.json(
            allUser
              .map((u:any) => {
                const { password, ...userWithoutPassword } = u;
                return userWithoutPassword;
              })
              .sort((a:any, b:any) => a.id - b.id)
          );
        } catch (error) {
          res.status(500).json({ message: "Erreur lors de la recherche du produit" });
        }
      } else {
        try {
          const allUser = await prisma.user.findMany({
            where: {
              status: true
            },
            include: {  
              designation: true,     
              department: true
              
            }
          });
          res.json(
            allUser
    
              .map((u:any) => {
                const { password, ...userWithoutPassword } = u;
                return userWithoutPassword;
              })
              .sort((a:any, b:any) => a.id - b.id)
          );
        } catch (error) {
          res.status(500).json({ message: "Erreur lors de la recherche du produit" });
        }
      }
  };

  export const getSingleUser = async (
    req: Request,
    res: Response
  ): Promise<void> => {
    try {
        const id = parseInt(req.params.id);
        if (isNaN(id)) {
          res.status(400).json({ message: "ID invalide" });
          return;
        }
    
        const singleUser = await prisma.user.findUnique({
          where: { id },
          include: { designation: true,     
            department: true }
        });
    
        if (!singleUser) {
          res.status(404).json({ message: "Utilisateur non trouvé" });
          return;
        }
    
        const { password, ...userWithoutPassword } = singleUser;
        res.json(userWithoutPassword);
      } catch (error) {
        console.error("Erreur lors de la récupération de l'utilisateur :", error);
        res.status(500).json({ message: "Erreur serveur" });
      }
  };

  

  export const updateSingleUser = async (
    req: Request,
    res: Response
  ): Promise<void> => {
    const id = parseInt(req.params.id);
    try {
        const hash = await bcrypt.hash(req.body.password, saltRounds);
        const join_date = new Date(req.body.joinDate); 
        const updateUser = await prisma.user.update({
            where: {
              id: Number(req.params.id)
            },
            data: {
                firstName: req.body.firstName,
                lastName: req.body.lastName,
                userName: req.body.userName,
                password: hash,
                email: req.body.email,
                phone: req.body.phone,
                street: req.body.street,
                city: req.body.city,
                zipCode: req.body.zipCode,
                birthday: req.body.birthday,
                CnpsId: req.body.CnpsId,
                gender: req.body.gender,
                joinDate: join_date,
                employeeId: req.body.employeeId,
                bloodGroup: req.body.bloodGroup,
                role: req.body.role,
                salary: req.body.salary,
                emergencyPhone1: req.body.emergencyPhone1,
                emergencyname1: req.body.emergencyname1,
                emergencylink1: req.body.emergencylink1,
                designationId: req.body.designationId,
                departmentId: req.body.departmentId,
            }
          });

          const { password, ...userWithoutPassword } = updateUser;
           res.status(200).json(userWithoutPassword);  
    } catch (error) {
      res.status(500).json({ message: "Erreur lors de la recherche du produit" });
    }
  };

  // GET /roles/:id/permission
  export const deleteSingleUser = async (
    req: Request,
    res: Response
  ): Promise<void> => {
    try {
        const { id } = req.params; // Récupération de l'ID depuis les paramètres de la requête

        const existingUser = await prisma.user.findUnique({
          where: { id: Number(id) }
        });
        // Vérifier si le user existe
        if (!existingUser) {
          res.status(404).json({ message: "User non trouvé" });
          return;
        }
        await prisma.user.delete({
            where: {
              id: Number(req.params.id)
            },
        });
          // if (!deleteUser) {
          //   res.status(404).json({ message: "User delete to failed" });
          // }
          // await produceUserEvent('delete', deleteUser);
           res.status(200).json({ message: "User deleted successfully" }); 
    } catch (error) {
      res.status(500).json({ message: "User deleted error" });
    }
  };

  