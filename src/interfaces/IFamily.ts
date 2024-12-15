import { MinimumUser, UserWithoutPassword } from "@/types";
import { MinimumFamily } from "@/types/FamilyTypes";
import { Family, FamilyEvent, Invitation, Role } from "@prisma/client";

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

export interface InvitationFamily extends Invitation {
  sender: MinimumUser;
  family: MinimumFamily;
}
