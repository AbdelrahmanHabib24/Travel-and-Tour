import { NextResponse } from "next/server";
import { prisma } from "@/app/ulits/prisma";

export async function GET(
  req: Request,
  paramsPromise: { params: Promise<{ sessionId: string }> }
) {
  try {
    const { params } = paramsPromise;
    const { sessionId } = await params;

    const session = await prisma.paymentSession.findUnique({
      where: { id: sessionId },
      select: { paymentToken: true, amount: true },
    });

    if (!session) {
      return NextResponse.json({ error: "Session not found" }, { status: 404 });
    }

    return NextResponse.json(session);
  } catch (err: any) {
    console.error("API error:", err);
    return NextResponse.json(
      { error: "Failed to fetch payment session", details: err.message },
      { status: 500 }
    );
  }
}
