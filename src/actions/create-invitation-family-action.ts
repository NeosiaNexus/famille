"use server";

import { ActionError } from "@/actions/utils/ActionError";
import { InvitationFamily } from "@/interfaces";
import prisma from "@/lib/prisma";
import { InvitationStatus, Prisma } from "@prisma/client";
import { z } from "zod";

export async function createInvitationFamilyAction(
  formData: FormData,
): Promise<InvitationFamily> {
  // Vérification de la présence des données du formulaire
  if (!formData) {
    throw new ActionError("Les données du formulaire sont requises.");
  }

  // Extraction des champs du formulaire
  const invitedEmail = formData.get("invitedEmail") as string | null;
  const message = formData.get("message") as string | null;
  const senderId = formData.get("senderId") as string | null;
  const familyId = formData.get("familyId") as string | null;

  // Validation des champs obligatoires
  if (!invitedEmail || invitedEmail.trim() === "") {
    throw new ActionError("L'email de l'utilisateur à inviter est requis.");
  }

  if (!senderId || senderId.trim() === "") {
    throw new ActionError("L'id de l'expéditeur est requis.");
  }

  if (!familyId || familyId.trim() === "") {
    throw new ActionError("L'id de la famille est requis.");
  }

  // Validation du format de l'email
  let verifiedEmail: string;
  try {
    verifiedEmail = z.string().email().parse(invitedEmail);
  } catch {
    throw new ActionError("L'email fourni est invalide.");
  }

  // Vérification de l'existence de l'utilisateur à inviter
  const invitedUser = await prisma.user.findFirst({
    where: { email: verifiedEmail },
  });
  if (!invitedUser) {
    throw new ActionError(
      "L'utilisateur que vous essayez d'inviter n'est pas inscrit sur la plateforme.",
    );
  }

  // Vérification de l'existence de la famille
  const family = await prisma.family.findFirst({
    where: { id: familyId },
    include: {
      members: {
        include: { user: true },
      },
    },
  });
  if (!family) {
    throw new ActionError("La famille spécifiée n'existe pas.");
  }

  // Vérification si l'utilisateur est déjà membre de la famille
  if (family.members.some((member) => member.user.email === verifiedEmail)) {
    throw new ActionError("L'utilisateur est déjà membre de cette famille.");
  }

  // Vérification d'une invitation récente
  const recentInvitation = await prisma.invitation.findFirst({
    where: {
      familyId,
      invitedEmail: verifiedEmail,
      createdAt: {
        gte: new Date(Date.now() - 30 * 1000), // Vérifie les invitations des 30 dernières secondes
      },
    },
  });
  if (recentInvitation) {
    throw new ActionError(
      "Une invitation a déjà été envoyée il y a moins de 30 secondes. Veuillez patienter.",
    );
  }

  // Vérification des invitations en attente
  const pendingInvitation = await prisma.invitation.findFirst({
    where: {
      familyId,
      invitedEmail: verifiedEmail,
      status: InvitationStatus.PENDING,
    },
  });
  if (pendingInvitation) {
    throw new ActionError(
      "Une invitation en attente existe déjà pour cet utilisateur.",
    );
  }

  // Création de l'invitation
  try {
    return (await prisma.invitation.create({
      data: {
        invitedEmail: verifiedEmail,
        message: message?.trim() === "" ? null : message,
        senderId,
        familyId,
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
    })) as InvitationFamily;
  } catch (error) {
    if (error instanceof Prisma.PrismaClientKnownRequestError) {
      if (error.code === "P2003") {
        throw new ActionError(
          "L'invitation que vous essayez d'envoyer est invalide.",
        );
      }
    }
    throw new ActionError(
      "Une erreur est survenue lors de l'envoi de l'invitation.",
    );
  }
}
