const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();
import { v4 as uuidv4 } from 'uuid'
import { Request, Response } from "express";
const axios = require("axios");
require("dotenv").config();

const bcrypt = require("bcrypt");
const saltRounds = 10;

const jwt = require("jsonwebtoken");
const secret = process.env.JWT_SECRET;

export const login = async (
    req: Request,
    res: Response
  ): Promise<void> => {
    try {
      const { email, password } = req.body;
  
      // Recherche dans les utilisateurs
      let user = await prisma.user.findUnique({
        where: { email }
      });
  
      //let userType = "user";
  
      // Si pas trouvé, cherche dans les clients
    //   if (!user) {
    //     user = await prisma.customer.findUnique({
    //       where: { email }
    //     });
    //     userType = "customer";
    //   }
  
      if (!user) {
        res.status(400).json({ message: "Email or password is incorrect" });
        return;
      }
  
      // Vérification du mot de passe
      const isPasswordValid = await bcrypt.compare(password, user.password);
  
      if (!isPasswordValid) {
        res.status(400).json({ message: "Email or password is incorrect" });
        return;
      }
  
      // Création du token
      const token = jwt.sign(
        {
          sub: user.id,
          email: user.email,
          //userType
        },
        secret,
        { expiresIn: "24h" }
      );
  
      // Exclusion du mot de passe dans la réponse
      const { password: _password, ...userWithoutPassword } = user;
  
      res.json({
        ...userWithoutPassword,
        token
      });
  
    } catch (error) {
      console.error("Login error:", error);
      res.status(500).json({ message: "Internal server error" });
    }
  };
  
export const register = async (
    req: Request,
    res: Response
  ): Promise<void> => {
    try {
        // Vérifier les champs obligatoires
        if (
          !req.body.userName ||
          !req.body.password ||
          !req.body.email ||
          !req.body.role
        ) {
          res
            .status(400)
            .json({ message: "Les champs obligatoires sont manquants." });
        }
    
        // Convertir les dates et vérifier la validité
        // const join_date = req.body.joinDate
        //   ? new Date(req.body.joinDate).toISOString().split("T")[0]
        //   : null;
    
        const join_date = new Date(req.body.joinDate);
        if (!join_date) {
           res
            .status(400)
            .json({ message: "Les dates ne sont pas valides." });
        }
    
        // Hasher le mot de passe
        const hash = await bcrypt.hash(req.body.password, saltRounds);
    
        // Créer l'utilisateur
        const createUser = await prisma.user.create({
          data: {
            firstName: req.body.firstName,
            lastName: req.body.lastName,
            userName: req.body.userName,
            password: hash,
            email: req.body.email,
            phone: req.body.phone,
            street: req.body.street,
            city: req.body.city,
            state: req.body.state,
            zipCode: req.body.zipCode,
            country: req.body.country,
            Birthday: req.body.Birthday,
            CnpsId: req.body.CnpsId,
            Category: req.body.Category,
            gender: req.body.gender,
            joinDate: join_date,
            employeeId: req.body.employeeId,
            bloodGroup: req.body.bloodGroup,
            image: req.body.image,
            role: req.body.role,
            salary: req.body.salary,
            employmentStatusId: req.body.employmentStatusId,
            departmentId: req.body.departmentId,
            
            designationHistory: {
              create: {
                designationId: req.body.designationId,
                startDate: req.body.designationStartDate ? new Date(req.body.designationStartDate) : null,
                endDate: req.body.designationEndDate ? new Date(req.body.designationEndDate) : null,
                comment: req.body.designationComment
              }
            },
            
          }
        });
        const { password, ...userWithoutPassword } = createUser;
    res.json(userWithoutPassword);
  } catch (error) {
    console.error("Erreur lors de l'enregistrement :", error); // Ajoutez un log d'erreur
    res.status(500).json({
      message: "Erreur interne du serveur.",
      // Retourner un message d'erreur plus précis
    });
  }
    
    
  };

  export const logout = async (req: Request, res: Response): Promise<void> => {
    try {
      // Supprimer le cookie s’il y en a un (si tu avais fait `res.cookie("token", ...)` dans login)
      res.clearCookie("token", {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production", // en HTTPS seulement en prod
        sameSite: "lax",
      });
  
      res.status(200).json({ message: "Déconnexion réussie." });
    } catch (error) {
      console.error("Erreur de déconnexion :", error);
      res.status(500).json({ message: "Erreur lors de la déconnexion." });
    }
  };