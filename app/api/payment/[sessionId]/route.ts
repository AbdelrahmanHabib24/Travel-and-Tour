import { NextResponse } from "next/server";
import { prisma } from "@/lib/server/db/prisma";
import { resolveAuthenticatedSession } from "@/lib/server/auth/session";

export async function GET(
  _req: Request,
  paramsPromise: { params: Promise<{ sessionId: string }> }
) {
  try {
    const { user, applyCookies } = await resolveAuthenticatedSession();
    if (!user) {
      return applyCookies(
        NextResponse.json(
          { error: "Authentication required" },
          { status: 401 }
        )
      );
    }

    const { params } = paramsPromise;
    const { sessionId } = await params;

    if (!sessionId || sessionId.trim().length === 0) {
      return applyCookies(
        NextResponse.json({ error: "Invalid session ID" }, { status: 400 })
      );
    }

    const session = await prisma.paymentSession.findUnique({
      where: { id: sessionId },
      select: {
        paymentToken: true,
        amount: true,
        order: {
          select: { userId: true, status: true },
        },
      },
    });

    if (!session) {
      return applyCookies(
        NextResponse.json({ error: "Session not found" }, { status: 404 })
      );
    }

    if (session.order.userId !== user.id) {
      return applyCookies(
        NextResponse.json(
          { error: "You are not authorized to access this payment session" },
          { status: 403 }
        )
      );
    }

    return applyCookies(
      NextResponse.json({
        paymentToken: session.paymentToken,
        amount: session.amount,
        status: session.order.status,
      })
    );
  } catch (err) {
    console.error(
      "Payment session GET error:",
      err instanceof Error ? err.message : "Unknown error"
    );
    return NextResponse.json(
      { error: "Failed to fetch payment session" },
      { status: 500 }
    );
  }
}
