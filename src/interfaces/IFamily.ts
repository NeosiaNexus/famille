import { IUserFamily } from "@/interfaces/IUser";
import { Family, FamilyEvent } from "@prisma/client";

export interface IFullFamily extends Family {
  members: IUserFamily[];
  events: FamilyEvent[];
}
