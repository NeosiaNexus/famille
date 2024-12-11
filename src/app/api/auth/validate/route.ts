"use server";

import { errorResponse, successResponse } from "@/lib/api";
import { validateSessionToken } from "@/lib/auth";
import { NextRequest } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const { user } = await validateSessionToken(
      req.cookies.get("session_token")?.value,
    );

    return successResponse(
      {
        success: true,
        user,
      },
      200,
    );
  } catch (error) {
    return errorResponse(
      error instanceof Error ? error.message : "Erreur inconnue.",
      500,
    );
  }
}
