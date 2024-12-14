import prisma from "@/lib/prisma";
import { Role } from "@prisma/client";

class FamilyService {
  async createFamily(data: any): Promise<any> {
    const family = await prisma.family.create({
      data: {
        name: data.familyName.trim(),
        description: data.familyDescription?.trim() || null,
      },
    });
    return prisma.userFamily.create({
      data: {
        userId: data.userId,
        familyId: family.id,
        role: Role.ADMIN,
      },
      include: {
        user: true,
        family: true,
      },
    });
  }

  async getFamiliesUserById(userId: string) {
    const userFamily = await prisma.user.findUnique({
      where: {
        id: userId,
      },
      include: {
        family: {
          include: {
            family: {
              include: {
                members: {
                  include: {
                    user: true,
                  },
                },
                events: {
                  include: {
                    participants: {
                      include: {
                        user: true,
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

    return userFamily?.family.map((family) => {
      return {
        ...family.family,
        members: family.family.members.map((member) => {
          // eslint-disable-next-line @typescript-eslint/no-unused-vars
          const { passwordHash, ...user } = member.user;
          return {
            ...user,
          };
        }),
        events: family.family.events.map((event) => {
          return {
            ...event,
            participants: event.participants.map((participant) => {
              // eslint-disable-next-line @typescript-eslint/no-unused-vars
              const { passwordHash, ...user } = participant.user;
              return {
                ...user,
              };
            }),
          };
        }),
      };
    });
  }
}

export default FamilyService;
