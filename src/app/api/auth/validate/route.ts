"use server";

import { errorResponse, successResponse } from "@/lib/api";
import { SessionValidationResult } from "@/lib/auth";
import prisma from "@/lib/prisma";
import { sha256 } from "@oslojs/crypto/sha2";
import { encodeHexLowerCase } from "@oslojs/encoding";
import { NextRequest } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const token = req.cookies.get("session_token")?.value;

    if (!token) {
      return errorResponse("Token de session manquant.", 400);
    }

    const sessionId = encodeHexLowerCase(
      sha256(new TextEncoder().encode(token)),
    );

    const result = await prisma.session.findUnique({
      where: {
        id: sessionId,
      },
      include: {
        user: true,
      },
    });

    if (!result) {
      return errorResponse("Session invalide ou expiré.", 401);
    }

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { passwordHash, ...user } = result.user;

    const formatedResult: SessionValidationResult = {
      user: user,
      session: result,
    };

    // Vérifiez si la session est expirée
    if (Date.now() >= result.expiresAt.getTime()) {
      await prisma.session.delete({ where: { id: sessionId } });
      return errorResponse("Session invalide ou expiré.", 401);
    }

    if (formatedResult.session && formatedResult.user) {
      return successResponse(
        {
          success: true,
          user: formatedResult.user,
        },
        200,
      );
    } else {
      return errorResponse("Session invalide ou expiré.", 401);
    }
  } catch (error) {
    console.error(error);
    return errorResponse("Erreur interne de validation de session.", 500);
  }
}
