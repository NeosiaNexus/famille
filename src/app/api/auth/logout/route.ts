"use server";

import { errorResponse, successResponse } from "@/lib/api";
import { invalidateSession } from "@/lib/auth";
import { sha256 } from "@oslojs/crypto/sha2";
import { encodeHexLowerCase } from "@oslojs/encoding";
import { NextRequest } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const token = req.cookies.get("session_token")?.value;

    if (!token) {
      return errorResponse("Aucun token de session trouvé.", 400);
    }

    const sessionId = encodeHexLowerCase(
      sha256(new TextEncoder().encode(token)),
    );

    await invalidateSession(sessionId);

    const response = successResponse("Déconnexion réussie.", 200);

    // Supprimer le cookie
    response.cookies.delete("session_token");

    return response;
  } catch (error) {
    console.error("Erreur lors de la déconnexion :", error);
    return errorResponse("Erreur interne lors de la déconnexion.", 500);
  }
}
