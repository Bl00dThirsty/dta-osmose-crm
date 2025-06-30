import { Request, Response } from "express";
//import { PrismaClient } from "@prisma/client";
const { PrismaClient } = require("@prisma/client");
import { v4 as uuidv4 } from 'uuid'

const prisma = new PrismaClient();

export const updateSetting = async (
    req: Request,
    res: Response
  ): Promise<void> => {
    try {
        
      const { id } = req.params;
        const updatedSetting = await prisma.appSetting.update({

          where: { id: Number(id) },
          data: req.body,

        });
        res.status(201).json(updatedSetting);
      } catch (error) {
        res.status(500).json({ message: "Erreur lors de l'update des appsetting" });
      }
  }

  export const getSetting = async (
    req: Request,
    res: Response
  ): Promise<void> => {
    try {

        const institutionSlug = req.params.institution;
        const institution = await prisma.institution.findUnique({
           where: { slug: institutionSlug },
        });
        if (!institution) {
            res.status(404).json({ message: "Institution introuvable." });
            return;
          }
        const newSetting = await prisma.appSetting.findMany({
          where: {
            institutionId: institution.id,
          },
        });
        res.status(201).json(newSetting);
      } catch (error) {
        res.status(500).json({ message: "Erreur lors de l'apercu des appsetting" });
      }
  }