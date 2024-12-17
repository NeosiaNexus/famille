"use server";

import { ActionError } from "@/actions/utils/ActionError";
import prisma from "@/lib/prisma";
import { Prisma } from "@prisma/client";
import { z } from "zod";

// Définition du schéma de validation avec Zod
const createFamilyEventSchema = z.object({
  title: z.string().min(1, "Le titre de l'évènement est requis."),
  description: z.string().optional(),
  date: z
    .string({
      invalid_type_error: "La date fournie est invalide.",
    })
    .refine(
      (date) => !isNaN(Date.parse(date)),
      "La date fournie est invalide.",
    ),
  location: z.string().min(1, "Le lieu de l'évènement est requis."),
  familyId: z.string().min(1, "L'identifiant de la famille est requis."),
});

export async function createFamilyEvent(formData: FormData): Promise<void> {
  // Extraction et validation des données du formulaire
  console.log(formData);
  const rawData = {
    title: formData.get("title"),
    description: formData.get("description"),
    date: formData.get("date"),
    location: formData.get("location"),
    familyId: formData.get("familyId"),
  };

  const parsedData = createFamilyEventSchema.safeParse(rawData);
  if (!parsedData.success) {
    throw new ActionError(
      parsedData.error.errors.map((err) => err.message).join(" "),
    );
  }

  const { title, description, date, location, time, familyId } =
    parsedData.data;

  // Construction de la date finale avec heure si elle est spécifiée
  const eventDate = new Date(date);
  if (time) {
    const [hours, minutes] = time.split(":");
    eventDate.setHours(parseInt(hours), parseInt(minutes), 0, 0);
  } else {
    eventDate.setHours(0, 0, 0, 0); // Toute la journée
  }

  // Vérification de l'existence de la famille
  const family = await prisma.family.findFirst({
    where: { id: familyId },
  });
  if (!family) {
    throw new ActionError("La famille spécifiée n'existe pas.");
  }

  // Vérification des doublons : éviter les évènements identiques le même jour
  const existingEvent = await prisma.familyEvent.findFirst({
    where: {
      familyId,
      title,
      date: eventDate,
    },
  });
  if (existingEvent) {
    throw new ActionError(
      "Un évènement avec le même titre existe déjà pour cette date.",
    );
  }

  // Création de l'évènement
  try {
    await prisma.familyEvent.create({
      data: {
        title,
        description: description || null,
        date: eventDate,
        location,
        familyId,
      },
    });
  } catch (error) {
    if (error instanceof Prisma.PrismaClientKnownRequestError) {
      if (error.code === "P2003") {
        throw new ActionError(
          "Une erreur d'intégrité est survenue, vérifiez les données fournies.",
        );
      }
    }
    throw new ActionError(
      "Une erreur est survenue lors de la création de l'évènement.",
    );
  }
}
