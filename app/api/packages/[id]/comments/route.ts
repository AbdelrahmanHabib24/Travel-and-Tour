import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();
// GET Comments
export async function GET(
  req: Request,
  { params }: { params: Promise<{ id: string }> } // ⚡ params نوعه Promise
) {
  const { id } = await params;
  if (!id) return NextResponse.json({ error: "ID missing" }, { status: 400 });

  const comments = await prisma.comment.findMany({
    where: { packageId: Number(id) },
    orderBy: { createdAt: "desc" },
  });

  return NextResponse.json(comments);
}

// POST Comment
export async function POST(
  req: Request,
  { params }: { params: Promise<{ id: string }> } // ⚡ params نوعه Promise
) {
  const { id } = await params;
  if (!id) return NextResponse.json({ error: "ID missing" }, { status: 400 });

  const body = await req.json();
  const newComment = await prisma.comment.create({
    data: {
      text: body.text,
      userName: body.userName,
      avatarUrl: body.avatarUrl || "",
      packageId: Number(id),
    },
  });

  return NextResponse.json(newComment);
}
