import { Family } from "@prisma/client";

export type MinimumFamily = Pick<Family, "id" | "name">;
