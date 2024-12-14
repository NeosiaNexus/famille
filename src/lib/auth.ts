import prisma from "@/lib/prisma";
import { SessionService } from "@/services";
import { sha256 } from "@oslojs/crypto/sha2";
import {
  encodeBase32LowerCaseNoPadding,
  encodeHexLowerCase,
} from "@oslojs/encoding";
import { Session } from "@prisma/client";
import { NextResponse } from "next/server";

const SESSION_DURATION_MS = 15 * 24 * 60 * 60 * 1000;

export type SessionValidationResult = {
  session: Session;
  user: any;
};
export function generateSessionToken(): string {
  const bytes = new Uint8Array(20);
  crypto.getRandomValues(bytes);
  return encodeBase32LowerCaseNoPadding(bytes);
}

export async function createSession(
  token: string,
  userId: string,
): Promise<Session> {
  const sessionId = encodeHexLowerCase(sha256(new TextEncoder().encode(token)));

  const session: Session = {
    id: sessionId,
    userId,
    expiresAt: new Date(Date.now() + SESSION_DURATION_MS), // 15 jours
  };

  await prisma.session.create({
    data: session,
  });

  return session;
}

export async function validateSessionToken(token?: string): Promise<any> {
  if (!token) {
    throw new Error("Token de session manquant.");
  }

  const userSessionFamily = await new SessionService().getSessionByToken(token);

  if (
    !userSessionFamily ||
    Date.now() >= userSessionFamily.session.expiresAt.getTime()
  ) {
    if (userSessionFamily) {
      await prisma.session.delete({
        where: { id: userSessionFamily.session.id },
      });
    }
    throw new Error("Session invalide ou expirée.");
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  return userSessionFamily;
}

export async function invalidateSession(sessionId: string): Promise<void> {
  await prisma.session.delete({ where: { id: sessionId } });
}

export function cookieSet(response: NextResponse, sessionToken: string) {
  response.cookies.set("session_token", sessionToken, {
    sameSite: "lax",
    httpOnly: process.env.NODE_ENV === "production",
    secure: process.env.NODE_ENV === "production",
    maxAge: 60 * 60 * 24 * 15, // 15 jours
    path: "/",
  });
}
