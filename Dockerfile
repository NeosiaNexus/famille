# Étape 1 : Construction de l'application
FROM node:20 AS builder

# Installer pnpm globalement
RUN npm install -g pnpm

# Définit le répertoire de travail
WORKDIR /app

# Copie les fichiers de configuration
COPY pnpm-lock.yaml ./
COPY package.json ./

# Installer les dépendances de production
RUN pnpm install --frozen-lockfile

# Copie Prisma et .env
COPY prisma ./prisma
COPY .env ./

# Génération du client Prisma
RUN npx prisma generate

# Copie tout le code source
COPY . .

# Build l'application
RUN pnpm build

# Étape 2 : Image finale pour la production
FROM node:20

# Installer pnpm globalement
RUN npm install -g pnpm

# Définit le répertoire de travail
WORKDIR /app

# Copie les fichiers nécessaires depuis l'étape builder
COPY --from=builder /app/pnpm-lock.yaml ./pnpm-lock.yaml
COPY --from=builder /app/package.json ./package.json
COPY --from=builder /app/.next ./.next
COPY --from=builder /app/public ./public
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/prisma ./prisma
COPY --from=builder /app/.env ./.env

# Expose le port
EXPOSE 3000

# Commande pour démarrer l'application
CMD ["pnpm", "run", "start:with-migrations"]
