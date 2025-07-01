# Utilisation de l'image officielle Node.js Alpine
FROM node:22-alpine

# Création du dossier de travail
WORKDIR /app

# Copie des fichiers de dépendances
COPY package*.json ./

# Installation des dépendances
RUN npm install

# Copie du reste de l'application dans le conteneur
COPY . .

# Compilation TypeScript en JavaScript
RUN npm run build

# Exposition du port de l’application
EXPOSE 5003

# Démarrage de l'application (version compilée dans le dossier `dist`)
CMD ["npm", "start"]
