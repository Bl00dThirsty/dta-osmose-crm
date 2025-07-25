import { Request, Response } from "express";
const { PrismaClient } = require("@prisma/client");
import { v4 as uuidv4 } from 'uuid'

const prisma = new PrismaClient();

export const createRole = async (
    req: Request,
    res: Response
  ): Promise<void> => {
    try {
        if (req.query.query === "deletemany") {
            const deletedRole = await prisma.role.deleteMany({
              where: {
                id: {
                  in: req.body
                }
              }
            });
            res.json(deletedRole);
          } else if (req.query.query === "createmany") {
            console.log(
              req.body.map((role:any) => {
                return {
                  name: role.name
                };
              })
            );
            console.log(req.body);
            const createdRole = await prisma.role.createMany({
              data: req.body,
              skipDuplicates: true
            });
            res.status(200).json(createdRole);
          } else {
            const createdRole = await prisma.role.create({
              data: {
                name: req.body.name
              }
            });
            res.status(200).json(createdRole);
        }
      
    } catch (error) {
      res.status(500).json({ message: "Erreur lors de l'ajout du role" });
    }
};

  export const  getAllRole = async (
    req: Request,
    res: Response
  ): Promise<void> => {
    if (req.query.query === "all") {
        const allRole = await prisma.role.findMany({
          orderBy: [
            {
              id: "asc"
            }
          ],
          include: {
            rolePermission: {
              include: {
                permission: true
              }
            }
          }
        });
        res.json(allRole);
    } else if (req.query.status === "false") {
    try {
        //const { skip, limit } = getPagination(req.query);
        const allRole = await prisma.role.findMany({
          where: {
            status: false
          },
          orderBy: [
            {
              id: "asc"
            }
          ],
          //skip: Number(skip),
          //take: Number(limit),
          include: {
            rolePermission: {
              include: {
                permission: true
              }
            }
          }
        });
        res.json(allRole);
      } catch (error) {
        res.status(400).json({});
        console.log("Error");
      }
    } else {
      //const { skip, limit } = getPagination(req.query);
      try {
        const allRole = await prisma.role.findMany({
          orderBy: [
            {
              id: "asc"
            }
          ],
          where: {
            status: true
          },
          //skip: Number(skip),
          //take: Number(limit),
          include: {
            rolePermission: {
              include: {
                permission: true
              }
            }
          }
        });
        res.json(allRole);
      
    } catch (error) {
      res.status(400).json({ message: "Erreur lors de l'affichage du role" });
    }
   }
  };

  export const  getSingleRole = async (
    req: Request,
    res: Response
  ): Promise<void> => {
    try {
        const singleRole = await prisma.role.findUnique({
            where: {
              id: Number(req.params.id)
            },
            include: {
              rolePermission: {
                include: {
                  permission: true
                }
              }
            }
          });
          res.json(singleRole);  
      
    } catch (error) {
      res.status(400).json({ message: "Erreur lors de la recherche du role" });
    }
  };
  
  export const getPermissionsByRoleId = async (
    req: Request,
    res: Response
  ): Promise<void> => {
    const roleId = parseInt(req.params.id, 10);
    const skip = req.query.skip ? Number(req.query.skip) : 0;
    const limit = req.query.limit ? Number(req.query.limit) : 10;
    try {
      const permissions = await prisma.rolePermission.findMany({
        where: {
          role_id: roleId,
        },
        include: {
          permission: true,
        },
      });
  
      res.json(permissions.map((rp:any) => ({
        id: rp.id,
        permissionId: rp.permission_id,
        name: rp.permission.name,
        status: rp.status,
        createdAt: rp.createdAt,
      })));
    } catch (error) {
      console.error("Erreur lors de la récupération des permissions :", error);
      res.status(500).json({ message: "Erreur serveur" });
    }
  };

  // DELETE /roles/:roleId/permissions/:permissionId
export const deleteRolePermission = async (
  req: Request,
  res: Response
): Promise<void> => {
  const { roleId, permissionId } = req.params;

  try {
    await prisma.rolePermission.delete({
      where: {
        role_id_permission_id: {
          role_id: parseInt(roleId),
          permission_id: parseInt(permissionId),
        },
      },
    });

    res.json({ message: "Permission supprimée du rôle avec succès" });
  } catch (error) {
    console.error("Erreur lors de la suppression :", error);
    res.status(500).json({ message: "Erreur serveur" });
  }
};


  export const  deleteSingleRole = async (
    req: Request,
    res: Response
  ): Promise<void> => {
    try {
      const { id } = req.params;
        const deletedRole = await prisma.role.delete({
            where: {
              id: Number(id)
            },
            
        });
          // Récupérer les anciennes valeurs du role
          const existingRole = await prisma.role.findUnique({
            where: { id: Number(id) }
          });
      
          // Vérifier si le role existe
          if (!existingRole) {
            res.status(404).json({ message: "role non trouvé" });
          } 
        res.status(200).json(deletedRole); 
    } catch (error) {
      res.status(400).json({ message: "Erreur lors de la suppression" });
    }
  };