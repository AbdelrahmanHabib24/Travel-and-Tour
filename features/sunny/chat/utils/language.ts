import type { SupportedLanguage } from "../types";
import { ARABIC_CHAR_REGEX, LATIN_CHAR_REGEX } from "../constants";

export function detectTextLanguage(
  text: string,
  fallback: SupportedLanguage = "en"
): SupportedLanguage {
  if (!text) return fallback;
  const arabicMatches = text.match(ARABIC_CHAR_REGEX)?.length ?? 0;
  const latinMatches = text.match(LATIN_CHAR_REGEX)?.length ?? 0;

  if (arabicMatches > 0 && arabicMatches >= latinMatches) {
    return "ar";
  }
  if (latinMatches > 0 && latinMatches > arabicMatches) {
    return "en";
  }
  return fallback;
}
