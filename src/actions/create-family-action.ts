"use server";

import { ActionError } from "@/actions/utils/ActionError";
import { FamilyService } from "@/services";

export default async function createFamily(formData: FormData): Promise<any> {
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
    return await new FamilyService().createFamily({
      familyName: name,
      familyDescription: description,
      userId,
    });

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
  } catch (error) {
    throw new ActionError(
      "Une erreur est survenue lors de la création de la famille.",
    );
  }
}
