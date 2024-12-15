"use server";

import { InvitationFamily } from "@/interfaces";
import prisma from "@/lib/prisma";

export async function getUserInvitationsFamilyAction(email: string) {
  const invitations: InvitationFamily[] = await prisma.invitation.findMany({
    where: {
      invitedEmail: email,
    },
    include: {
      sender: {
        select: {
          id: true,
          email: true,
          pseudo: true,
        },
      },
      family: {
        select: {
          id: true,
          name: true,
        },
      },
    },
  });

  return invitations;
}
