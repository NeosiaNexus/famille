import { User } from "@prisma/client";

export type UserWithoutPassword = Omit<User, "passwordHash">;

export type MinimumUser = Pick<UserWithoutPassword, "id" | "pseudo" | "email">;
