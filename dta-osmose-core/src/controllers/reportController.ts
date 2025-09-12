import { Request, Response } from "express";
const { PrismaClient } = require("@prisma/client");
import { v4 as uuidv4 } from 'uuid';

const prisma = new PrismaClient();

export const createReport = async (req: Request, res: Response) => {
  try {
    const { prospectName, degree, rdvObject, nextRdv, time, contact, pharmacoVigilance, address, email, responsable  } = req.body;
    const institutionSlug = req.params.institution;

    if (!institutionSlug) {
      res.status(400).json({ message: "Institution manquante." });
      return;
    }

    const institution = await prisma.institution.findUnique({
      where: { slug: institutionSlug },
    });

    if (!institution) {
      res.status(404).json({ message: "Institution introuvable." });
      return;
    }
    const userAuth = req.auth as { sub?: number };
    if (!userAuth?.sub) {
      res.status(401).json({ error: "Utilisateur non authentifié" });
      return;
    }
    const join_date = new Date(req.body.date);
        if (!join_date) {
           res
            .status(400)
            .json({ message: "Les dates ne sont pas valides." });
        }

    const report = await prisma.Reporting.create({
      data: {
        prospectName,
        date: join_date,
        userId: userAuth.sub,
        degree,
        rdvObject,
        nextRdv: new Date(nextRdv),
        contact,
        time,
        pharmacoVigilance,
        address,
        email,
        responsable,
        institutionId: institution.id
      },
      include: { user: true },
    });

    res.status(201).json(report);
  } catch (error) {
    console.error("Erreur création report:", error);
    res.status(500).json({ error: "Erreur serveur" });
  }
};

export const getReportByStaff = async (req: Request, res: Response): Promise<void> => {
  try {
    const { startDate, endDate } = req.query;
    const creatorType = req.auth.userType; // Type de créateur ("user" ou "customer")
      
    const creatorId = req.auth.sub;  
      
      if (creatorType !== "user") {
        res.status(403).json({ message: "Seuls les users peuvent accéder à leurs notifications." });
      }
      console.log("creator:", creatorId)
      if (!creatorId) {
         res.status(400).json({ message: "Identifiant de l'user manquant." });
      }
    
    const invoices = await prisma.Reporting.findMany({
      where: { 
        userId: creatorId,
        createdAt: {
          gte: startDate ? new Date(startDate as string) : undefined,
          lte: endDate ? new Date(endDate as string) : undefined,
        },
        },
      include: {
        user: true,        
      },
      orderBy: { createdAt: 'desc' }
    });
    res.json(invoices);
  } catch (error) {
    res.status(500).json({ error: 'Internal server error' });
  }
};

export const getSingleReport = async (req: Request, res: Response): Promise<void> => {
  try {
    const id  = Number(req.params.id);

    if (!id) {
      res.status(400).json({ message: "ID du Report manquant." });
      return;
    }

    const promotion = await prisma.Reporting.findUnique({
      where: { id },
      include: {
         // pour avoir les infos produit directement
        user: true 
      }
    });

    if (!promotion) {
      res.status(404).json({ message: "Report non trouvé." });
      return;
    }

    res.status(200).json(promotion);
  } catch (error: any) {
    console.error("Erreur lors de la récupération du produit :", error.stack || error.message);
    res.status(500).json({ message: "Erreur serveur." });
  }

};

export const getReport = async (req: Request, res: Response): Promise<void> => {
  try {
    const { startDate, endDate } = req.query;
    const institutionSlug = req.params.institution;

    if (!institutionSlug) {
      res.status(400).json({ message: "Institution manquante." });
      return;
    }

    const institution = await prisma.institution.findUnique({
        where: { slug: institutionSlug },
    });

    if (!institution) {
        res.status(404).json({ message: "Institution introuvable." });
        return;
      }
    const reports = await prisma.Reporting.findMany({
      where: { 
        createdAt: {
          gte: startDate ? new Date(startDate as string) : undefined,
          lte: endDate ? new Date(endDate as string) : undefined,
        },
        institutionId: institution.id, },
      include: {
        user: true,
      },
      orderBy: { createdAt: 'desc' }
    });
    res.json(reports);
  } catch (error) {
    res.status(500).json({ error: 'Internal server error' });
  }
};

export const deleteReport = async (
    req: Request,
    res: Response
  ): Promise<void> => {
    try {
        const id = Number(req.params.id); 
        const deletedReporting = await prisma.Reporting.delete({
            where: {
              id,
            },
          });
        res.status(200).json({message: "Promotion deleted successfully", deletedReporting});
    } catch (error) {
      res.status(500).json({ message: "Erreur lors de la recherche du Promotion" });
    }
  };




