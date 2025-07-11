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
  
      let userType = "user";
  
      // Si pas trouvé, cherche dans les clients
      if (!user) {
        user = await prisma.customer.findUnique({
          where: { email }
        });
        userType = "customer";
      }
  
      // if (!user) {
      //   res.status(400).json({ message: "Email or password is incorrect" });
      //   return;
      // }
  
      // Vérification du mot de passe
      if (user && bcrypt.compareSync(password, user.password)){
      // const isPasswordValid = await bcrypt.compare(password, user.password);
  
      // if (!isPasswordValid) {
      //   res.status(400).json({ message: "Email or password is incorrect" });
      //   return;
      // }
      
      let permissions = [];
      if (user.role) {
        const role = await prisma.role.findUnique({
          where: {
            name: user.role
          },
          include: {
            rolePermission: {
              include: {
                permission: true
              }
            }
          }
        });
        permissions = role.rolePermission.map((rp:any) => rp.permission.name);
      }
  
      // Création du token
      const accessToken = jwt.sign(
        {
          sub: user.id,
          email: user.email,
          permissions,
          role: user.role,
          userType: userType
        },
        secret,
        { expiresIn: "24h" }
      );
  
      // Exclusion du mot de passe dans la réponse
      const { password: _password, ...userWithoutPassword } = user;
  
      res.json({
        ...userWithoutPassword,
        accessToken
      });
    }else{
      res
        .status(400)
        .json({ message: "Email or password is incorrect" });
    }
  
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

  export const refreshToken = async (req: Request, res: Response): Promise<void> => {
    try {
      const token = req.headers.authorization?.split(" ")[1];
  
      if (!token) {
         res.status(401).json({ message: "Token manquant" });
      }
  
      // Vérifie que l'ancien token est encore valide (grâce à `ignoreExpiration: true`)
      const decoded: any = jwt.verify(token, secret, { ignoreExpiration: true });
  
      // Tu peux aussi vérifier dans ta DB si l'utilisateur existe toujours
      let user = await prisma.user.findUnique({ where: { id: decoded.sub } });
  
      let userType = "user";
  
      if (!user) {
        user = await prisma.customer.findUnique({ where: { id: decoded.sub } });
        userType = "customer";
      }
  
      if (!user) {
         res.status(401).json({ message: "Utilisateur introuvable" });
      }
  
      const newToken = jwt.sign(
        {
          sub: user.id,
          email: user.email,
          role: user.role,
          permissions: decoded.permissions || [],
          userType,
        },
        secret,
        { expiresIn: "24h" }
      );
  
      res.json({ accessToken: newToken });
    } catch (err) {
      console.error("Erreur refresh token :", err);
      res.status(401).json({ message: "Token invalide ou expiré" });
    }
  };

  interface JwtPayload {
    sub: number;
    role: string;
    permissions?: string[];
    userType: "user" | "customer";
  }
  
  export const getCurrentUser = async (req: Request, res: Response): Promise<void> => {
    try {
      const auth = req.auth as JwtPayload;
  
      if (!auth?.sub || !auth?.userType) {
        res.status(401).json({ message: "Non autorisé" });
      }
  
      let user;
      if (auth.userType === "user") {
        user = await prisma.user.findUnique({
          where: { id: auth.sub },
          select: {
            id: true,
            email: true,
            role: true,
            userName: true,
            
          }
        });
      } else if (auth.userType === "customer") {
        user = await prisma.customer.findUnique({
          where: { id: auth.sub },
          select: {
            id: true,
            email: true,
            role: true,
            userName: true,
            
          }
        });
      }
  
      if (!user) {
        res.status(404).json({ message: "Utilisateur introuvable" });
      }
  
      res.json({ user: { ...user, userType: auth.userType } });
    } catch (error) {
      console.error("Erreur dans /auth/me:", error);
      res.status(500).json({ message: "Erreur serveur" });
    }
  };



  