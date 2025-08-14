# Utilisation de l'image Alpine explicite pour avoir apk
FROM node:22.18.0-alpine

WORKDIR /app

# Installer les outils de build nécessaires pour compiler bcrypt
RUN apk add --no-cache python3 make g++

COPY package*.json ./

# Installer les dépendances et recompiler bcrypt pour l'arch du container
RUN npm install && npm rebuild bcrypt --build-from-source

COPY . .

RUN npx prisma generate

RUN npm run build

EXPOSE 5003

CMD ["sh", "-c", "npx prisma migrate deploy && npm run seed && npm start"]