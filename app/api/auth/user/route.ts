import { NextResponse } from "next/server";
import jwt from "jsonwebtoken";
import cookie from "cookie";

export async function GET(req: Request) {
  const cookies = cookie.parse(req.headers.get("cookie") || "");
  const token = cookies.authToken;

  if (!token) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET as string);
    return NextResponse.json({ user: decoded }, { status: 200 });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ message: "Invalid token" }, { status: 401 });
  }
}
