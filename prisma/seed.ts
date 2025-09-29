import { PrismaClient } from "@prisma/client";
import {  PACKAGE } from "@/app/ulits/type";

const prisma = new PrismaClient();

async function main() {

  const allPackages = [ ...PACKAGE];

  for (const pkg of allPackages) {
    await prisma.package.create({
      data: {
        URL: pkg.URL,
        title1: pkg.title1,
        title2: pkg.title2,
        price: Number(pkg.price),
        duration: pkg.duration,
        des: pkg.des,
        rating: pkg.rating,
        count: pkg.count,
        ageRange: (pkg as any).ageRange ?? null,
        maxGroupSize: (pkg as any).maxGroupSize ?? null,
        travelDuration: (pkg as any).travelDuration ?? null,
        startTimeInfo: (pkg as any).startTimeInfo ?? null,
        mobileTicket: (pkg as any).mobileTicket ?? false, 
        liveGuideLanguages: (pkg as any).liveGuideLanguages ?? [],
        images: pkg.images
          ? { create: pkg.images.map((url: string) => ({ url })) }
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
