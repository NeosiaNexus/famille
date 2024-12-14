import prisma from "@/lib/prisma";
import { sha256 } from "@oslojs/crypto/sha2";
import { encodeHexLowerCase } from "@oslojs/encoding";

class SessionService {
  async getSessionByToken(token: string): Promise<any> {
    const sessionId = encodeHexLowerCase(
      sha256(new TextEncoder().encode(token)),
    );

    const session = await prisma.session.findUnique({
      where: {
        id: sessionId,
      },
      include: {
        user: {
          include: {
            family: {
              include: {
                family: true,
              },
            },
          },
        },
      },
    });

    if (!session || !session.user) {
      throw new Error("Session introuvable ou utilisateur manquant.");
    }

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { passwordHash, family, ...userWithoutPassword } = session.user;

    return {
      session: {
        id: session.id,
        expiresAt: session.expiresAt,
        userId: session.userId,
      },
      user: {
        ...userWithoutPassword,
        family: family.map((userFamily: any) => userFamily.family),
      },
    };
  }
}

export default SessionService;
