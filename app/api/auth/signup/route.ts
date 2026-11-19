import { NextResponse } from "next/server";
import bcrypt from "bcrypt";
import { prisma } from "@/lib/server/db/prisma";
import { isSameOriginRequest } from "@/lib/server/auth/session";
import { serverSignupSchema } from "@/features/auth/validation/authSchemas";

export async function POST(req: Request) {
  try {
    if (!isSameOriginRequest(req)) {
      return NextResponse.json(
        { errors: { general: ["Invalid request origin."] } },
        { status: 403 }
      );
    }

    const body = await req.json().catch(() => null);
    const parsed = serverSignupSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json(
        { errors: parsed.error.flatten().fieldErrors },
        { status: 400 }
      );
    }

    const { username, email, password } = parsed.data;

    const existingUsername = await prisma.user.findUnique({ where: { username } });
    if (existingUsername) {
      return NextResponse.json(
        { errors: { username: ["Username already exists."] } },
        { status: 409 }
      );
    }

    const existingEmail = await prisma.user.findUnique({ where: { email } });
    if (existingEmail) {
      return NextResponse.json(
        { errors: { email: ["Email already exists."] } },
        { status: 409 }
      );
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await prisma.user.create({
      data: { username, email, password: hashedPassword },
      select: { id: true, username: true, email: true, createdAt: true },
    });

    return NextResponse.json({ user }, { status: 201 });
  } catch (err) {
    console.error("Signup error:", err instanceof Error ? err.message : "Unknown error");
    return NextResponse.json(
      { errors: { general: ["Server error."] } },
      { status: 500 }
    );
  }
}
