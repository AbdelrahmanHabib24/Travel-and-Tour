import React from "react";
import Image from "next/image";
import { motion } from "framer-motion";
import { useTranslations } from "next-intl";
import { LuMapPin, LuClock } from "react-icons/lu";

export interface PackageHeroProps {
  title: string;
  destination?: string;
  heroImage: string;
  duration?: string;
  hasPrice: boolean;
  priceDisplay: string;
  isProcessing: boolean;
  onReserve: () => void;
}

export const PackageHero: React.FC<PackageHeroProps> = ({
  title,
  destination,
  heroImage,
  duration,
  hasPrice,
  priceDisplay,
  isProcessing,
  onReserve,
}) => {
  const t = useTranslations("package-details");

  return (
    <section
      aria-label={title}
      className="relative w-full h-[380px] sm:h-[440px] md:h-[480px] lg:h-[520px] flex items-center justify-center overflow-hidden"
    >
      <Image
        src={heroImage}
        alt={title}
        fill
        sizes="100vw"
        className="object-cover"
        priority
        quality={90}
      />
      {/* Subtle dark gradient overlay to ensure text readability */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/45 to-black/30" />

      <div className="relative z-10 max-w-4xl mx-auto px-4 sm:px-6 text-center text-white flex flex-col items-center pt-12 sm:pt-16">
        {/* Destination label */}
        {destination && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
            className="inline-flex items-center gap-1.5 text-orange-300 text-xs sm:text-sm font-semibold tracking-wide mb-3 drop-shadow-sm"
          >
            <LuMapPin className="w-3.5 h-3.5 text-orange-400 drop-shadow-sm" />
            <span>{destination}</span>
          </motion.div>
        )}

        {/* Package Title Centered */}
        <motion.h1
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-extrabold tracking-tight drop-shadow-md leading-tight max-w-3xl"
        >
          {title}
        </motion.h1>

        {/* Key metadata line with NO unnecessary icon next to currency */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="mt-3 flex flex-wrap items-center justify-center gap-x-4 gap-y-1 text-sm sm:text-base text-gray-200 font-medium"
        >
          {duration && (
            <span className="flex items-center gap-1.5">
              <LuClock className="text-orange-400 text-sm" />
              <span>{duration}</span>
            </span>
          )}
          {hasPrice && (
            <span className="text-white font-bold text-base sm:text-lg">
              {priceDisplay}
            </span>
          )}
        </motion.div>

        {/* Prominent, Elegant Reserve Now Button */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
        >
          <button
            type="button"
            onClick={onReserve}
            disabled={isProcessing}
            aria-busy={isProcessing}
            className="mt-6 sm:mt-7 px-8 sm:px-12 py-3 sm:py-3.5 rounded-full bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white font-bold text-base sm:text-lg shadow-lg shadow-orange-500/30 hover:shadow-orange-500/50 hover:scale-105 active:scale-95 transition-all duration-200 cursor-pointer disabled:opacity-75 disabled:cursor-not-allowed flex items-center justify-center gap-2"
          >
            {isProcessing ? (
              <>
                <svg
                  className="animate-spin h-5 w-5 text-white"
                  viewBox="0 0 24 24"
                  fill="none"
                >
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                  />
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8v8H4z"
                  />
                </svg>
                <span>{t("booking.processing")}</span>
              </>
            ) : (
              <span>{t("booking.reserve")}</span>
            )}
          </button>
        </motion.div>
      </div>
    </section>
  );
};

export default PackageHero;

