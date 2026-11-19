import { NextResponse } from "next/server";
import {
  clearAuthCookies,
  getRefreshTokenCookie,
  isSameOriginRequest,
  revokeRefreshTokenFromRaw,
} from "@/lib/server/auth/session";

export async function POST(req: Request) {
  if (!isSameOriginRequest(req)) {
    return NextResponse.json(
      { message: "Invalid request origin." },
      { status: 403 }
    );
  }

  const rawRefresh = await getRefreshTokenCookie();
  if (rawRefresh) {
    await revokeRefreshTokenFromRaw(rawRefresh);
  }

  const res = NextResponse.json({ message: "Logged out" }, { status: 200 });
  clearAuthCookies(res);
  return res;
}
