import { ActionError } from "@/actions/utils/ActionError";
import {
  EventFamily,
  FullFamily,
  MemberFamily,
  UserWithFamily,
} from "@/interfaces";
import prisma from "@/lib/prisma";
import { MinimumUser, UserWithoutPassword } from "@/types";

class UserService {
  /**
   * Permet de récupérer un utilisateur par son id
   * @param id - L'id de l'utilisateur
   * @returns L'utilisateur sans son mot de passe
   */
  async getUserById(id: string): Promise<UserWithoutPassword> {
    const user = await prisma.user.findUnique({
      where: { id },
    });

    if (!user) {
      throw new ActionError("L'utilisateur n'existe pas.");
    }

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { passwordHash, ...userWithoutPassword } = user;
    return userWithoutPassword;
  }

  /**
   * Permet de récupérer un utilisateur avec ses familles, membres et événements
   * @param id - L'id de l'utilisateur
   * @returns L'utilisateur avec ses familles et leurs détails
   */
  async getUserWithFamily(id: string): Promise<UserWithFamily> {
    const user = await prisma.user.findUnique({
      where: { id },
      include: {
        family: {
          include: {
            family: {
              include: {
                members: {
                  include: {
                    user: {
                      select: {
                        id: true,
                        pseudo: true,
                        email: true,
                      },
                    },
                  },
                },
                events: {
                  include: {
                    participants: {
                      include: {
                        user: {
                          select: {
                            id: true,
                            pseudo: true,
                            email: true,
                          },
                        },
                      },
                    },
                  },
                },
              },
            },
          },
        },
      },
    });

    if (!user) {
      throw new ActionError("L'utilisateur n'existe pas.");
    }

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { passwordHash, family, ...userWithoutPassword } = user;

    const families: FullFamily[] = family.map(
      ({ family }): FullFamily =>
        ({
          ...family,
          members: family.members.map(
            ({ role, user }): MemberFamily => ({
              ...user,
              familyRole: role,
            }),
          ),
          events: family.events.map(
            (event): EventFamily => ({
              ...event,
              participants: event.participants.map(
                ({ user }): MinimumUser => ({
                  ...user,
                }),
              ),
            }),
          ),
        }) as FullFamily,
    ) as FullFamily[];

    return {
      ...userWithoutPassword,
      families,
    } as UserWithFamily;
  }
}

export default UserService;
