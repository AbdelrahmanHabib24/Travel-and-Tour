import { useMemo } from "react";
import { useTranslations } from "next-intl";
import { DESTINATION_NAMES } from "../constants";
import type {
  PackageRecord,
  StarterSuggestionItem,
  SupportedLanguage,
} from "../types";

export interface UseChatSuggestionsOptions {
  dbPackages: PackageRecord[];
  language: SupportedLanguage;
}

/**
 * Derives localized starter suggestions from available travel packages.
 */
export function useChatSuggestions({
  dbPackages,
  language,
}: UseChatSuggestionsOptions): StarterSuggestionItem[] {
  const t = useTranslations("sunny");

  return useMemo(() => {
    if (!dbPackages || dbPackages.length === 0) {
      return [];
    }
    const destPkg = dbPackages.find(
      (p) => p.title2 && p.title2.trim().length > 0
    );
    const rawDest = destPkg?.title2?.trim();
    const destMeta = rawDest
      ? DESTINATION_NAMES[rawDest.toLowerCase()] || { en: rawDest, ar: rawDest }
      : null;

    const list: StarterSuggestionItem[] = [
      {
        icon: "packages",
        text: t("suggestions.showPackages"),
      },
    ];
    if (destMeta) {
      const destName = language === "ar" ? destMeta.ar : destMeta.en;
      list.push({
        icon: "plan",
        text: t("suggestions.exploreDest", { destination: destName }),
      });
    }
    list.push({
      icon: "budget",
      text: t("suggestions.cheapestAvailable"),
    });
    return list;
  }, [dbPackages, language, t]);
}