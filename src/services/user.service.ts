import { ActionError } from "@/actions/utils/ActionError";
import prisma from "@/lib/prisma";
import { User } from "@prisma/client";

class UserService {
  /**
   * Permet de récupérer un utilisateur par son id
   * @param id - L'id de l'utilisateur
   */
  async getUserById(id: string): Promise<User> {
    const user = await prisma.user.findUnique({
      where: {
        id,
      },
    });

    if (!user) {
      throw new ActionError("L'utilisateur n'existe pas.");
    }

    return user;
  }

  async getUserWithFamily(id: string): Promise<any> {
    const user = await prisma.user.findUnique({
      where: {
        id,
      },
      include: {
        family: {
          include: {
            family: {
              include: {
                members: true,
                events: true,
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

    return {
      ...userWithoutPassword,
      family: user.family.map((f) => f.family),
    };
  }
}

export default UserService;
