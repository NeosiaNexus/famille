"use server";

import { ActionError } from "@/actions/ActionError";
import prisma from "@/lib/prisma";
import { Family, User } from "@prisma/client";

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
