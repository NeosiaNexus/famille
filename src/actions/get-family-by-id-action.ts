"use server";

import { ActionError } from "@/actions/utils/ActionError";
import validateSession from "@/actions/utils/validate-session-action";
import prisma from "@/lib/prisma";

export default async function getFamilyById(id: string): Promise<any> {
  const sessionWithUserAndFamily = await validateSession();

  if (!id)
    throw new ActionError(
      "L'id de la famille est requis pour récupérer la famille.",
    );

  if (!sessionWithUserAndFamily.user.family.map((f: any) => f.id).includes(id))
    throw new ActionError(
      "Vous ne faites pas partie de cette famille ou elle n'existe pas.",
    );

  const searchFamily = await prisma.family.findUnique({
    where: {
      id,
    },
    include: {
      members: {
        include: {
          user: {
            select: {
              id: true,
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

  return {
    members: searchFamily.members.map((m) => m.user),
    events: searchFamily.events,
  };
}
