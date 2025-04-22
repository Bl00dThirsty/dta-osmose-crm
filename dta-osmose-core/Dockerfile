# Ici on va utiliser un moteur d'exécution officiel de node.js en tant que image parent
FROM node:22-alpine

# Initialiser le répertoire de travail dans le conteneurrrr..........
WORKDIR /app

# Copier package.json et package-lock.json dans le conteneur
COPY package*.json .

# Installation des dépendances (le but principal de notre utilisation de docker dans ce projet)...
RUN npm install

# Copie du reste de l'application
COPY . .

# Port surlequel tourne notre app
EXPOSE 5003

# Commande pour démarrer l'appli...
CMD ["node", "./src/server.js"]