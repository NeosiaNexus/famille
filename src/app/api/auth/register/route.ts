"use server";

import { User } from "@prisma/client";

import { NextRequest } from "next/server";

import { z } from "zod";

import bcrypt from "bcrypt";

import { RegisterSchema } from "@/schema/RegisterSchema";

import { cookieSet, createSession, generateSessionToken } from "@/lib/auth";
import { errorResponse, successResponse } from "@/lib/api";
import { checkPasswordStrength } from "@/lib/checkPassword";
import prisma from "@/lib/prisma";

export async function POST(req: NextRequest) {
  const requestBodyText = await req.text();

  try {
    const requestBody = JSON.parse(requestBodyText);
    const { email, password, pseudo } = RegisterSchema.parse(requestBody);

    if (!email || !password || !pseudo) {
      return errorResponse(
        "Veuillez fournir une adresse e-mail, un mot de passe et un pseudo.",
        400,
      );
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return errorResponse("Veuillez fournir une adresse e-mail valide.", 400);
    }

    const checkPassword = checkPasswordStrength(password);

    if (checkPassword) {
      return errorResponse(checkPassword, 400);
    }

    const existingUser = await prisma.user.findFirst({
      where: {
        OR: [{ email }, { pseudo }],
      },
    });

    if (existingUser) {
      return errorResponse(
        "Un utilisateur avec cet e-mail ou ce pseudo existe déjà.",
        400,
      );
    }

    const passwordHash = await bcrypt.hash(password, 10);

    const newUser = await prisma.user.create({
      data: {
        email,
        passwordHash,
        pseudo,
      },
    });

    const sessionToken = generateSessionToken();
    await createSession(sessionToken, newUser.id);

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { passwordHash: pass, ...safeUser } = newUser;

    const response = successResponse<Partial<User>>(safeUser, 201);

    cookieSet(response, sessionToken);

    return response;
  } catch (error) {
    if (error instanceof z.ZodError) {
      return errorResponse(error.errors[0].message, 400);
    }
    console.error(error);
    return errorResponse("Une erreur est survenue.", 500);
  }
}
