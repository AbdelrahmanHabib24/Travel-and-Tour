import { NextResponse } from "next/server";
import { getJwtSecret } from "@/lib/server/config/env";
import { rotateRefreshToken } from "@/lib/server/auth/tokens";
import {
  clearAuthCookies,
  getAuthenticatedUser,
  getRefreshTokenCookie,
  prismaRefreshTokenStore,
  setAccessTokenCookie,
  setAuthCookies,
} from "@/lib/server/auth/session";

export async function GET() {
  try {
    const user = await getAuthenticatedUser();
    if (user) {
      return NextResponse.json({ user }, { status: 200 });
    }

    // Transparently rotate expired access token when a valid refresh token cookie exists
    const rawRefreshToken = await getRefreshTokenCookie();
    if (!rawRefreshToken) {
      return NextResponse.json({ user: null }, { status: 200 });
    }

    const refreshed = await rotateRefreshToken({
      rawRefreshToken,
      store: prismaRefreshTokenStore,
      jwtSecret: getJwtSecret(),
    });

    if (refreshed.status === "rotated") {
      const res = NextResponse.json({ user: refreshed.user }, { status: 200 });
      setAuthCookies(res, refreshed.accessToken, refreshed.rawRefreshToken);
      return res;
    }

    if (refreshed.status === "grace_hit") {
      const res = NextResponse.json({ user: refreshed.user }, { status: 200 });
      setAccessTokenCookie(res, refreshed.accessToken);
      return res;
    }

    const res = NextResponse.json({ user: null }, { status: 200 });
    clearAuthCookies(res);
    return res;
  } catch {
    return NextResponse.json({ user: null }, { status: 200 });
  }
}
