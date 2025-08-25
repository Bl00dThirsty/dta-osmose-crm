FROM node:22.18.0-alpine

WORKDIR /app

RUN apk add --no-cache python3 make g++ bash netcat-openbsd

COPY package*.json ./

RUN npm install && npm rebuild bcrypt --build-from-source

COPY . .

RUN npx prisma generate

RUN npm run build

EXPOSE 5003

COPY wait-for-db.sh .
RUN chmod +x wait-for-db.sh

CMD ["sh", "./wait-for-db.sh"]
