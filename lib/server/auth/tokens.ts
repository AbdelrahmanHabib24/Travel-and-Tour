import "server-only";
import crypto from "node:crypto";
import jwt, { type JwtPayload } from "jsonwebtoken";

export const ACCESS_TOKEN_TTL_SECONDS = 15 * 60; // 15 minutes
export const REFRESH_TOKEN_TTL_SECONDS = 7 * 24 * 60 * 60; // 7 days
export const CONCURRENT_REFRESH_GRACE_MS = 10_000; // 10 seconds

export interface AuthenticatedUser {
  id: number;
  email: string;
  username: string;
}

export interface RefreshTokenRecord {
  id: string;
  tokenHash: string;
  familyId: string;
  userId: number;
  expiresAt: Date;
  revokedAt: Date | null;
  replacedById: string | null;
  createdAt: Date;
}

export interface RefreshTokenStore {
  findByHash(tokenHash: string): Promise<RefreshTokenRecord | null>;
  findUserById(userId: number): Promise<AuthenticatedUser | null>;
  create(data: {
    tokenHash: string;
    familyId: string;
    userId: number;
    expiresAt: Date;
  }): Promise<RefreshTokenRecord>;
  /**
   * Atomically mark an unrevoked token as revoked and create its replacement.
   * Returns `{ rotated: true, replacement }` if this caller won the race,
   * or `{ rotated: false, current }` if another concurrent request rotated it first.
   */
  rotateAtomic(params: {
    currentId: string;
    now: Date;
    newTokenHash: string;
    familyId: string;
    userId: number;
    newExpiresAt: Date;
  }): Promise<
    | { rotated: true; replacement: RefreshTokenRecord }
    | { rotated: false; current: RefreshTokenRecord | null }
  >;
  revokeByHash(tokenHash: string, now: Date): Promise<void>;
  revokeFamily(familyId: string, now: Date): Promise<void>;
}

export function hashRefreshToken(rawToken: string): string {
  return crypto.createHash("sha256").update(rawToken).digest("hex");
}

export function generateOpaqueRefreshToken(): string {
  return crypto.randomBytes(32).toString("base64url");
}

export function generateFamilyId(): string {
  return crypto.randomUUID();
}

export function signAccessToken(user: AuthenticatedUser, secret: string): string {
  return jwt.sign(
    {
      type: "access",
      id: user.id,
      email: user.email,
      username: user.username,
    },
    secret,
    {
      subject: String(user.id),
      expiresIn: ACCESS_TOKEN_TTL_SECONDS,
    }
  );
}

export function verifyAccessToken(
  token: string,
  secret: string
): AuthenticatedUser | null {
  try {
    const decoded = jwt.verify(token, secret) as JwtPayload & {
      type?: string;
      id?: unknown;
      email?: unknown;
      username?: unknown;
    };

    // Reject tokens explicitly marked as non-access (e.g. legacy refresh JWTs)
    if (decoded.type && decoded.type !== "access") {
      return null;
    }

    if (
      typeof decoded.id !== "number" ||
      !Number.isInteger(decoded.id) ||
      typeof decoded.email !== "string" ||
      typeof decoded.username !== "string"
    ) {
      return null;
    }

    return {
      id: decoded.id,
      email: decoded.email,
      username: decoded.username,
    };
  } catch {
    return null;
  }
}

export async function issueRefreshTokenSession(
  store: RefreshTokenStore,
  user: AuthenticatedUser,
  now: Date = new Date()
): Promise<{ rawRefreshToken: string; record: RefreshTokenRecord }> {
  const rawRefreshToken = generateOpaqueRefreshToken();
  const tokenHash = hashRefreshToken(rawRefreshToken);
  const familyId = generateFamilyId();
  const expiresAt = new Date(now.getTime() + REFRESH_TOKEN_TTL_SECONDS * 1000);

  const record = await store.create({
    tokenHash,
    familyId,
    userId: user.id,
    expiresAt,
  });

  return { rawRefreshToken, record };
}

