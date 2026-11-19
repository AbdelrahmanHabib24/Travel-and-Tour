import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/server/db/prisma";
import { packageSearchQuerySchema } from "@/lib/validations/package";

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const parsed = packageSearchQuerySchema.safeParse({
      city: searchParams.get("city") ?? undefined,
      maxPrice: searchParams.get("maxPrice") ?? undefined,
    });

    if (!parsed.success) {
      return NextResponse.json(
        { error: "Invalid search query parameters" },
        { status: 400 }
      );
    }

    const { city, maxPrice } = parsed.data;

    const packages = await prisma.package.findMany({
      where: {
        OR: [
          { title1: { contains: city, mode: "insensitive" } },
          { title2: { contains: city, mode: "insensitive" } },
        ],
        price: { lte: maxPrice },
      },
      include: { images: true },
    });

    return NextResponse.json(packages);
  } catch (err) {
    console.error(
      "GET /api/packages error:",
      err instanceof Error ? err.message : "Unknown error"
    );
    return NextResponse.json(
      { error: "Failed to fetch packages" },
      { status: 500 }
    );
  }
}
