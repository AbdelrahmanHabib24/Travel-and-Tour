import { NextResponse } from "next/server";
import { prisma } from "@/lib/server/db/prisma";
import { positiveIntIdSchema } from "@/lib/validations/package";

export async function GET(
  _req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const parsedId = positiveIntIdSchema.safeParse(id);
    if (!parsedId.success) {
      return NextResponse.json(
        { error: "Invalid package ID" },
        { status: 400 }
      );
    }

    const pkg = await prisma.package.findUnique({
      where: { id: parsedId.data },
      include: { images: true, comments: true },
    });

    if (!pkg) {
      return NextResponse.json(
        { error: "Package not found" },
        { status: 404 }
      );
    }

    return NextResponse.json(pkg);
  } catch (err) {
    console.error(
      "GET /api/packages/[id] error:",
      err instanceof Error ? err.message : "Unknown error"
    );
    return NextResponse.json(
      { error: "Failed to fetch package" },
      { status: 500 }
    );
  }
}
