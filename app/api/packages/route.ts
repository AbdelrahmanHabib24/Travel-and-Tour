import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/app/ulits/prisma";

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const city = searchParams.get("city") || "";
    const maxPrice = parseFloat(searchParams.get("maxPrice") || "5000");

    const packagesRaw = await prisma.package.findMany({
      where: {
        OR: [
          { title1: { contains: city, mode: "insensitive" } },
          { title2: { contains: city, mode: "insensitive" } },
        ],
        price: { lte: maxPrice },
      },
      include: { images: true },
    });

    const packages = packagesRaw.filter(
      (pkg, index, self) => index === self.findIndex((p) => p.id === pkg.id)
    );

    return NextResponse.json(packages);

  } catch (err) {
    console.error(err);
    return NextResponse.json(
      { error: "Failed to fetch packages" },
      { status: 500 }
    );
  }
}
