"use server";

import { ActionError } from "@/actions/utils/ActionError";
import { UserService } from "@/services";
import { User } from "@prisma/client";

export default async function getUserFamilies(userId: User["id"]) {
  if (!userId) {
    throw new ActionError(
      "L'id de l'utilisateur est requis pour récupérer ses familles.",
    );
  }

  return await new UserService().getUserWithFamily(userId);
}