export type RotateRefreshResult =
  | {
      status: "rotated";
      user: AuthenticatedUser;
      accessToken: string;
      rawRefreshToken: string;
    }
  | {
      status: "grace_hit";
      user: AuthenticatedUser;
      accessToken: string;
    }
  | {
      status: "reuse_detected";
      familyId: string;
    }
  | {
      status: "invalid" | "expired";
    };

/**
 * Rotate a refresh token with atomic concurrency safety and replay detection:
 * - Unrevoked & unexpired: atomically rotate into a new token in the same family.
 * - Already revoked WITH replacement within CONCURRENT_REFRESH_GRACE_MS:
 *   treat as legitimate parallel request (`grace_hit`), issuing a fresh access
 *   token without revoking the session family.
 * - Already revoked WITHOUT replacement (logged out) OR outside grace window:
 *   treat as token replay (`reuse_detected`) and revoke the entire token family.
 */
export async function rotateRefreshToken(params: {
  rawRefreshToken: string;
  store: RefreshTokenStore;
  jwtSecret: string;
  now?: Date;
  graceMs?: number;
}): Promise<RotateRefreshResult> {
  const {
    rawRefreshToken,
    store,
    jwtSecret,
    now = new Date(),
    graceMs = CONCURRENT_REFRESH_GRACE_MS,
  } = params;

  if (!rawRefreshToken || rawRefreshToken.length < 16) {
    return { status: "invalid" };
  }

  const tokenHash = hashRefreshToken(rawRefreshToken);
  const existing = await store.findByHash(tokenHash);
  if (!existing) {
    return { status: "invalid" };
  }

  // Case 1: Token was already revoked
  if (existing.revokedAt) {
    const elapsedMs = now.getTime() - existing.revokedAt.getTime();
    if (existing.replacedById && elapsedMs >= 0 && elapsedMs <= graceMs) {
      const user = await store.findUserById(existing.userId);
      if (!user) return { status: "invalid" };
      return {
        status: "grace_hit",
        user,
        accessToken: signAccessToken(user, jwtSecret),
      };
    }

    // Replay/theft detected -> revoke entire token family
    await store.revokeFamily(existing.familyId, now);
    return { status: "reuse_detected", familyId: existing.familyId };
  }

  // Case 2: Token is expired
  if (existing.expiresAt.getTime() <= now.getTime()) {
    await store.revokeByHash(tokenHash, now);
    return { status: "expired" };
  }

  // Case 3: Verify user still exists
  const user = await store.findUserById(existing.userId);
  if (!user) {
    await store.revokeFamily(existing.familyId, now);
    return { status: "invalid" };
  }

  // Case 4: Attempt atomic rotation
  const newRawRefreshToken = generateOpaqueRefreshToken();
  const newTokenHash = hashRefreshToken(newRawRefreshToken);
  const newExpiresAt = new Date(
    now.getTime() + REFRESH_TOKEN_TTL_SECONDS * 1000
  );

  const outcome = await store.rotateAtomic({
    currentId: existing.id,
    now,
    newTokenHash,
    familyId: existing.familyId,
    userId: user.id,
    newExpiresAt,
  });

  if (outcome.rotated) {
    return {
      status: "rotated",
      user,
      accessToken: signAccessToken(user, jwtSecret),
      rawRefreshToken: newRawRefreshToken,
    };
  }

  // Another parallel request beat us to rotating this exact token
  const latest = outcome.current;
  if (
    latest &&
    latest.revokedAt &&
    latest.replacedById &&
    now.getTime() - latest.revokedAt.getTime() <= graceMs
  ) {
    return {
      status: "grace_hit",
      user,
      accessToken: signAccessToken(user, jwtSecret),
    };
  }

  await store.revokeFamily(existing.familyId, now);
  return { status: "reuse_detected", familyId: existing.familyId };
}
