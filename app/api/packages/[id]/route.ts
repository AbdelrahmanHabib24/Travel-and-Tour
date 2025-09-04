import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function GET(
  req: Request,
  { params }: { params: { id: string } }
) {
  const { id } = params; 
  console.log("📌 Package API called with id:", id);

  if (!id) {
    return NextResponse.json(
      { error: "ID is missing" },
      { status: 400 }
    );
  }

  const pkg = await prisma.package.findUnique({
    where: { id: Number(id) },
    include: { images: true },
  });

  return NextResponse.json(pkg);
}

