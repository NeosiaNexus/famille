import { Family, FamilyEvent, UserFamily } from "@prisma/client";

export interface IFullFamily extends Family {
  members: UserFamily[];
  events: FamilyEvent[];
}
