import React from "react";
import Image from "next/image";
import Link from "next/link";
import { useLocale } from "next-intl";
import { localizePackage, formatPackagePrice } from "@/lib/i18n/packageLocalization";
import type { PackageRecord } from "../types";

export interface ChatPackageCardProps {
  pkg: PackageRecord;
  viewDetailsLabel: string;
  durationUnavailableLabel: string;
}

export const ChatPackageCard: React.FC<ChatPackageCardProps> = ({
  pkg,
  viewDetailsLabel,
  durationUnavailableLabel,
}) => {
  const locale = useLocale();
  const localizedPkg = localizePackage(pkg, locale as "en" | "ar");
  const hasRating = typeof pkg.rating === "number" && pkg.rating > 0;
  const hasImage = typeof pkg.URL === "string" && pkg.URL.trim().length > 0;
  const hasDescription = typeof localizedPkg.des === "string" && localizedPkg.des.trim().length > 0;
  const formattedPrice =
    localizedPkg.priceWithCurrency ||
    formatPackagePrice(pkg.price, locale, pkg.currency);

  return (
    <div
      className="bg-white rounded-2xl p-2.5 border border-[#E2E8F0] shadow-[0_4px_14px_rgba(16,45,64,0.05)] hover:shadow-[0_6px_18px_rgba(7,150,165,0.14)] transition-all duration-200 flex items-stretch gap-3"
    >
      {/* Real Destination Image (when available) */}
      {hasImage && (
        <div className="w-[104px] h-[94px] rounded-xl overflow-hidden shrink-0 bg-[#F1F5F9] self-center">
          <Image
            src={pkg.URL}
            alt={`${localizedPkg.title1} – ${localizedPkg.title2}`}
            width={104}
            height={94}
            className="w-full h-full object-cover"
          />
        </div>
      )}

      {/* Real Database Package Details */}
      <div
        className="flex-1 min-w-0 flex flex-col justify-between text-start"
      >
        <div>
          <div className="flex items-start justify-between gap-1.5">
            <h4 className="font-bold text-[13.5px] text-[#102D40] leading-snug truncate">
              {localizedPkg.title1}
            </h4>
            {hasRating && (
              <span
                className="dir-ltr inline-flex items-center gap-0.5 px-1.5 py-0.5 rounded-md bg-amber-50 text-amber-700 text-[11px] font-bold shrink-0"
              >
                <span aria-hidden="true">★</span>
                <span>{Number(pkg.rating).toFixed(1)}</span>
              </span>
            )}
          </div>

          {/* Country / Location & Duration */}
          <div className="flex flex-wrap items-center gap-x-2.5 gap-y-0.5 text-[11.5px] text-[#64748B] mt-0.5">
            {localizedPkg.title2 && (
              <span className="font-medium text-[#07566B]">
                {localizedPkg.title2}
              </span>
            )}
            <span className="inline-flex items-center gap-1">
              <svg
                viewBox="0 0 20 20"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.8"
                className="w-3 h-3 text-[#64748B] shrink-0"
              >
                <rect
                  x="3"
                  y="4"
                  width="14"
                  height="13"
                  rx="2"
                />
                <path d="M3 8h14M7 2v3M13 2v3" />
              </svg>
              <span>
                {localizedPkg.duration && localizedPkg.duration.trim().length > 0
                  ? localizedPkg.duration.trim()
                  : durationUnavailableLabel}
              </span>
            </span>
          </div>

          {/* Short Relevant Description (when available) */}
          {hasDescription && (
            <p className="text-[11.5px] text-[#64748B] line-clamp-1 mt-1 leading-snug">
              {localizedPkg.des}
            </p>
          )}
        </div>

        <div className="flex items-center justify-between gap-2 mt-2 pt-1 border-t border-[#F1F5F9]">
          <span
            className="text-[14.5px] font-extrabold text-[#0796A5]"
          >
            {formattedPrice}
          </span>
          <Link
            href={`/packages/${pkg.id}`}
            className="px-2.5 py-1 rounded-full border border-[#0796A5] bg-[#E3F5F6]/50 hover:bg-[#0796A5] text-[#07566B] hover:text-white text-[11px] font-bold transition-colors whitespace-nowrap"
          >
            {viewDetailsLabel}
          </Link>
        </div>
      </div>
    </div>
  );
};
