import { User, UserFamily } from "@prisma/client";

export interface IUserWithUserFamily extends User {
  family: UserFamily[];
}
