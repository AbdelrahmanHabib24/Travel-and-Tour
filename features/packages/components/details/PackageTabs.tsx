import React, { useMemo } from "react";
import { motion } from "framer-motion";
import { useLocale, useTranslations } from "next-intl";
import type { TabId } from "../../types";

export interface PackageTabsProps {
  activeTab: TabId;
  onTabChange: (tab: TabId) => void;
  tabRefs?: React.MutableRefObject<(HTMLButtonElement | null)[]>;
}

export const PackageTabs: React.FC<PackageTabsProps> = ({
  activeTab,
  onTabChange,
  tabRefs,
}) => {
  const t = useTranslations("package-details");
  const isRTL = useLocale() === "ar";

  const tabsConfig = useMemo(
    () => [
      { id: "overview" as const, label: t("tabs.overview") },
      { id: "details" as const, label: t("tabs.details") },
      { id: "reviews" as const, label: t("tabs.reviews") },
    ],
    [t]
  );

  const handleTabKeyDown = (
    e: React.KeyboardEvent<HTMLButtonElement>,
    currentIndex: number
  ) => {
    const lastIndex = tabsConfig.length - 1;
    let nextIndex: number | null = null;

    if (e.key === "ArrowRight") {
      nextIndex = isRTL
        ? currentIndex === 0
          ? lastIndex
          : currentIndex - 1
        : currentIndex === lastIndex
        ? 0
        : currentIndex + 1;
    } else if (e.key === "ArrowLeft") {
      nextIndex = isRTL
        ? currentIndex === lastIndex
          ? 0
          : currentIndex + 1
        : currentIndex === 0
        ? lastIndex
        : currentIndex - 1;
    } else if (e.key === "Home") {
      nextIndex = 0;
    } else if (e.key === "End") {
      nextIndex = lastIndex;
    }

    if (nextIndex === null) return;
    e.preventDefault();
    onTabChange(tabsConfig[nextIndex].id);
    tabRefs?.current[nextIndex]?.focus();
  };

  return (
    <div className="flex justify-center mb-8 sm:mb-10">
      <div
        role="tablist"
        aria-label={t("overview.sections")}
        className="flex gap-6 sm:gap-12 text-base sm:text-lg"
      >
        {tabsConfig.map((tab, idx) => {
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              type="button"
              ref={(el) => {
                if (tabRefs) tabRefs.current[idx] = el;
              }}
              role="tab"
              id={`tab-${tab.id}`}
              aria-selected={isActive}
              aria-controls={`panel-${tab.id}`}
              tabIndex={isActive ? 0 : -1}
              onClick={() => onTabChange(tab.id)}
              onKeyDown={(e) => handleTabKeyDown(e, idx)}
              className={`pb-2.5 font-semibold transition-colors duration-200 relative cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-orange-500 focus-visible:ring-offset-2 ${
                isActive
                  ? "text-orange-600 font-bold"
                  : "text-neutral-500 hover:text-neutral-900 font-medium"
              }`}
            >
              <span>{tab.label}</span>
              {isActive && (
                <motion.div
                  layoutId="activeTabUnderline"
                  className="absolute bottom-0 inset-x-0 h-0.5 bg-orange-500 rounded-full"
                  transition={{
                    type: "spring",
                    stiffness: 380,
                    damping: 30,
                  }}
                />
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
};

export default PackageTabs;

