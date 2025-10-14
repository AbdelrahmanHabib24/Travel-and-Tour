import { NextResponse } from "next/server";
import { prisma } from "@/app/ulits/prisma";

// GET Comments
export async function GET(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
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
  { params }: { params: Promise<{ id: string }> } 
) {
  const { id } = await params;
  if (!id) return NextResponse.json({ error: "ID missing" }, { status: 400 });

  const body = await req.json();
  const newComment = await prisma.comment.create({
    data: {
      text: body.text,
      userName: body.userName,
      avatarUrl: body.avatarUrl ,
      packageId: Number(id),
    },
  });

  return NextResponse.json(newComment);
}


// PATCH Comment (edit)
export async function PATCH(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  if (!id) return NextResponse.json({ error: "ID missing" }, { status: 400 });

  const body = await req.json();
  if (!body.commentId || !body.text)
    return NextResponse.json({ error: "Missing data" }, { status: 400 });

  const updatedComment = await prisma.comment.update({
    where: { id: Number(body.commentId) },
    data: { text: body.text },
  });

  return NextResponse.json(updatedComment);
}

// DELETE Comment
export async function DELETE(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const url = new URL(req.url);
  const commentId = url.searchParams.get("commentId");

  if (!id || !commentId)
    return NextResponse.json({ error: "Missing data" }, { status: 400 });

  await prisma.comment.delete({
    where: { id: Number(commentId) },
  });

  return NextResponse.json({ message: "Comment deleted successfully" });
}
