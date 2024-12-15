"use server";

import { User } from "@prisma/client";
import bcrypt from "bcrypt";
import { NextRequest } from "next/server";

import { errorResponse, successResponse } from "@/lib/api";
import { cookieSet, createSession, generateSessionToken } from "@/lib/auth";
import prisma from "@/lib/prisma";

interface BodyProps {
  email: string;
  password: string;
}

export async function POST(req: NextRequest) {
  try {
    const requestBodyText = await req.text();
    const requestBody = JSON.parse(requestBodyText);
    const { email, password } = requestBody as BodyProps;

    if (!email || !password) {
      return errorResponse(
        "Veuillez fournir une adresse email et un mot de passe.",
        400,
      );
    }

    // Trouver l'utilisateur par email ou pseudo
    const user: User | null = await prisma.user.findFirst({
      where: {
        OR: [{ email }, { pseudo: email }],
      },
    });

    if (!user) {
      return errorResponse(
        "Aucun utilisateur trouvé avec cette email ou ce pseudo.",
        404,
      );
    }

    // Vérifier le mot de passe
    const isPasswordValid = await bcrypt.compare(password, user.passwordHash);
    if (!isPasswordValid) {
      return errorResponse("Mot de passe incorrect.", 401);
    }

    // Supprimer toutes les sessions actives pour cet utilisateur
    await prisma.session.deleteMany({
      where: {
        userId: user.id,
      },
    });

    // Créer une nouvelle session
    const sessionToken = generateSessionToken();
    await createSession(sessionToken, user.id);

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { passwordHash, ...safeUser } = user;

    // Définir un cookie de session
    const response = successResponse<Partial<User>>(safeUser, 200);

    cookieSet(response, sessionToken);

    return response;
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
  } catch (error) {
    return errorResponse("Une erreur s'est produite.", 500);
  }
}
