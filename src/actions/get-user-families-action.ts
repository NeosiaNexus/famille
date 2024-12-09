"use server";

import { Family, User } from "@prisma/client";
import prisma from "@/lib/prisma";
import { ActionError } from "@/actions/ActionError";

export default async function getUserFamilies(
  userId: User["id"],
): Promise<Family[]> {
  if (!userId) {
    throw new ActionError(
      "L'id de l'utilisateur est requis pour récupérer ses familles.",
    );
  }

  return await prisma.family.findMany({
    where: {
      members: {
        some: {
          userId,
        },
      },
    },
  });
}
