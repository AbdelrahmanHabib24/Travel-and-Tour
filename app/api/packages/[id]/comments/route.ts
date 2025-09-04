import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function GET(
  req: Request,
  { params }: { params: { id: string } }
) {
  const { id } = params;
  const comments = await prisma.comment.findMany({
    where: { packageId: Number(id) },
    orderBy: { createdAt: "desc" },
  });
  return NextResponse.json(comments);
}

export async function POST(
  req: Request,
  { params }: { params: { id: string } }
) {
  const { id } = params;
  const body = await req.json();

  const newComment = await prisma.comment.create({
    data: {
      text: body.text,
      userName: body.userName,
      avatarUrl: body.avatarUrl,
      packageId: Number(id),
    },
  });

  return NextResponse.json(newComment);
}