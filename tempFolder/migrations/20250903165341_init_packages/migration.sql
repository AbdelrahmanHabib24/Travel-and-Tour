-- CreateTable
CREATE TABLE "public"."Package" (
    "id" SERIAL NOT NULL,
    "URL" TEXT NOT NULL,
    "title1" TEXT NOT NULL,
    "title2" TEXT NOT NULL,
    "price" DOUBLE PRECISION NOT NULL,
    "duration" TEXT NOT NULL,
    "des" TEXT NOT NULL,
    "rating" DOUBLE PRECISION NOT NULL,
    "count" INTEGER NOT NULL,
    "ageRange" TEXT,
    "maxGroupSize" INTEGER,
    "travelDuration" TEXT,
    "startTimeInfo" TEXT,
    "mobileTicket" BOOLEAN NOT NULL,
    "liveGuideLanguages" TEXT[],

    CONSTRAINT "Package_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."Image" (
    "id" SERIAL NOT NULL,
    "url" TEXT NOT NULL,
    "packageId" INTEGER NOT NULL,

    CONSTRAINT "Image_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "public"."Image" ADD CONSTRAINT "Image_packageId_fkey" FOREIGN KEY ("packageId") REFERENCES "public"."Package"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
