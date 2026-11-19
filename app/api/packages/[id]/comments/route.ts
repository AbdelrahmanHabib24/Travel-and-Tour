import { NextResponse } from "next/server";
import { prisma } from "@/lib/server/db/prisma";
import {
  isSameOriginRequest,
  resolveAuthenticatedSession,
} from "@/lib/server/auth/session";
import {
  createCommentSchema,
  deleteCommentSchema,
  editCommentSchema,
} from "@/lib/validations/comment";
import { positiveIntIdSchema } from "@/lib/validations/package";

// GET Comments
export async function GET(
  _req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const parsedId = positiveIntIdSchema.safeParse(id);
    if (!parsedId.success) {
      return NextResponse.json({ error: "Invalid package ID" }, { status: 400 });
    }

    const comments = await prisma.comment.findMany({
      where: { packageId: parsedId.data },
      orderBy: { createdAt: "desc" },
    });

    return NextResponse.json(comments);
  } catch (err) {
    console.error("GET comments error:", err instanceof Error ? err.message : "Unknown error");
    return NextResponse.json(
      { error: "Failed to load comments" },
      { status: 500 }
    );
  }
}

// POST Comment (authenticated; author identity derived strictly from verified session)
export async function POST(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    if (!isSameOriginRequest(req)) {
      return NextResponse.json({ error: "Invalid request origin" }, { status: 403 });
    }

    const { user, applyCookies } = await resolveAuthenticatedSession();
    if (!user) {
      return applyCookies(
        NextResponse.json({ error: "Authentication required" }, { status: 401 })
      );
    }

    const { id } = await params;
    const parsedId = positiveIntIdSchema.safeParse(id);
    if (!parsedId.success) {
      return applyCookies(
        NextResponse.json({ error: "Invalid package ID" }, { status: 400 })
      );
    }

    const body = await req.json().catch(() => null);
    const parsedBody = createCommentSchema.safeParse(body);
    if (!parsedBody.success) {
      return applyCookies(
        NextResponse.json(
          { error: "Invalid comment payload", details: parsedBody.error.flatten().fieldErrors },
          { status: 400 }
        )
      );
    }

    const pkg = await prisma.package.findUnique({
      where: { id: parsedId.data },
      select: { id: true },
    });
    if (!pkg) {
      return applyCookies(
        NextResponse.json({ error: "Package not found" }, { status: 404 })
      );
    }

    const newComment = await prisma.comment.create({
      data: {
        text: parsedBody.data.text,
        userName: user.username,
        userId: user.id,
        avatarUrl: parsedBody.data.avatarUrl ?? null,
        packageId: parsedId.data,
      },
    });

    return applyCookies(NextResponse.json(newComment, { status: 201 }));
  } catch (err) {
    console.error("POST comment error:", err instanceof Error ? err.message : "Unknown error");
    return NextResponse.json(
      { error: "Failed to create comment" },
      { status: 500 }
    );
  }
}

// PATCH / PUT Comment (immutable userId ownership + package scope check)
export async function PATCH(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    if (!isSameOriginRequest(req)) {
      return NextResponse.json({ error: "Invalid request origin" }, { status: 403 });
    }

    const { user, applyCookies } = await resolveAuthenticatedSession();
    if (!user) {
      return applyCookies(
        NextResponse.json({ error: "Authentication required" }, { status: 401 })
      );
    }

    const { id } = await params;
    const parsedId = positiveIntIdSchema.safeParse(id);
    if (!parsedId.success) {
      return applyCookies(
        NextResponse.json({ error: "Invalid package ID" }, { status: 400 })
      );
    }

    const body = await req.json().catch(() => null);
    const parsedBody = editCommentSchema.safeParse(body);
    if (!parsedBody.success) {
      return applyCookies(
        NextResponse.json(
          { error: "Invalid edit payload", details: parsedBody.error.flatten().fieldErrors },
          { status: 400 }
        )
      );
    }

    const existing = await prisma.comment.findUnique({
      where: { id: parsedBody.data.commentId },
      select: { id: true, packageId: true, userId: true },
    });

    if (!existing || existing.packageId !== parsedId.data) {
      return applyCookies(
        NextResponse.json({ error: "Comment not found" }, { status: 404 })
      );
    }

    // Strict immutable ownership check; legacy comments with userId === null remain read-only
    if (existing.userId === null || existing.userId !== user.id) {
      return applyCookies(
        NextResponse.json(
          { error: "You are not authorized to edit this comment" },
          { status: 403 }
        )
      );
    }

    const updatedComment = await prisma.comment.update({
      where: { id: existing.id },
      data: { text: parsedBody.data.text },
    });

    return applyCookies(NextResponse.json(updatedComment));
  } catch (err) {
    console.error("PATCH comment error:", err instanceof Error ? err.message : "Unknown error");
    return NextResponse.json(
      { error: "Failed to update comment" },
      { status: 500 }
    );
  }
}

export const PUT = PATCH;

// DELETE Comment (immutable userId ownership + package scope check)
export async function DELETE(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    if (!isSameOriginRequest(req)) {
      return NextResponse.json({ error: "Invalid request origin" }, { status: 403 });
    }

    const { user, applyCookies } = await resolveAuthenticatedSession();
    if (!user) {
      return applyCookies(
        NextResponse.json({ error: "Authentication required" }, { status: 401 })
      );
    }

    const { id } = await params;
    const parsedId = positiveIntIdSchema.safeParse(id);
    if (!parsedId.success) {
      return applyCookies(
        NextResponse.json({ error: "Invalid package ID" }, { status: 400 })
      );
    }

    const url = new URL(req.url);
    let rawCommentId: unknown = url.searchParams.get("commentId");
    if (!rawCommentId) {
      const body = await req.json().catch(() => null);
      if (body && typeof body === "object" && "commentId" in body) {
        rawCommentId = (body as { commentId?: unknown }).commentId;
      }
    }

    const parsedDelete = deleteCommentSchema.safeParse({ commentId: rawCommentId });
    if (!parsedDelete.success) {
      return applyCookies(
        NextResponse.json({ error: "Invalid comment ID" }, { status: 400 })
      );
    }

    const existing = await prisma.comment.findUnique({
      where: { id: parsedDelete.data.commentId },
      select: { id: true, packageId: true, userId: true },
    });

    if (!existing || existing.packageId !== parsedId.data) {
      return applyCookies(
        NextResponse.json({ error: "Comment not found" }, { status: 404 })
      );
    }

    // Strict immutable ownership check; legacy comments with userId === null remain read-only
    if (existing.userId === null || existing.userId !== user.id) {
      return applyCookies(
        NextResponse.json(
          { error: "You are not authorized to delete this comment" },
          { status: 403 }
        )
      );
    }

    await prisma.comment.delete({
      where: { id: existing.id },
    });

    return applyCookies(
      NextResponse.json({ message: "Comment deleted successfully" })
    );
  } catch (err) {
    console.error("DELETE comment error:", err instanceof Error ? err.message : "Unknown error");
    return NextResponse.json(
      { error: "Failed to delete comment" },
      { status: 500 }
    );
  }
}
