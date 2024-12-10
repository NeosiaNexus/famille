"use server";

import { ActionError } from "@/actions/utils/ActionError";
import { IFullFamily } from "@/interfaces/IFamily";
import prisma from "@/lib/prisma";
import { User } from "@prisma/client";

export default async function getUserFamilies(
  userId: User["id"],
): Promise<IFullFamily[]> {
  if (!userId) {
    throw new ActionError(
      "L'id de l'utilisateur est requis pour récupérer ses familles.",
    );
  }

  const currentUser = await prisma.user.findUnique({
    where: {
      id: userId,
    },
  });

  if (!currentUser) {
    throw new ActionError("L'utilisateur n'existe pas.");
  }

  return await prisma.family.findMany({
    where: {
      members: {
        some: {
          userId,
        },
      },
    },
    include: {
      members: true,
      events: true,
    },
  });
}
