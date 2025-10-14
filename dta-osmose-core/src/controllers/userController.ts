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
  

  export const updateSingleUser = async (req: Request, res: Response): Promise<void> => {
  try {
    const id = Number(req.params.id);
    if (isNaN(id)) {
      res.status(400).json({ message: "ID utilisateur invalide" });
    }

    const {
      firstName,
      lastName,
      userName,
      password,
      email,
      phone,
      street,
      city,
      zipCode,
      birthday,
      CnpsId,
      gender,
      joinDate,
      employeeId,
      bloodGroup,
      role,
      salary,
      emergencyPhone1,
      emergencyname1,
      emergencylink1,
      designationId,
      departmentId,
    } = req.body;

    // Convertir les champs sensibles
    const parsedJoinDate = joinDate ? new Date(joinDate) : null;
    const parsedBirthday = birthday ? new Date(birthday) : null;
    const parsedSalary = salary ? Number(salary) : null;

    let hashedPassword;
    if (password && password.trim() !== "") {
      hashedPassword = await bcrypt.hash(password, 10);
    }

    const updateUser = await prisma.user.update({
      where: { id },
      data: {
        firstName,
        lastName,
        userName,
        email,
        phone,
        street,
        city,
        zipCode,
        birthday,
        CnpsId,
        gender,
        joinDate: parsedJoinDate,
        employeeId,
        bloodGroup,
        role,
        salary: parsedSalary,
        emergencyPhone1,
        emergencyname1,
        emergencylink1,
        designationId: designationId ? Number(designationId) : null,
        departmentId: departmentId ? Number(departmentId) : null,
        ...(hashedPassword && { password: hashedPassword }), // seulement si password fourni
      },
    });

    const { password: _, ...userWithoutPassword } = updateUser;
    res.status(200).json(userWithoutPassword);
  } catch (error) {
    console.error("Erreur update user:", error);
    res.status(500).json({ message: "Erreur lors de la mise à jour de l'utilisateur" });
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

  