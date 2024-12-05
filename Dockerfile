# Étape 1 : Construction de l'application
FROM node:20-alpine AS builder

# Définit le répertoire de travail
WORKDIR /app

# Copie les fichiers de configuration
COPY package*.json ./

# Installer les dépendances
RUN if [ -f package-lock.json ]; then npm ci --legacy-peer-deps || npm install --legacy-peer-deps; else npm install --legacy-peer-deps; fi && npm cache clean --force

# Copie Prisma et .env
COPY prisma ./prisma
COPY .env ./

# Génération du client Prisma
RUN npx prisma generate

# Copie tout le code source
COPY . .

# Build l'application
RUN npm run build

# Étape 2 : Image finale pour la production
FROM node:20-alpine

# Définit le répertoire de travail
WORKDIR /app

# Copie les fichiers nécessaires depuis l'étape builder
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
