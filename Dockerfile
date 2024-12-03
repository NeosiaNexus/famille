# Étape 1 : Utilisation d'une image Node.js pour builder
FROM node:20 AS builder

# Définit le répertoire de travail
WORKDIR /app

# Copie les fichiers package.json et package-lock.json
COPY package*.json ./

# Installer les dépendances nécessaires
RUN npm install

# **Copie le dossier prisma et le fichier .env**
COPY prisma ./prisma
COPY .env ./

# Génère le client Prisma
RUN npx prisma generate

# Copie tout le reste du projet
COPY . .

# Build l'application
RUN npm run build

# Étape 2 : Préparer l'image finale
FROM node:20

# Définit le répertoire de travail
WORKDIR /app

# Copier les fichiers nécessaires depuis l'étape builder
COPY --from=builder /app/package*.json ./
COPY --from=builder /app/.next ./.next
COPY --from=builder /app/public ./public
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/prisma ./prisma
COPY --from=builder /app/.env ./.env

# Déclare le port exposé
EXPOSE 3000

# Commande pour démarrer l'application
CMD ["npm", "run", "start:with-migrations"]