"use server";

import { ActionError } from "@/actions/utils/ActionError";
import validateSession from "@/actions/utils/validate-session-action";
import { IFullFamily } from "@/interfaces/IFamily";
import prisma from "@/lib/prisma";

export default async function getFamilyById(id: string): Promise<IFullFamily> {
  const user = await validateSession();

  if (!id)
    throw new ActionError(
      "L'id de la famille est requis pour récupérer la famille.",
    );

  if (!user.family?.some((family) => family.familyId === id)) {
    throw new ActionError("Vous ne faites pas partie de cette famille.");
  }

  const searchFamily = await prisma.family.findUnique({
    where: {
      id,
    },
    include: {
      members: {
        include: {
          user: {
            select: {
              pseudo: true,
              email: true,
              emailVerified: true,
              role: true,
              createdAt: true,
              updatedAt: true,
            },
          },
        },
      },
      events: true,
    },
  });

  if (!searchFamily) throw new ActionError("La famille n'existe pas.");

  return searchFamily;
}
