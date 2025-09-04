import { PrismaClient } from "@prisma/client";
import { PACKAGE } from "@/app/ulits/type"; 

const prisma = new PrismaClient();

async function main() {
  console.log("🌱 Seeding packages...");

  for (const pkg of PACKAGE) {
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
    ageRange: pkg.ageRange,
    maxGroupSize: pkg.maxGroupSize,
    travelDuration: pkg.travelDuration,
    startTimeInfo: pkg.startTimeInfo,
    mobileTicket: pkg.mobileTicket,
    liveGuideLanguages: pkg.liveGuideLanguages,
    images: {
      create: pkg.images.map((url: string) => ({ url })),
    },
  },
});

  }

  console.log("✅ Packages seeded!");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
