import { NextResponse } from "next/server";
import { getJwtSecret } from "@/lib/server/config/env";
import { rotateRefreshToken } from "@/lib/server/auth/tokens";
import {
  clearAuthCookies,
  getRefreshTokenCookie,
  isSameOriginRequest,
  prismaRefreshTokenStore,
  setAccessTokenCookie,
  setAuthCookies,
} from "@/lib/server/auth/session";

export async function POST(req: Request) {
  try {
    if (!isSameOriginRequest(req)) {
      return NextResponse.json(
        { error: "Invalid request origin." },
        { status: 403 }
      );
    }

    const rawRefreshToken = await getRefreshTokenCookie();
    if (!rawRefreshToken) {
      const res = NextResponse.json(
        { error: "Missing refresh token" },
        { status: 401 }
      );
      clearAuthCookies(res);
      return res;
    }

    const result = await rotateRefreshToken({
      rawRefreshToken,
      store: prismaRefreshTokenStore,
      jwtSecret: getJwtSecret(),
    });

    if (result.status === "rotated") {
      const res = NextResponse.json({ user: result.user }, { status: 200 });
      setAuthCookies(res, result.accessToken, result.rawRefreshToken);
      return res;
    }

    if (result.status === "grace_hit") {
      const res = NextResponse.json({ user: result.user }, { status: 200 });
      setAccessTokenCookie(res, result.accessToken);
      return res;
    }

    const res = NextResponse.json(
      {
        error:
          result.status === "reuse_detected"
            ? "Session revoked due to token reuse"
            : "Invalid or expired refresh token",
      },
      { status: 401 }
    );
    clearAuthCookies(res);
    return res;
  } catch (err) {
    console.error("Refresh error:", err instanceof Error ? err.message : "Unknown error");
    return NextResponse.json(
      { error: "Unable to refresh session" },
      { status: 500 }
    );
  }
}
