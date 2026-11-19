import React, { useState, useEffect, useMemo } from "react";
import Image from "next/image";
import useEmblaCarousel from "embla-carousel-react";
import Autoplay from "embla-carousel-autoplay";
import { motion } from "framer-motion";
import { useLocale, useTranslations } from "next-intl";
import type { PackageImage } from "../../types";

export interface PackageOverviewProps {
  description?: string;
  galleryImages: PackageImage[];
  title: string;
}

export const PackageOverview: React.FC<PackageOverviewProps> = ({
  description,
  galleryImages,
  title,
}) => {
  const t = useTranslations("package-details");
  const locale = useLocale();
  const isRTL = locale === "ar";
  const hasMultipleImages = galleryImages.length > 1;

  const plugins = useMemo(() => {
    if (!hasMultipleImages) return [];
    return [
      Autoplay({
        delay: 4000,
        stopOnMouseEnter: true,
        stopOnInteraction: false,
      }),
    ];
  }, [hasMultipleImages]);

  const [emblaRef, emblaApi] = useEmblaCarousel(
    {
      loop: hasMultipleImages,
      direction: isRTL ? "rtl" : "ltr",
      duration: 25,
    },
    plugins
  );

  const [selectedIndex, setSelectedIndex] = useState(0);

  useEffect(() => {
    if (!emblaApi) return;

    // Ensure autoplay starts when ready
    const autoplay = emblaApi.plugins()?.autoplay;
    if (autoplay && hasMultipleImages) {
      autoplay.play();
    }

    const onSelect = () => {
      setSelectedIndex(emblaApi.selectedScrollSnap());
    };
    emblaApi.on("select", onSelect);
    return () => {
      emblaApi.off("select", onSelect);
    };
  }, [emblaApi, hasMultipleImages]);

  return (
    <motion.div
      key="overview"
      id="panel-overview"
      role="tabpanel"
      aria-labelledby="tab-overview"
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -8 }}
      transition={{ duration: 0.2 }}
      className="space-y-6 sm:space-y-8"
    >
      {/* Trip Description */}
      {description && (
        <section aria-label={t("overview.aboutTrip")}>
          <p className="text-base sm:text-lg text-gray-700 leading-relaxed whitespace-pre-line">
            {description}
          </p>
        </section>
      )}

      {/* Photos Gallery (when multiple images are available) */}
      {hasMultipleImages && (
        <section aria-label={t("overview.gallery")} className="pt-2">
          <div
            key={locale}
            className="overflow-hidden rounded-2xl shadow-sm ring-1 ring-gray-100"
            ref={emblaRef}
          >
            <div className="flex touch-pan-y">
              {galleryImages.map((img, index) => (
                <div
                  key={img.id}
                  className="relative min-w-0 flex-[0_0_100%] aspect-video bg-gray-100"
                >
                  <Image
                    src={img.url}
                    alt={`${title} - ${index + 1}`}
                    fill
                    sizes="(max-width: 1024px) 100vw, 896px"
                    className="object-cover object-center"
                    loading={index === 0 ? "eager" : "lazy"}
                  />
                </div>
              ))}
            </div>
          </div>

          {/* Pagination Dots */}
          <div
            role="tablist"
            aria-label={t("overview.gallery")}
            className="mt-4 flex items-center justify-center gap-1.5"
          >
            {galleryImages.map((_, index) => {
              const isSelected = selectedIndex === index;
              return (
                <button
                  key={index}
                  type="button"
                  role="tab"
                  aria-selected={isSelected}
                  aria-label={`${t("overview.gallery")} ${index + 1} / ${galleryImages.length}`}
                  onClick={() => {
                    setSelectedIndex(index);
                    emblaApi?.scrollTo(index);
                  }}
                  className="flex h-6 items-center justify-center px-1 rounded-full cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-secondary focus-visible:ring-offset-2"
                >
                  <span
                    className={`block h-2.5 rounded-full transition-all duration-300 ${
                      isSelected
                        ? "w-7 bg-secondary"
                        : "w-2.5 bg-gray-300 hover:bg-gray-400"
                    }`}
                  />
                </button>
              );
            })}
          </div>
        </section>
      )}
    </motion.div>
  );
};

export default PackageOverview;
