// src/app/api/auth/login/route.ts
import { NextResponse } from "next/server";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { prisma } from "@/app/ulits/prisma";
import { loginSchema } from "@/app/ulits/zod";

const JWT_SECRET = process.env.JWT_SECRET as string;

export async function POST(req: Request) {
  try {
    const body = await req.json();

    // ✅ Validate request body
    const result = loginSchema.safeParse(body);
    if (!result.success) {
      return NextResponse.json(
        {
          message: "Enter a valid email and password.",
          errors: result.error.flatten().fieldErrors,
        },
        { status: 400 }
      );
    }

    const { email, password } = result.data;

    // ✅ Find user
    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) {
      return NextResponse.json(
        {
          errors: { email: ["No account found. Please sign up first."] },
          message: "No account found",
        },
        { status: 404 }
      );
    }

    // ✅ Check password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return NextResponse.json(
        {
          errors: { password: ["Incorrect password."] },
          message: "Incorrect password",
        },
        { status: 401 }
      );
    }

    // ✅ Generate Access Token
    const accessToken = jwt.sign(
      { id: user.id, email: user.email },
      JWT_SECRET,
      { expiresIn: "15m" }
    );

    // ✅ Generate Refresh Token
    const refreshToken = jwt.sign({ id: user.id }, JWT_SECRET, {
      expiresIn: "7d",
    });

    // ✅ Prepare response
    const res = NextResponse.json({
      message: "Login successful.",
      user: { id: user.id, email: user.email, username: user.username },
      accessToken,
    });

    // Store accessToken in httpOnly cookie
    res.cookies.set("authToken", accessToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      maxAge: 15 * 60, // 15 دقيقة
      path: "/",
    });

    // ✅ Store refresh token in httpOnly cookie
    res.cookies.set("refreshToken", refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      maxAge: 7 * 24 * 60 * 60,
      path: "/",
    });

    return res;
  } catch (err) {
    console.error("Login error:", err);
    return NextResponse.json(
      { message: "Server error. Please try again later." },
      { status: 500 }
    );
  }
}
