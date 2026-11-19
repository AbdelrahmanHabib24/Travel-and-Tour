"use client";

import { useTransition, useState, useId } from "react";
import { useLocale, useTranslations } from "next-intl";
import { useRouter } from "next/navigation";
import Cookies from "js-cookie";
import { MdLanguage } from "react-icons/md";

export default function LanguageSwitcher() {
  const locale = useLocale();
  const t = useTranslations("common.languageSwitcher");
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [showTooltip, setShowTooltip] = useState(false);
  const tooltipId = useId();

  const nextLocale = locale === "en" ? "ar" : "en";
  const label = t("ariaLabel");
  const tooltipText = t("toggleTooltip");

  const toggleLocale = () => {
    Cookies.set("NEXT_LOCALE", nextLocale, {
      expires: 365,
      path: "/",
      sameSite: "Lax",
      secure:
        typeof window !== "undefined"
          ? window.location.protocol === "https:" ||
            process.env.NODE_ENV === "production"
          : process.env.NODE_ENV === "production",
    });

    // Update document element attributes immediately to prevent flash
    document.documentElement.lang = nextLocale;
    document.documentElement.dir = nextLocale === "ar" ? "rtl" : "ltr";

    startTransition(() => {
      router.refresh();
    });
  };

  return (
    <div className="relative inline-flex items-center justify-center">
      <button
        type="button"
        onClick={toggleLocale}
        disabled={isPending}
        onMouseEnter={() => setShowTooltip(true)}
        onMouseLeave={() => setShowTooltip(false)}
        onFocus={() => setShowTooltip(true)}
        onBlur={() => setShowTooltip(false)}
        aria-label={label}
        aria-describedby={tooltipId}
        className="w-10 h-10 flex items-center justify-center text-secondary hover:text-secondary/80 focus:outline-none focus:ring-2 focus:ring-secondary/40 rounded-full transition-colors"
      >
        <MdLanguage className="text-2xl" />
      </button>

      {showTooltip && (
        <div
          id={tooltipId}
          role="tooltip"
          className="absolute top-full mt-2 tooltip-center px-2.5 py-1 bg-gray-900 text-white text-xs rounded shadow-lg whitespace-nowrap z-50 pointer-events-none"
        >
          {tooltipText}
        </div>
      )}
    </div>
  );
}

