import { User, UserFamily } from "@prisma/client";

export interface IUserFamily extends UserFamily {
  user: Partial<User>;
}
