"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const client_1 = require("@prisma/client");
const fs_1 = __importDefault(require("fs"));
const path_1 = __importDefault(require("path"));
const prisma = new client_1.PrismaClient();
// Fonction pour supprimer les données existantes des modèles spécifiés
function supprimerToutesLesDonnees(nomsDeFichiers) {
    return __awaiter(this, void 0, void 0, function* () {
        const nomsDeModeles = nomsDeFichiers.map((nomFichier) => {
            const nomModele = path_1.default.basename(nomFichier, path_1.default.extname(nomFichier));
            return nomModele.charAt(0).toUpperCase() + nomModele.slice(1);
        });
        for (const nomModele of nomsDeModeles) {
            const modele = prisma[nomModele];
            if (modele) {
                yield modele.deleteMany({});
                console.log(`Données supprimées du modèle : ${nomModele}`);
            }
            else {
                console.error(`Modèle ${nomModele} introuvable. Vérifiez que le nom du fichier correspond bien au nom du modèle Prisma.`);
            }
        }
    });
}
function main() {
    return __awaiter(this, void 0, void 0, function* () {
        const dossierDeDonnees = path_1.default.join(__dirname, "seedData");
        const nomsDeFichiers = [
            "product.json",
            "institution.json",
        ];
        // Supprimer d'abord les anciennes données
        yield supprimerToutesLesDonnees(nomsDeFichiers);
        // Insérer les nouvelles données
        for (const nomFichier of nomsDeFichiers) {
            const cheminFichier = path_1.default.join(dossierDeDonnees, nomFichier);
            const donneesJson = JSON.parse(fs_1.default.readFileSync(cheminFichier, "utf-8"));
            const nomModele = path_1.default.basename(nomFichier, path_1.default.extname(nomFichier));
            const modele = prisma[nomModele];
            if (!modele) {
                console.error(`Aucun modèle Prisma correspondant au fichier : ${nomFichier}`);
                continue;
            }
            for (const donnees of donneesJson) {
                yield modele.create({
                    data: donnees,
                });
            }
            console.log(`Modèle ${nomModele} alimenté avec les données du fichier : ${nomFichier}`);
        }
    });
}
main()
    .catch((erreur) => {
    console.error("Erreur lors du seed :", erreur);
})
    .finally(() => __awaiter(void 0, void 0, void 0, function* () {
    yield prisma.$disconnect();
}));
