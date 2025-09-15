const { PrismaClient } = require("@prisma/client");
import fs from "fs";
import path from "path";
const bcrypt = require("bcrypt");
import dotenv from "dotenv";

require("dotenv").config();

const prisma = new PrismaClient();
const saltRounds = 10;

/*++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
  @Author:    John MANGA | Digit-Tech-Innov solutions and services
  @Creation:  23.08.2025
  ----------------------------------------------------------------
  @Function Description: Deletes all data from specified Prisma models in 
  right order to respect foreign key constraints.
  ----------------------------------------------------------------
  @parameter: orderedFileNames: string[] 
  - Array of JSON file names corresponding to Prisma models
  ----------------------------------------------------------------
  @Returnvalue: Promise<void> 
  - Resolves when all data deletion operations are complete, 
  or throws an error if a model is not found or a database operation fails.
  +++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++*/


async function deleteAllData() {
  const modelNames = [
    'product',
    'customer',
    'appSetting',
    'department',
    'designation',
    'institution'
  ];
  for (const modelName of modelNames) {
    await prisma[modelName].deleteMany();
    console.log(`Deleted all records from ${modelName}`);
  }
}

async function main() {
  console.log('Starting seeding...');
  await deleteAllData();

  const orderedFileNames = [
    'institution.json',
    'department.json',
    'designation.json',
    'appSetting.json',
    'customer.json',
    'product.json',
  ];

  for (const fileName of orderedFileNames) {
    const filePath = path.join(__dirname, 'seedData', fileName);
    if (fs.existsSync(filePath)) {
      const data = JSON.parse(fs.readFileSync(filePath, 'utf-8'));
      const modelName = fileName.replace('.json', '');
      for (const record of data) {
        await prisma[modelName].create({ data: record });
      }
      console.log(`Seeded ${modelName}`);
    }
  }
  await createPermissions();
  await createRoles();
  await assignRolePermissions();
  await createUsers();
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });


const permissions = [
  "create-product",
  "view-product",
  "create-user",
  "create-department",
  "readAll-department",
  "delete-department",
  "update-sale",
  "create-sale"
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
<<<<<<< HEAD
}
=======
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
     "appSetting.json",
     "product.json", // on gère ce fichier à part
     "department.json",
     "designation.json",
  ];

  // Suppression des anciennes données
  await deleteAllData(orderedFileNames);


  for (const fileName of orderedFileNames) {
    const filePath = path.join(dataDirectory, fileName);
    const jsonData = JSON.parse(fs.readFileSync(filePath, "utf-8"));
    const modelName = path.basename(fileName, path.extname(fileName));
    const model: any = prisma[modelName as keyof typeof prisma];

    if (!model) {
      console.error(`No Prisma model matches the file name: ${fileName}`);
      continue;
    }

    for (const data of jsonData) {
      await model.create({ data });
    }

    console.log(`Seeded ${modelName} with data from ${fileName}`);
  }
}

main()
  .catch((e) => {
    console.error(e);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
>>>>>>> origin/CRM-IBA-ASP-15
