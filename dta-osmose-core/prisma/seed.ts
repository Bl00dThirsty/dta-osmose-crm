import { PrismaClient } from "@prisma/client";
import fs from "fs";
import path from "path";

const prisma = new PrismaClient();

// Supprime les données existantes des modèles dans l'ordre inverse de dépendance
async function supprimerToutesLesDonnees(nomsDeFichiers: string[]) {
  const nomsDeModeles = nomsDeFichiers.map((nomFichier) => {
    const nomModele = path.basename(nomFichier, path.extname(nomFichier));
    return nomModele.charAt(0) + nomModele.slice(1); // minuscule -> majuscule
  });

  for (const nomModele of nomsDeModeles) {
    const modele: any = prisma[nomModele as keyof typeof prisma];
    if (modele) {
      await modele.deleteMany({});
      console.log(`Données supprimées du modèle : ${nomModele}`);
    } else {
      console.error(`Modèle ${nomModele} introuvable. Vérifiez le nom du fichier.`);
    }
  }
}

async function main() {
  const dossierDeDonnees = path.join(__dirname, "seedData");

  // L'ordre est important : d'abord institution, puis product
  const nomsDeFichiers = [
    "institution.json",
    "product.json",
  ];

  await supprimerToutesLesDonnees([...nomsDeFichiers].reverse()); // suppression dans l'ordre inverse

  for (const nomFichier of nomsDeFichiers) {
    const cheminFichier = path.join(dossierDeDonnees, nomFichier);
    const donneesJson = JSON.parse(fs.readFileSync(cheminFichier, "utf-8"));
    const nomModele = path.basename(nomFichier, path.extname(nomFichier));
    const modele: any = prisma[nomModele as keyof typeof prisma];

    if (!modele) {
      console.error(`Aucun modèle Prisma trouvé pour le fichier : ${nomFichier}`);
      continue;
    }

    for (const donnees of donneesJson) {
      await modele.create({
        data: donnees,
      });
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
