"use server";

import { ActionError } from "@/actions/utils/ActionError";
import { IFullFamily } from "@/interfaces/IFamily";
import prisma from "@/lib/prisma";

export default async function getFamilyById(id: string): Promise<IFullFamily> {


  if (!id)
    throw new ActionError(
      "L'id de la famille est requis pour récupérer la famille.",
    );

  const searchFamily = await prisma.family.findUnique({
    where: {
      id,
    },
    include: {
      members: true,
      events: true,
    },
  });

  if (!searchFamily) throw new ActionError("La famille n'existe pas.");

  return searchFamily;
}
