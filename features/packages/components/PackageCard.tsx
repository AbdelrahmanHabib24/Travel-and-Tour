"use client";

import React from "react";
import Image from "next/image";
import Link from "next/link";
import { SlLocationPin } from "react-icons/sl";
import { RiTimeLine } from "react-icons/ri";
import { useLocale, useTranslations } from "next-intl";
import StarRating from "@/components/ui/StarRating";
import { localizePackage } from "@/lib/i18n/packageLocalization";
import type { PackageRecord } from "../types";

export interface PackageCardProps {
  pkg: PackageRecord;
  index?: number;
  onPrefetch?: () => void;
  aosDelay?: number;
}

const PackageCard: React.FC<PackageCardProps> = ({
  pkg: rawPkg,
  index,
  onPrefetch,
  aosDelay,
}) => {
  const locale = useLocale();
  const t = useTranslations("packages-listing");
  const pkg = localizePackage(rawPkg, locale === "ar" ? "ar" : "en");
  const priority = typeof index === "number" && index < 3;

  return (
    <article
      data-aos={aosDelay !== undefined ? "zoom-in" : undefined}
      data-aos-delay={aosDelay}
      className="p-3 border rounded-xl shadow-md hover:shadow-lg transition duration-300 relative group flex flex-col h-full bg-white"
    >
      <Link
        href={`/packages/${rawPkg.id}`}
        aria-label={t("viewDetailsFor", { title: pkg.title })}
        prefetch
        className="flex flex-col h-full"
        onMouseEnter={onPrefetch}
      >
        {/* 16:9 Image container */}
        <div className="relative w-full aspect-video overflow-hidden rounded-lg mb-4 bg-gray-100">
          <Image
            src={rawPkg.URL || "/placeholder.webp"}
            alt={pkg.title || t("packageImage")}
            fill
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
            className="object-cover rounded-lg group-hover:scale-105 transition-transform duration-300"
            quality={90}
            priority={priority}
            loading={priority ? undefined : "lazy"}
            placeholder="blur"
            blurDataURL="/placeholder.webp"
          />
        </div>

        {/* Title & Location */}
        <h4 className="text-lg lg:text-xl font-bold mb-1 text-gray-900 line-clamp-1">
          {pkg.title}
        </h4>
        <div className="flex items-center gap-1.5 text-gray-600 mb-2">
          <SlLocationPin className="text-secondary shrink-0" />
          <span className="text-sm font-medium">{pkg.destination}</span>
        </div>

        {/* Description clamped to approx 3 lines, flex-grow to push footer down */}
        <p className="text-sm text-gray-600 mb-4 line-clamp-3 flex-grow leading-relaxed">
          {pkg.description}
        </p>

        {/* Dedicated Card Footer with Rating, Duration, and Price */}
        <footer className="border-t pt-3 mt-auto flex flex-col gap-2">
          <div className="flex justify-between items-center">
            <StarRating rating={pkg.ratings} count={pkg.reviews_count} />
            {pkg.durationFormatted ? (
              <div className="flex items-center gap-1.5 text-xs text-gray-500 font-medium">
                <RiTimeLine className="text-secondary shrink-0" />
                <span>{pkg.durationFormatted}</span>
              </div>
            ) : null}
          </div>
          <div className="flex justify-between items-center pt-1 border-t border-gray-100">
            <span className="text-xs text-gray-500 font-medium">
              {t("startingFrom")}
            </span>
            <span className="text-base sm:text-lg font-extrabold text-secondary tracking-tight">
              {pkg.priceFormatted}{" "}
              {locale === "ar" ? "دولار" : rawPkg.currency || "USD"}
            </span>
          </div>
        </footer>
      </Link>
    </article>
  );
};

export default React.memo(PackageCard);