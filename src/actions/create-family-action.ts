"use server";

import { ActionError } from "@/actions/utils/ActionError";
import prisma from "@/lib/prisma";
import { Family, Role } from "@prisma/client";

export default async function createFamily(
  formData: FormData,
): Promise<Family> {
  if (!formData) {
    throw new ActionError(
      "Les données du formulaire sont requises pour créer une famille.",
    );
  }

  const userId = formData.get("userId") as string | null;
  const name = formData.get("name") as string | null;
  const description = formData.get("description") as string | null;

  if (!userId || userId.trim() === "") {
    throw new ActionError(
      "L'id de l'utilisateur est requis pour créer une famille.",
    );
  }

  if (!name || name.trim() === "") {
    throw new ActionError("Le nom de la famille est requis.");
  }

  try {
    const family = await prisma.family.create({
      data: {
        name: name.trim(),
        description: description?.trim() || null,
      },
      include: {
        members: true,
      },
    });

    await prisma.userFamily.create({
      data: {
        userId,
        familyId: family.id,
        role: Role.ADMIN,
      },
    });

    return family;

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
  } catch (error) {
    throw new ActionError(
      "Une erreur est survenue lors de la création de la famille.",
    );
  }
}
