import { useCallback, useMemo } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useLocale, useTranslations } from "next-intl";
import {
  LuClock,
  LuUser,
  LuUsers,
  LuCalendarDays,
  LuLanguages,
  LuSmartphone,
} from "react-icons/lu";
import { localizePackage, localizeDurationText, formatPackagePrice } from "@/lib/i18n/packageLocalization";
import { queryKeys } from "@/lib/query/queryKeys";
import { packagesService } from "../services/packages.service";
import type { LocalizedPackage, PackageRecord, TripProperty } from "../types";

const ARABIC_LANGUAGE_MAP: Record<string, string> = {
  english: "الإنجليزية",
  arabic: "العربية",
  german: "الألمانية",
  french: "الفرنسية",
  italian: "الإيطالية",
  spanish: "الإسبانية",
  portuguese: "البرتغالية",
  russian: "الروسية",
  chinese: "الصينية",
  japanese: "اليابانية",
  turkish: "التركية",
  dutch: "الهولندية",
  korean: "الكورية",
  greek: "اليونانية",
};

export function usePackageDetails(id: string) {
  const queryClient = useQueryClient();
  const locale = useLocale();
  const t = useTranslations("package-details");
  const normalizedLocale = locale === "ar" ? "ar" : "en";
  const isRTL = normalizedLocale === "ar";

  /* -------------------- Dynamic Currency Formatting -------------------- */
  const formatPriceDisplay = useCallback(
    (rawPrice: number | string | undefined | null, currencyCode: string = "USD") => {
      return formatPackagePrice(rawPrice, locale, currencyCode);
    },
    [locale]
  );

  /* -------------------- Fetch Package -------------------- */
  const {
    data: packageDetails,
    isLoading,
    error,
  } = useQuery<PackageRecord>({
    queryKey: queryKeys.packages.detail(id),
    queryFn: () => packagesService.getPackageById(id),
    enabled: !!id,
    staleTime: Infinity,
    gcTime: Infinity,
    retry: false,
    placeholderData: () =>
      queryClient.getQueryData<PackageRecord>(queryKeys.packages.detail(id)),
  });

  const localizedPackage = useMemo<LocalizedPackage | null>(() => {
    if (!packageDetails) return null;
    return localizePackage(packageDetails, normalizedLocale);
  }, [packageDetails, normalizedLocale]);

  const heroImage =
    localizedPackage?.images?.[0]?.url ||
    packageDetails?.URL ||
    "/placeholder.webp";

  const hasPrice =
    packageDetails?.price !== null &&
    packageDetails?.price !== undefined &&
    String(packageDetails.price).trim() !== "" &&
    Number.isFinite(Number(packageDetails.price)) &&
    Number(packageDetails.price) >= 0;

  /* -------------------- 6 RESTORED TRIP PROPERTIES (Trip Details) -------------------- */
  const rawDuration =
    localizedPackage?.durationFormatted ||
    packageDetails?.travelDuration ||
    packageDetails?.duration;
  const propDuration = localizeDurationText(rawDuration, normalizedLocale);

  const rawAge = String(packageDetails?.ageRange || "").trim();
  const isGenericAge = !rawAge || /^(0[-–—]99|all\s*ages|0\s*to\s*99)$/i.test(rawAge);
  const propAge = isGenericAge ? t("highlights.allAges") : rawAge;

  const rawGroupSize = packageDetails?.maxGroupSize;
  const propGroupSize =
    rawGroupSize && Number(rawGroupSize) > 0
      ? isRTL
        ? `${Number(rawGroupSize).toLocaleString("ar-EG")} مسافرًا كحد أقصى`
        : `Up to ${rawGroupSize} travelers`
      : isRTL
      ? "مجموعات سياحية صغيرة"
      : "Small group tour";

  const rawStartTime = String(packageDetails?.startTimeInfo || "").trim();
  const isPlaceholderStart =
    !rawStartTime || /^(check\s*availability|n\/?a|tbd|none)$/i.test(rawStartTime);
  const propStartTime = isPlaceholderStart ? t("highlights.flexible") : rawStartTime;

  const guideLangs = packageDetails?.liveGuideLanguages?.filter(Boolean) || [];
  const propLiveGuide =
    guideLangs.length > 0
      ? isRTL
        ? guideLangs
            .map(
              (lang: string) =>
                ARABIC_LANGUAGE_MAP[lang.trim().toLowerCase()] || lang.trim()
            )
            .join("، ")
        : guideLangs.join(", ")
      : isRTL
      ? "مرشد سياحي متوفر"
      : "Available";

  const propMobileTicket = t("highlights.accepted");

  const sixTripProperties = useMemo<TripProperty[]>(
    () => [
      {
        icon: LuClock,
        label: t("highlights.duration"),
        value: propDuration,
      },
      {
        icon: LuUser,
        label: t("highlights.ageRange"),
        value: propAge,
      },
      {
        icon: LuUsers,
        label: t("highlights.maxGroupSize"),
        value: propGroupSize,
      },
      {
        icon: LuCalendarDays,
        label: t("highlights.startTime"),
        value: propStartTime,
      },
      {
        icon: LuLanguages,
        label: t("highlights.liveGuide"),
        value: propLiveGuide,
      },
      {
        icon: LuSmartphone,
        label: t("highlights.mobileTicket"),
        value: propMobileTicket,
      },
    ],
    [
      t,
      propDuration,
      propAge,
      propGroupSize,
      propStartTime,
      propLiveGuide,
      propMobileTicket,
    ]
  );

  const hasItinerary =
    Boolean(localizedPackage?.itinerary) &&
    (localizedPackage?.itinerary?.length || 0) > 0;

  return {
    packageDetails,
    localizedPackage,
    isLoading,
    error,
    heroImage,
    hasPrice,
    propDuration,
    formatPriceDisplay,
    sixTripProperties,
    hasItinerary,
    isRTL,
    locale,
  };
}

