#!/bin/sh
echo "Attente de la base de données..."
until nc -z postgres 5432; do
  sleep 1
done
echo "Base de données disponible !"

npx prisma migrate deploy

npm start
