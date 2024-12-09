"use server";

import { ActionError } from "@/actions/ActionError";
import prisma from "@/lib/prisma";
import { Family } from "@prisma/client";

export default async function createFamily(
  formData: FormData,
): Promise<Family> {
  if (!formData) {
    throw new ActionError(
      "Les données du formulaire sont requises pour créer une famille.",
    );
  }

  const name = formData.get("name") as string;
  const description = formData.get("description") as string;

  if (!name) {
    throw new ActionError("Le nom de la famille est requis.");
  }

  return await prisma.family.create({
    data: {
      name,
      description,
    },
  });
}
