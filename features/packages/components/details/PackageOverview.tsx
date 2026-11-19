import React, { useMemo } from "react";
import Image from "next/image";
import Slider from "react-slick";
import { motion } from "framer-motion";
import { useLocale, useTranslations } from "next-intl";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
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

  const sliderSettings = useMemo(
    () => ({
      dots: true,
      infinite: galleryImages.length > 1,
      arrows: false,
      speed: 500,
      slidesToShow: 1,
      slidesToScroll: 1,
      autoplay: false,
      rtl: isRTL,
    }),
    [isRTL, galleryImages.length]
  );

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
      {galleryImages.length > 1 && (
        <section aria-label={t("overview.gallery")} className="pt-2">
          <div className="rounded-2xl overflow-hidden shadow-sm border border-gray-100">
            <Slider key={locale} {...sliderSettings}>
              {galleryImages.map((img) => (
                <div key={img.id}>
                  <div className="relative h-[240px] sm:h-[340px] md:h-[400px] w-full">
                    <Image
                      src={img.url}
                      alt={title}
                      fill
                      sizes="(max-width: 1024px) 100vw, 896px"
                      className="object-cover"
                      loading="lazy"
                    />
                  </div>
                </div>
              ))}
            </Slider>
          </div>
        </section>
      )}
    </motion.div>
  );
};

export default PackageOverview;
