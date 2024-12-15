"use server";

import { ActionError } from "@/actions/utils/ActionError";
import { InvitationFamily } from "@/interfaces";
import prisma from "@/lib/prisma";
import { InvitationStatus } from "@prisma/client";

export async function responseToFamilyInvitationAction(
  invitationFamily: InvitationFamily,
  responseStatus: InvitationStatus,
) {
  if (!invitationFamily) {
    throw new ActionError("L'identifiant de l'invitation est requis.");
  }

  if (!["ACCEPTED", "DECLINED"].includes(responseStatus)) {
    throw new ActionError(
      "La réponse à l'invitation doit être ACCEPTED ou DECLINED.",
    );
  }

  const invitation = await prisma.invitation.findUnique({
    where: { id: invitationFamily.id },
    include: {
      family: true,
      sender: true,
    },
  });

  if (!invitation) {
    throw new ActionError("L'invitation spécifiée n'existe pas.");
  }

  if (invitation.status !== "PENDING") {
    throw new ActionError("Cette invitation a déjà été traitée.");
  }

  return await prisma.$transaction(async (tx) => {
    // Mise à jour du statut de l'invitation
    const updatedInvitation = await tx.invitation.update({
      where: { id: invitationFamily.id },
      data: { status: responseStatus },
    });

    // Si ACCEPTED, ajouter l'utilisateur à la famille
    if (responseStatus === "ACCEPTED") {
      const invitedUser = await tx.user.findUnique({
        where: { email: invitation.invitedEmail },
      });

      if (!invitedUser) {
        throw new ActionError("L'utilisateur invité n'existe pas.");
      }

      await tx.userFamily.create({
        data: {
          userId: invitedUser.id,
          familyId: invitation.familyId,
        },
      });
    }

    return {
      message: `Vous avez ${responseStatus === "ACCEPTED" ? "rejoint" : "refusé"} l'invitation à rejoindre la famille ${invitation.family.name}.`,
      invitation: updatedInvitation,
      family: invitation.family,
    };
  });
}
