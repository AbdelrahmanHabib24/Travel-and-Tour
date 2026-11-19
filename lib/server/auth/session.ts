import "server-only";
import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import { prisma } from "@/lib/server/db/prisma";
import { getJwtSecret, isProduction } from "@/lib/server/config/env";
import {
  ACCESS_TOKEN_TTL_SECONDS,
  REFRESH_TOKEN_TTL_SECONDS,
  type AuthenticatedUser,
  type RefreshTokenStore,
  verifyAccessToken,
  hashRefreshToken,
  rotateRefreshToken,
} from "@/lib/server/auth/tokens";

export const AUTH_COOKIE_NAME = "authToken";
export const REFRESH_COOKIE_NAME = "refreshToken";

export function setAccessTokenCookie(res: NextResponse, accessToken: string): void {
  res.cookies.set(AUTH_COOKIE_NAME, accessToken, {
    httpOnly: true,
    secure: isProduction(),
    sameSite: "strict",
    maxAge: ACCESS_TOKEN_TTL_SECONDS,
    path: "/",
  });
}

export function setRefreshTokenCookie(
  res: NextResponse,
  rawRefreshToken: string
): void {
  res.cookies.set(REFRESH_COOKIE_NAME, rawRefreshToken, {
    httpOnly: true,
    secure: isProduction(),
    sameSite: "strict",
    maxAge: REFRESH_TOKEN_TTL_SECONDS,
    path: "/",
  });
}

export function setAuthCookies(
  res: NextResponse,
  accessToken: string,
  rawRefreshToken?: string
): void {
  setAccessTokenCookie(res, accessToken);
  if (rawRefreshToken) {
    setRefreshTokenCookie(res, rawRefreshToken);
  }
}

export function clearAuthCookies(res: NextResponse): void {
  const base = {
    httpOnly: true,
    secure: isProduction(),
    sameSite: "strict" as const,
    maxAge: 0,
    path: "/",
  };
  res.cookies.set(AUTH_COOKIE_NAME, "", base);
  res.cookies.set(REFRESH_COOKIE_NAME, "", base);
}

/**
 * Defense-in-depth CSRF check for state-changing requests.
 * Rejects browser requests whose Origin header does not match the request Host.
 */
export function isSameOriginRequest(req: Request): boolean {
  const origin = req.headers.get("origin");
  if (!origin) return true; // Non-browser or same-origin navigation without Origin
  const host = req.headers.get("x-forwarded-host") || req.headers.get("host");
  if (!host) return false;

  try {
    const originHost = new URL(origin).host.toLowerCase();
    return originHost === host.toLowerCase();
  } catch {
    return false;
  }
}

export async function getAuthenticatedUser(): Promise<AuthenticatedUser | null> {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get(AUTH_COOKIE_NAME)?.value;
    if (!token) return null;
    return verifyAccessToken(token, getJwtSecret());
  } catch {
    return null;
  }
}

export async function getRefreshTokenCookie(): Promise<string | null> {
  const cookieStore = await cookies();
  return cookieStore.get(REFRESH_COOKIE_NAME)?.value || null;
}

export const prismaRefreshTokenStore: RefreshTokenStore = {
  async findByHash(tokenHash) {
    return prisma.refreshToken.findUnique({ where: { tokenHash } });
  },

  async findUserById(userId) {
    return prisma.user.findUnique({
      where: { id: userId },
      select: { id: true, email: true, username: true },
    });
  },

  async create(data) {
    return prisma.refreshToken.create({ data });
  },

  async rotateAtomic({
    currentId,
    now,
    newTokenHash,
    familyId,
    userId,
    newExpiresAt,
  }) {
    return prisma.$transaction(async (tx) => {
      // Atomic compare-and-swap: only one concurrent request can claim revokedAt: null
      const claimed = await tx.refreshToken.updateMany({
        where: { id: currentId, revokedAt: null },
        data: { revokedAt: now },
      });

      if (claimed.count === 0) {
        const current = await tx.refreshToken.findUnique({
          where: { id: currentId },
        });
        return { rotated: false as const, current };
      }

      const replacement = await tx.refreshToken.create({
        data: {
          tokenHash: newTokenHash,
          familyId,
          userId,
          expiresAt: newExpiresAt,
        },
      });

      await tx.refreshToken.update({
        where: { id: currentId },
        data: { replacedById: replacement.id },
      });

      return { rotated: true as const, replacement };
    });
  },

  async revokeByHash(tokenHash, now) {
    await prisma.refreshToken.updateMany({
      where: { tokenHash, revokedAt: null },
      data: { revokedAt: now },
    });
  },

  async revokeFamily(familyId, now) {
    await prisma.refreshToken.updateMany({
      where: { familyId, revokedAt: null },
      data: { revokedAt: now },
    });
  },
};

export async function revokeRefreshTokenFromRaw(rawToken: string): Promise<void> {
  if (!rawToken) return;
  try {
    await prismaRefreshTokenStore.revokeByHash(
      hashRefreshToken(rawToken),
      new Date()
    );
  } catch {
    // Best-effort revocation (e.g. if RefreshToken migration is not yet applied)
  }
}

export interface ResolvedSession {
  user: AuthenticatedUser | null;
  applyCookies: (res: NextResponse) => NextResponse;
}


export async function resolveAuthenticatedSession(): Promise<ResolvedSession> {
  const user = await getAuthenticatedUser();
  if (user) {
    return { user, applyCookies: (res) => res };
  }

  const rawRefreshToken = await getRefreshTokenCookie();
  if (!rawRefreshToken) {
    return { user: null, applyCookies: (res) => res };
  }

  try {
    const rotated = await rotateRefreshToken({
      rawRefreshToken,
      store: prismaRefreshTokenStore,
      jwtSecret: getJwtSecret(),
    });

    if (rotated.status === "rotated") {
      return {
        user: rotated.user,
        applyCookies: (res) => {
          setAuthCookies(res, rotated.accessToken, rotated.rawRefreshToken);
          return res;
        },
      };
    }

    if (rotated.status === "grace_hit") {
      return {
        user: rotated.user,
        applyCookies: (res) => {
          setAccessTokenCookie(res, rotated.accessToken);
          return res;
        },
      };
    }

    return {
      user: null,
      applyCookies: (res) => {
        clearAuthCookies(res);
        return res;
      },
    };
  } catch {
    return { user: null, applyCookies: (res) => res };
  }
}
