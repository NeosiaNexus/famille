import { MinimumUser, UserWithoutPassword } from "@/types";
import { Family, FamilyEvent, Role } from "@prisma/client";

export interface UserWithFamily extends UserWithoutPassword {
  families: FullFamily[];
}

export interface FullFamily extends Family {
  members: MemberFamily[];
  events: EventFamily[];
}

export interface MemberFamily extends MinimumUser {
  familyRole: Role;
}

export interface EventFamily extends Omit<FamilyEvent, "familyId"> {
  participants: MinimumUser[];
}
