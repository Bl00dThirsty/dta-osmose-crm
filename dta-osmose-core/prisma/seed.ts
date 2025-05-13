import { PrismaClient } from "@prisma/client"
import fs from "fs"
import path from "path"

const prisma = new PrismaClient()

async function deleteAllData() {
  await prisma.product.deleteMany({})
  await prisma.institution.deleteMany({})
  console.log("Toutes les données ont été supprimées.")
}

async function main() {
  await deleteAllData()

  // Création manuelle des institutions
  const iba = await prisma.institution.create({
    data: {
      id: "iba",
      name: "IBA",
    },
  })

  const asermpharma = await prisma.institution.create({
    data: {
      id: "asermpharma",
      name: "Asermpharma",
    },
  })

  console.log("Institutions créées.")

  const dataDirectory = path.join(__dirname, "seedData")
  const productsPath = path.join(dataDirectory, "product.json")

  if (fs.existsSync(productsPath)) {
    const jsonData = JSON.parse(fs.readFileSync(productsPath, "utf-8"))

    for (const data of jsonData) {
      await prisma.product.create({
        data: {
          ...data,
          institution: iba.id, // ou asermpharma.id
        },
      })
    }

    console.log("Produits importés.")
  } else {
    console.error("Fichier product.json introuvable.")
  }
}

main()
  .catch((e) => {
    console.error(e)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
