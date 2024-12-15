"use server";

import { ActionError } from "@/actions/utils/ActionError";
import validateSession from "@/actions/utils/validate-session-action";
import { EventFamily, FullFamily, MemberFamily } from "@/interfaces";
import prisma from "@/lib/prisma";
import { MinimumUser } from "@/types";

export default async function getFamilyById(id: string): Promise<FullFamily> {
  const sessionWithUserAndFamily = await validateSession();

  if (!id)
    throw new ActionError(
      "L'id de la famille est requis pour récupérer la famille.",
    );

  if (
    !sessionWithUserAndFamily.user.family
      .map((fullFamily: FullFamily) => fullFamily.id)
      .includes(id)
  )
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
            },
          },
        },
      },
      events: {
        include: {
          participants: {
            include: {
              user: {
                select: {
                  id: true,
                  pseudo: true,
                  email: true,
                },
              },
            },
          },
        },
      },
    },
  });

  if (!searchFamily) throw new ActionError("La famille n'existe pas.");

  const members = searchFamily.members.map(
    ({ role, user }): MemberFamily => ({
      ...user,
      familyRole: role,
    }),
  );

  const events = searchFamily.events.map(
    (event): EventFamily => ({
      ...event,
      participants: event.participants.map(
        ({ user }): MinimumUser => ({
          ...user,
        }),
      ),
    }),
  );

  return {
    ...searchFamily,
    members,
    events,
  };
}
