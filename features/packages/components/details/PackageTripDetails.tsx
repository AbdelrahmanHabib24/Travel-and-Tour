import React from "react";
import { motion } from "framer-motion";
import { useLocale, useTranslations } from "next-intl";
import { LuCalendarDays } from "react-icons/lu";
import type { TripProperty } from "../../types";

export interface PackageTripDetailsProps {
  properties: TripProperty[];
  hasItinerary: boolean;
  itineraryDaysCount?: number;
  onOpenItinerary: () => void;
  itineraryTriggerRef?: React.RefObject<HTMLButtonElement | null>;
}

export const PackageTripDetails: React.FC<PackageTripDetailsProps> = ({
  properties,
  hasItinerary,
  itineraryDaysCount = 0,
  onOpenItinerary,
  itineraryTriggerRef,
}) => {
  const t = useTranslations("package-details");
  const locale = useLocale();
  const isRTL = locale === "ar";

  return (
    <motion.div
      key="details"
      id="panel-details"
      role="tabpanel"
      aria-labelledby="tab-details"
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -8 }}
      transition={{ duration: 0.2 }}
      className="space-y-6"
    >
      {/* 3 columns x 2 rows on desktop, 2 on tablet, 1 on mobile */}
      <section
        aria-label={t("highlights.additionalInfo")}
        className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3.5"
      >
        {properties.map(({ icon: Icon, label, value }) => (
          <div
            key={label}
            className="flex items-center gap-3.5 p-4 rounded-2xl bg-white border border-gray-200/90 shadow-xs hover:border-orange-300 hover:shadow-md transition-all duration-200"
          >
            <div className="w-11 h-11 rounded-xl bg-orange-50 border border-orange-100 flex items-center justify-center shrink-0 text-orange-600">
              <Icon className="w-5 h-5" />
            </div>
            <div className="min-w-0 flex-1">
              <span className="block text-xs font-semibold text-gray-500 tracking-wide truncate mb-0.5">
                {label}
              </span>
              <span
                className="block text-sm sm:text-base font-bold text-gray-900 truncate"
                title={value}
              >
                {value}
              </span>
            </div>
          </div>
        ))}
      </section>

      {/* Day-by-Day Itinerary Action Button */}
      {hasItinerary && (
        <div className="pt-2 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 p-4 sm:p-5 rounded-2xl bg-orange-50/50 border border-orange-100/80">
          <div className="min-w-0">
            <h3 className="text-sm sm:text-base font-bold text-gray-900">
              {t("itinerary.title")}
            </h3>
            <p className="text-xs text-gray-500 mt-0.5">
              {isRTL
                ? `${itineraryDaysCount} أيام • عرض تفاصيل وأنشطة كل يوم بالتفصيل`
                : `${itineraryDaysCount} ${
                    itineraryDaysCount === 1 ? "Day" : "Days"
                  } • Explore daily activities & stops on demand`}
            </p>
          </div>

          <button
            ref={itineraryTriggerRef}
            type="button"
            onClick={onOpenItinerary}
            className="inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-full border border-orange-500 bg-white hover:bg-orange-500 text-orange-600 hover:text-white font-semibold text-sm transition-all duration-200 shadow-2xs cursor-pointer shrink-0"
          >
            <LuCalendarDays className="w-4 h-4" />
            <span>{t("itinerary.viewItinerary")}</span>
          </button>
        </div>
      )}
    </motion.div>
  );
};

export default PackageTripDetails;

