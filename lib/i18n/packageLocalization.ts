import enContent from "@/locales/package-content/en.json";
import arContent from "@/locales/package-content/ar.json";
import type { Locale } from "./types";

export interface ItineraryItem {
  day: number;
  title: string;
  description: string;
}

export interface PackageContentTranslation {
  id: number;
  title1: string;
  title2: string;
  des: string;
  duration: string;
  itinerary: ItineraryItem[];
}

export type PackageContentCatalog = Record<string, PackageContentTranslation>;

const EN_CATALOG: PackageContentCatalog = enContent as PackageContentCatalog;
const AR_CATALOG: PackageContentCatalog = arContent as PackageContentCatalog;

export interface PackageImageItem {
  id: number;
  url: string;
  packageId?: number;
}

export interface InputPackageRecord {
  id: number | string;
  title1?: string;
  title2?: string;
  title?: string;
  destination?: string;
  des?: string;
  description?: string;
  duration?: string;
  durationFormatted?: string;
  travelDuration?: string;
  price?: number | string;
  currency?: string;
  rating?: number;
  ratings?: number;
  count?: number;
  reviews_count?: number;
  URL?: string;
  images?: PackageImageItem[] | string[] | unknown;
  itinerary?: ItineraryItem[] | unknown;
}

export type LocalizedPackageResult<T extends InputPackageRecord = InputPackageRecord> = T & {
  title1: string;
  title2: string;
  des: string;
  duration: string;
  itinerary: ItineraryItem[];
  images: Array<{ id: number; url: string; packageId?: number }>;
  title: string;
  destination: string;
  description: string;
  durationFormatted: string;
  priceFormatted: string;
  priceWithCurrency: string;
  ratings: number;
  reviews_count: number;
};

export function formatPackagePrice(
  rawPrice: number | string | undefined | null,
  locale: Locale | string = "en",
  currencyCode: string = "USD"
): string {
  if (rawPrice === null || rawPrice === undefined) return "";

  let num: number;
  if (typeof rawPrice === "number") {
    num = rawPrice;
  } else if (typeof rawPrice === "string") {
    // Strip commas, spaces, currency symbols, but preserve digits and decimal point
    const cleaned = rawPrice.replace(/,/g, "").replace(/[^\d.-]/g, "").trim();
    num = Number(cleaned);
  } else {
    num = Number(rawPrice);
  }

  if (!Number.isFinite(num)) return "";

  const isRTL = locale === "ar";
  if (isRTL) {
    const formattedNum = num.toLocaleString("ar-EG");
    const currencyLabel =
      currencyCode.toUpperCase() === "USD"
        ? "دولار"
        : currencyCode.toUpperCase() === "EGP"
        ? "جنيه"
        : currencyCode;
    return `${formattedNum} ${currencyLabel}`;
  } else {
    const formattedNum = num.toLocaleString("en-US");
    return `${formattedNum} ${currencyCode || "USD"}`;
  }
}

export function localizeDurationText(durationStr?: string, locale: Locale = "en"): string {
  if (!durationStr || locale !== "ar") return durationStr || "";
  if (/[\u0600-\u06FF]/.test(durationStr)) return durationStr;

  return durationStr
    .replace(/(\d+)\s*days?/gi, (_, d) => {
      const num = Number(d);
      if (num === 1) return "يوم واحد";
      if (num === 2) return "يومان";
      if (num <= 10) return `${num} أيام`;
      return `${num} يوماً`;
    })
    .replace(/(\d+)\s*nights?/gi, (_, n) => {
      const num = Number(n);
      if (num === 1) return "ليلة واحدة";
      if (num === 2) return "ليلتان";
      if (num <= 10) return `${num} ليالٍ`;
      return `${num} ليلة`;
    });
}

export function localizePackage<T extends InputPackageRecord>(
  rawPkg: T,
  locale: Locale = "en"
): LocalizedPackageResult<T> {
  const pkgId = String(rawPkg.id);
  const catalog = locale === "ar" ? AR_CATALOG : EN_CATALOG;
  const translation: PackageContentTranslation | undefined = catalog[pkgId];

  const title1 = translation?.title1 || rawPkg.title1 || rawPkg.title || "";
  const title2 = translation?.title2 || rawPkg.title2 || rawPkg.destination || "";
  const des = translation?.des || rawPkg.des || rawPkg.description || "";
  const rawDuration = translation?.duration || rawPkg.duration || rawPkg.durationFormatted || "";
  const duration = localizeDurationText(rawDuration, locale);

  const itinerary: ItineraryItem[] =
    translation?.itinerary && translation.itinerary.length > 0
      ? translation.itinerary
      : Array.isArray(rawPkg.itinerary)
      ? (rawPkg.itinerary as ItineraryItem[])
      : [];

  const rawPrice = typeof rawPkg.price === "number" ? rawPkg.price : Number(rawPkg.price) || 0;
  const priceFormatted = rawPrice.toLocaleString(locale === "ar" ? "ar-EG" : "en-US");
  const currencyCode = rawPkg.currency || "USD";
  const priceWithCurrency = formatPackagePrice(rawPkg.price, locale, currencyCode);
  const ratings =
    typeof rawPkg.rating === "number"
      ? rawPkg.rating
      : typeof rawPkg.ratings === "number"
      ? rawPkg.ratings
      : 0;
  const reviews_count =
    typeof rawPkg.count === "number"
      ? rawPkg.count
      : typeof rawPkg.reviews_count === "number"
      ? rawPkg.reviews_count
      : 0;

  const rawImages = rawPkg.images;
  const images: Array<{ id: number; url: string; packageId?: number }> = Array.isArray(rawImages)
    ? (rawImages as Array<PackageImageItem | string>).map((img, idx) =>
        typeof img === "string" ? { id: idx, url: img } : img
      )
    : [];

  return {
    ...rawPkg,
    title1,
    title2,
    des,
    duration,
    itinerary,
    images,
    title: title1,
    destination: title2,
    description: des,
    durationFormatted: duration,
    priceFormatted,
    priceWithCurrency,
    ratings,
    reviews_count,
  };
}
