import { Prisma, PrismaClient } from "@prisma/client";
import { PACKAGE, type ItineraryItem } from "@/prisma/data/staticPackages";

interface SeedPackage {
  id: string;
  URL: string;
  title1: string;
  title2: string;
  price: string | number;
  currency?: string;
  duration: string;
  durationDays?: number;
  durationNights?: number | null;
  itinerary?: ItineraryItem[];
  isSampleData?: boolean;
  des: string;
  rating: number;
  count: number;
  ageRange?: string | null;
  maxGroupSize?: number | null;
  travelDuration?: string | null;
  startTimeInfo?: string | null;
  mobileTicket?: boolean;
  liveGuideLanguages?: string[];
  images?: string[];
}

const prisma = new PrismaClient();

async function main() {
  const allPackages: SeedPackage[] = [...PACKAGE];

  for (const pkg of allPackages) {
    await prisma.package.create({
      data: {
        URL: pkg.URL.replace(/\.(jpg|jpeg|png)$/i, ".webp"),
        title1: pkg.title1,
        title2: pkg.title2,
        price: Number(pkg.price),
        currency: pkg.currency ?? "USD",
        duration: pkg.duration,
        durationDays: pkg.durationDays ?? 3,
        durationNights: pkg.durationNights ?? null,
        itinerary: pkg.itinerary
          ? (pkg.itinerary as unknown as Prisma.InputJsonValue)
          : undefined,
        isSampleData: pkg.isSampleData ?? true,
        des: pkg.des,
        rating: pkg.rating,
        count: pkg.count,
        ageRange: pkg.ageRange ?? null,
        maxGroupSize: pkg.maxGroupSize ?? null,
        travelDuration: pkg.travelDuration ?? null,
        startTimeInfo: pkg.startTimeInfo ?? null,
        mobileTicket: pkg.mobileTicket ?? false,
        liveGuideLanguages: pkg.liveGuideLanguages ?? [],
        images: pkg.images
          ? {
              create: pkg.images.map((url: string) => ({
                url: url.replace(/\.(jpg|jpeg|png)$/i, ".webp"),
              })),
            }
          : undefined,
      },
    });
  }
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
