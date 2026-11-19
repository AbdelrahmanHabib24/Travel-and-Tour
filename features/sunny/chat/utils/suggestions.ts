import type { ChatMessageItem, SupportedLanguage } from "../types";
import { normalizePromptKey } from "./packageResolver";

/**
 * Resolve up to 3 contextual follow-up suggestions for the latest assistant message,
 * adapting to the active UI language and strictly filtering out any prompt already
 * selected or typed by the user in the current conversation.
 * Never falls back to hardcoded suggestion pools.
 */
export function resolveContextualSuggestions(
  latestAssistantMsg: ChatMessageItem | undefined,
  allMessages: ChatMessageItem[],
  activeLanguage: SupportedLanguage
): string[] {
  if (!latestAssistantMsg || latestAssistantMsg.role !== "assistant") {
    return [];
  }

  const usedKeys = new Set<string>();
  for (const m of allMessages) {
    if (m.role === "user") {
      const norm = normalizePromptKey(m.content);
      if (norm) usedKeys.add(norm);
    }
  }

  const result: string[] = [];
  const seenNorms = new Set<string>();

  // 1. Prefer structured suggestions from backend
  if (
    Array.isArray(latestAssistantMsg.structuredSuggestions) &&
    latestAssistantMsg.structuredSuggestions.length > 0
  ) {
    for (const item of latestAssistantMsg.structuredSuggestions) {
      const enText = item.label?.en || "";
      const arText = item.label?.ar || "";
      const enNorm = normalizePromptKey(enText);
      const arNorm = normalizePromptKey(arText);

      // If user has already used either English or Arabic version, skip
      if (
        (enNorm && usedKeys.has(enNorm)) ||
        (arNorm && usedKeys.has(arNorm))
      ) {
        continue;
      }

      const candidate =
        activeLanguage === "ar" ? arText || enText : enText || arText;
      const candNorm = normalizePromptKey(candidate);
      if (!candNorm || seenNorms.has(candNorm)) {
        continue;
      }

      seenNorms.add(candNorm);
      result.push(candidate);
      if (result.length >= 3) return result;
    }
    return result;
  }

  // 2. Otherwise fall back to flat string suggestions from backend
  if (
    Array.isArray(latestAssistantMsg.suggestions) &&
    latestAssistantMsg.suggestions.length > 0
  ) {
    for (const s of latestAssistantMsg.suggestions) {
      const norm = normalizePromptKey(s);
      if (!norm || usedKeys.has(norm) || seenNorms.has(norm)) continue;
      seenNorms.add(norm);
      result.push(s);
      if (result.length >= 3) return result;
    }
    return result;
  }

  // Never fall back to any frontend suggestion pool
  return [];
}
