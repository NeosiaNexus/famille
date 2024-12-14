"use server";

import { ActionError } from "@/actions/utils/ActionError";
import { validateSessionToken } from "@/lib/auth";
import { cookies } from "next/headers";

export default async function validateSession(
  token: string | undefined = cookies().get("session_token")?.value,
) {
  try {
    const userFamily = await validateSessionToken(token);
    if (!userFamily) throw new Error("Utilisateur non valide.");
    return userFamily;
  } catch (error) {
    if (error instanceof Error) throw new ActionError(error.message);
    throw new ActionError(
      "Erreur inconnue lors de la validation de la session.",
    );
  }
}
