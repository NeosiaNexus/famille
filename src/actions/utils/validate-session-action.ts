"use server";

import { ActionError } from "@/actions/utils/ActionError";
import { IUserWithUserFamily } from "@/interfaces/IUser";
import { validateSessionToken } from "@/lib/auth";
import { cookies } from "next/headers";

export default async function validateSession(
  token: string | undefined = cookies().get("session_token")?.value,
): Promise<Partial<IUserWithUserFamily>> {
  try {
    const { user } = await validateSessionToken(token);
    return user;
  } catch (error) {
    if (error instanceof Error) throw new ActionError(error.message);
    throw new ActionError(
      "Erreur inconnue lors de la validation de la session.",
    );
  }
}
