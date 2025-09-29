import { NextResponse } from "next/server";
import { prisma } from "@/app/ulits/prisma";



export async function GET(
  req: Request,
  { params }: { params: Promise<{ id: string }> } 
) {
  const { id } = await params;
  if (!id) return NextResponse.json({ error: "ID missing" }, { status: 400 });

  const pkg = await prisma.package.findUnique({
    where: { id: Number(id) },
    include: { images: true, comments: true },
  });

  if (!pkg)
    return NextResponse.json({ error: "Package not found" }, { status: 404 });

  return NextResponse.json(pkg);
}
