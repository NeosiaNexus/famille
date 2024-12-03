# Étape 1 : Utilisation d'une image Node.js pour builder
FROM node:20-alpine AS builder

# Définit le répertoire de travail
WORKDIR /app

# Copie les fichiers package.json et package-lock.json uniquement
COPY package*.json ./

# Installer uniquement les dépendances nécessaires à la construction
RUN npm ci

# Copie les fichiers nécessaires pour Prisma et l'application
COPY prisma ./prisma
COPY .env ./

# Génère le client Prisma
RUN npx prisma generate

# Copie tout le code source
COPY . .

# Build l'application
RUN npm run build

# Étape 2 : Préparer l'image finale pour la production
FROM node:20-slim

# Définit le répertoire de travail
WORKDIR /app

# Copier uniquement les fichiers nécessaires depuis l'étape builder
COPY --from=builder /app/package*.json ./
COPY --from=builder /app/.next ./.next
COPY --from=builder /app/public ./public
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/prisma ./prisma
COPY --from=builder /app/.env ./.env

# Installer uniquement les dépendances nécessaires en production
RUN npm ci --omit=dev

# Supprimer les fichiers inutiles pour réduire la taille de l'image
RUN rm -rf /tmp && \
    rm -rf /usr/share/doc && \
    rm -rf /usr/share/man

# Déclare le port exposé
EXPOSE 3000

# Commande pour démarrer l'application
CMD ["npm", "run", "start:with-migrations"]
