import { NextResponse } from "next/server";
import bcrypt from "bcrypt";
import { prisma } from "@/lib/server/db/prisma";
import { getJwtSecret } from "@/lib/server/config/env";
import {
  issueRefreshTokenSession,
  signAccessToken,
} from "@/lib/server/auth/tokens";
import {
  isSameOriginRequest,
  prismaRefreshTokenStore,
  setAuthCookies,
} from "@/lib/server/auth/session";
import { loginSchema } from "@/features/auth/validation/authSchemas";

export async function POST(req: Request) {
  try {
    if (!isSameOriginRequest(req)) {
      return NextResponse.json(
        { message: "Invalid request origin." },
        { status: 403 }
      );
    }

    const body = await req.json().catch(() => null);
    const result = loginSchema.safeParse(body);
    if (!result.success) {
      return NextResponse.json(
        {
          message: "There was a problem",
          errors: result.error.flatten().fieldErrors,
        },
        { status: 400 }
      );
    }

    const { email, password } = result.data;
    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) {
      return NextResponse.json(
        {
          errors: {
            email: ["No account is registered with this email address."],
          },
          message: "There was a problem",
        },
        { status: 404 }
      );
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return NextResponse.json(
        {
          errors: { password: ["The password you entered is incorrect."] },
          message: "There was a problem",
        },
        { status: 401 }
      );
    }

    const authUser = {
      id: user.id,
      email: user.email,
      username: user.username,
    };

    const accessToken = signAccessToken(authUser, getJwtSecret());
    const { rawRefreshToken } = await issueRefreshTokenSession(
      prismaRefreshTokenStore,
      authUser
    );

    const res = NextResponse.json({
      message: "Login successful.",
      user: authUser,
    });

    setAuthCookies(res, accessToken, rawRefreshToken);
    return res;
  } catch (err) {
    console.error("Login error:", err instanceof Error ? err.message : "Unknown error");
    return NextResponse.json(
      { message: "There was a problem. Please try again later." },
      { status: 500 }
    );
  }
}
