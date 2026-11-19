import type { ChatMessageItem, PackageRecord } from "../types";
import {
  DB_PACKAGE_ALIASES,
  EXPLICIT_TABLE_KEYWORDS,
  GENERAL_PACKAGES_KEYWORDS,
} from "../constants";

export function normalizePromptKey(text: string): string {
  if (!text) return "";
  return text
    .toLowerCase()
    .replace(/[?.!؟،,\-–—]+/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

export function isExplicitComparisonRequest(text?: string): boolean {
  if (!text) return false;
  const lower = text.toLowerCase();
  return EXPLICIT_TABLE_KEYWORDS.some((kw) => lower.includes(kw));
}

export function matchPackagesInText(
  text: string,
  dbPackages: PackageRecord[]
): PackageRecord[] {
  if (!text || !Array.isArray(dbPackages) || dbPackages.length === 0) {
    return [];
  }
  const normalized = text.toLowerCase();
  const matched: PackageRecord[] = [];

  for (const pkg of dbPackages) {
    const t1 = (pkg.title1 || "").toLowerCase();
    const t2 = (pkg.title2 || "").toLowerCase();

    let isMatch =
      (t1.length > 2 && normalized.includes(t1)) ||
      (t2.length > 2 && normalized.includes(t2));

    if (!isMatch) {
      for (const [key, aliases] of Object.entries(DB_PACKAGE_ALIASES)) {
        if (t1.includes(key) || t2.includes(key)) {
          if (aliases.some((alias) => normalized.includes(alias.toLowerCase()))) {
            isMatch = true;
            break;
          }
        }
      }
    }

    if (isMatch && !matched.some((m) => m.id === pkg.id)) {
      matched.push(pkg);
    }
  }

  return matched;
}

/**
 * Resolve genuine PostgreSQL travel packages to display as visual cards for an
 * assistant turn. Never fabricates packages and never duplicates data when an
 * explicit comparison table was requested.
 */
export function resolvePackagesForTurn(
  msg: ChatMessageItem,
  dbPackages: PackageRecord[]
): PackageRecord[] {
  if (
    msg.role !== "assistant" ||
    !msg.content ||
    !Array.isArray(dbPackages) ||
    dbPackages.length === 0
  ) {
    return [];
  }

  const userQuery = (msg.userQuery || "").toLowerCase();

  // Rule: Never duplicate the same package data in both a comparison table and cards
  if (msg.explicitTableRequested || isExplicitComparisonRequest(userQuery)) {
    return [];
  }

  // Primary source of truth: exact filtered results returned by the Python backend
  if (Array.isArray(msg.matchedPackages)) {
    return msg.matchedPackages;
  }

  // Fallback path guard: Never return fallback cards for hotel queries, custom itinerary, closing, or unsupported destinations
  if (
    msg.intent === "hotel" ||
    msg.intent === "custom_itinerary" ||
    msg.intent === "closing" ||
    /hotel|hotels|فندق|فنادق/.test(userQuery) ||
    /istanbul|إسطنبول|اسطنبول|turkey|تركيا|cairo|القاهرة|dubai|دبي/.test(userQuery)
  ) {
    return [];
  }

  const normalizedReply = msg.content.toLowerCase();

  // Check if user requested a specific duration (e.g., "5 days", "4 أيام", or "يومين")
  const dayMatch = userQuery.match(/(\d+)\s*(?:-|\s)?(?:day|days|أيام|ايام|يوم)/i);
  const requestedDays = dayMatch
    ? parseInt(dayMatch[1], 10)
    : /يومان|يومين/.test(userQuery)
    ? 2
    : null;

  // Do not attach cards if the response explicitly states no matching packages exist
  if (
    normalizedReply.includes("don't have any packages matching") ||
    normalizedReply.includes("no packages found matching") ||
    normalizedReply.includes("no pre-built packages") ||
    normalizedReply.includes("couldn't find any") ||
    normalizedReply.includes("limitation is the trip duration") ||
    normalizedReply.includes("لا تتوفر لدينا أي باقات") ||
    normalizedReply.includes("ليس لدينا باقات") ||
    normalizedReply.includes("لم أجد باقات") ||
    normalizedReply.includes("لا توجد باقات جاهزة لمدة")
  ) {
    return [];
  }

  // Deduplicate database packages by genuine ID
  const uniqueDbPackages = dbPackages.filter(
    (pkg, idx, arr) => idx === arr.findIndex((p) => p.id === pkg.id)
  );

  let scopedPool = uniqueDbPackages;

  // If the user explicitly asked for a package duration, filter strictly by numeric durationDays / duration
  if (requestedDays !== null) {
    scopedPool = uniqueDbPackages.filter((pkg) => {
      if (typeof pkg.durationDays === "number") {
        return pkg.durationDays === requestedDays;
      }
      const pkgDaysMatch = (pkg.duration || "").match(/(\d+)/);
      return pkgDaysMatch ? parseInt(pkgDaysMatch[1], 10) === requestedDays : false;
    });
    if (scopedPool.length === 0) {
      return [];
    }
  }

  // Separate Intent 1 (lowest price only), Intent 2 (sort ascending), and Intent 3 (budget filter)
  const isSortAscIntent =
    /sort.*(?:price|cheapest|lowest|ascending)|from cheapest to most expensive|رتب.*(?:السعر|الأرخص|الارخص|تصاعدي)|من الأرخص إلى الأغلى/i.test(
      userQuery
    );
  const budgetMatch = userQuery.match(
    /(?:under|below|less than|within|up to|أقل من|اقل من|في حدود)\s*\True\s*(\d+(?:,\d{3})*)/i
  );
  const maxBudget = budgetMatch
    ? parseFloat(budgetMatch[1].replace(/,/g, ""))
    : null;
  const isLowestPriceIntent =
    !isSortAscIntent &&
    maxBudget === null &&
    /cheapest|lowest[\s-]*price|least expensive|الأقل سعر|الاقل سعر|أقل سعر|أرخص|ارخص/i.test(
      userQuery
    );

  if (maxBudget !== null) {
    return scopedPool
      .filter((p) => Number(p.price) <= maxBudget)
      .sort((a, b) => Number(a.price) - Number(b.price) || a.id - b.id);
  }

  if (isLowestPriceIntent && scopedPool.length > 0) {
    const minPrice = Math.min(...scopedPool.map((p) => Number(p.price)));
    return scopedPool
      .filter((p) => Number(p.price) === minPrice)
      .sort((a, b) => a.id - b.id);
  }

  if (isSortAscIntent) {
    return [...scopedPool].sort(
      (a, b) => Number(a.price) - Number(b.price) || a.id - b.id
    );
  }

  if (requestedDays !== null) {
    return scopedPool;
  }

  // Check packages explicitly mentioned in the user's query or assistant's reply
  const userMatched = matchPackagesInText(userQuery, scopedPool);
  const replyMatched = matchPackagesInText(msg.content, scopedPool);

  const combined: PackageRecord[] = [];
  const addUnique = (list: PackageRecord[]) => {
    for (const p of list) {
      if (!combined.some((existing) => existing.id === p.id)) {
        combined.push(p);
      }
    }
  };

  addUnique(userMatched);
  addUnique(replyMatched);

  const isGeneralDiscovery =
    GENERAL_PACKAGES_KEYWORDS.some((kw) => userQuery.includes(kw)) ||
    (msg.packagesQueried && userMatched.length === 0 && replyMatched.length > 0);

  if (isGeneralDiscovery) {
    addUnique(scopedPool);
  }

  return combined;
}
