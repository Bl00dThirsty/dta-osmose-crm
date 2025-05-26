const { PrismaClient } = require("@prisma/client");
import fs from "fs";
import path from "path";
const bcrypt = require("bcrypt");
import dotenv from "dotenv";

require("dotenv").config();

const prisma = new PrismaClient();
const saltRounds = 10;


// Supprime les données existantes des modèles dans l'ordre inverse de dépendance
async function supprimerToutesLesDonnees(nomsDeFichiers: string[]) {
  const nomsDeModeles = nomsDeFichiers.map((nomFichier) => {
    const nomModele = path.basename(nomFichier, path.extname(nomFichier));
    return nomModele.charAt(0) + nomModele.slice(1); // minuscule -> majuscule
  });
  // await prisma.institution.deleteMany({})
  for (const modelName of modelNames) {
    const model: any = prisma[modelName as keyof typeof prisma];
    if (model) {
      await model.deleteMany({});
      console.log(`Cleared data from ${modelName}`);
    } else {
      console.error(`Modèle ${nomModele} introuvable. Vérifiez le nom du fichier.`);
    }
  }
}


const permissions = [
  "create-product",
  "view-product",
  "create-user",
  "create-department",
  "readAll-department",
  "delete-department",
];

const roles = ["admin", "staff", "manager", "Particulier"];

const adminPermissions = [...permissions];
const staffPermissions = [...permissions];
const managerPermissions = [
  "view-product",
];
const particularPermissions = [...managerPermissions];

const rolePermissionsMap: Record<string, string[]> = {
  admin: adminPermissions,
  staff: staffPermissions,
  manager: managerPermissions,
  Particulier: particularPermissions
};

async function createPermissions() {
  for (const name of permissions
    .concat(managerPermissions)
    .concat(particularPermissions)) {
    const exists = await prisma.permission.findUnique({ where: { name } });
    if (!exists) {
      await prisma.permission.create({ data: { name } });
    }
  }
}

async function createRoles() {
  for (const roleName of roles) {
    const exists = await prisma.role.findUnique({ where: { name: roleName } });
    if (!exists) {
      await prisma.role.create({ data: { name: roleName } });
    }
  }
}

async function assignRolePermissions() {
  for (const [roleName, perms] of Object.entries(rolePermissionsMap)) {
    const role = await prisma.role.findUnique({ where: { name: roleName } });
    if (!role) continue;

    for (const permName of perms) {
      const permission = await prisma.permission.findUnique({ where: { name: permName } });
      if (!permission) continue;

      const exists = await prisma.rolePermission.findUnique({
        where: {
          role_id_permission_id: {
            role_id: role.id,
            permission_id: permission.id
          }
        }
      });

      if (!exists) {
        await prisma.rolePermission.create({
          data: {
            role_id: role.id,
            permission_id: permission.id
          }
        });
      }
    }
  }
}

async function createUsers() {
  const users = [
    {
      userName: "admin",
      firstName: "admin",
      lastName: "admin",
      email: "admin@gmail.com",
      password: await bcrypt.hash("admin", saltRounds),
      role: "admin",
    },
    {
      userName: "staff",
      firstName: "staff",
      lastName: "staff",
      email: "staff@gmail.com",
      password: await bcrypt.hash("staff", saltRounds),
      role: "staff",
    },
    {
      userName: "manager",
      firstName: "manager",
      lastName: "manager",
      email: "manager@gmail.com",
      password: await bcrypt.hash("manager", saltRounds),
      role: "manager",
    }
  ];

  for (const user of users) {
    const exists = await prisma.user.findUnique({ where: { email: user.email } });
    if (!exists) {
      // Vérifie si le rôle existe
      const roleExists = await prisma.role.findUnique({ where: { name: user.role } });
      if (!roleExists) {
        console.warn(`Role "${user.role}" not found, skipping user "${user.email}"`);
        continue;
      }

      await prisma.user.create({ data: user });
      console.log(`User ${user.email} created with role ${user.role}`);
    }
  }
}

async function main() {
  await createPermissions();
  await createRoles();
  await assignRolePermissions();
  await createUsers();

  const dataDirectory = path.join(__dirname, "seedData");

  // Ces fichiers seront traités séparément plus bas
  const orderedFileNames = [
    "customer.json",
    "institution.json",
    "product.json", // on gère ce fichier à part
    "department.json",
    "designation.json",
  ];

  // Suppression des anciennes données
  await deleteAllData(orderedFileNames);

  // // --- Création manuelle des institutions ---
  // const iba = await prisma.institution.create({
  //   data: {
  //     id: "iba",
  //     name: "IBA",
  //   },
  // });

  // const asermpharma = await prisma.institution.create({
  //   data: {
  //     id: "asermpharma",
  //     name: "Asermpharma",
  //   },
  // });

  // console.log("Institutions créées.");

  // // --- Traitement spécial pour les produits ---
  // const productsPath = path.join(dataDirectory, "product.json");

  // if (fs.existsSync(productsPath)) {
  //   const jsonData = JSON.parse(fs.readFileSync(productsPath, "utf-8"));

  //   for (const data of jsonData) {
  //     const { institution, ...productData } = data;

  //     let institutionId;

  //     if (institution === "iba") {
  //       institutionId = iba.id;
  //     } else if (institution === "asermpharma") {
  //       institutionId = asermpharma.id;
  //     } else {
  //       console.warn(`Institution inconnue pour le produit "${data.designation}"`);
  //       continue;
  //     }

  //     await prisma.product.create({
  //       data: {
  //         ...productData,
  //         institution: {
  //           connect: { id: institutionId },
  //         },
  //       },
  //     });
  //   }

  //   console.log("Produits importés.");
  // } else {
  //   console.error("Fichier product.json introuvable.");
  // }

  // // --- Importation générique des autres fichiers ---
  // const remainingFiles = orderedFileNames.filter(f => f !== "product.json");

  for (const fileName of orderedFileNames) {
    const filePath = path.join(dataDirectory, fileName);
    const jsonData = JSON.parse(fs.readFileSync(filePath, "utf-8"));
    const modelName = path.basename(fileName, path.extname(fileName));
    const model: any = prisma[modelName as keyof typeof prisma];

    if (!modele) {
      console.error(`Aucun modèle Prisma trouvé pour le fichier : ${nomFichier}`);
      continue;
    }

<<<<<<< HEAD
    for (const donnees of donneesJson) {
      await modele.create({
        data: donnees,
      });
=======
    for (const data of jsonData) {
      await model.create({ data });
>>>>>>> origin/yvana
    }

    console.log(`Modèle ${nomModele} alimenté avec les données du fichier : ${nomFichier}`);
  }
}

main()
  .catch((erreur) => {
    console.error("Erreur lors du seed :", erreur);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
