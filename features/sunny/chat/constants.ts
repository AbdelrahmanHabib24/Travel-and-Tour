export const COLLAPSE_CHAR_THRESHOLD = 480;
export const COLLAPSE_LINE_THRESHOLD = 9;
export const INITIAL_VISIBLE_PACKAGES = 3;
export const PACKAGE_PAGE_STEP = 3;

export const ARABIC_CHAR_REGEX = /[\u0600-\u06FF\u0750-\u077F\u08A0-\u08FF]/g;
export const LATIN_CHAR_REGEX = /[A-Za-z]/g;

export const DB_PACKAGE_ALIASES: Record<string, string[]> = {
  florence: ["florence", "italy", "فلورنسا", "إيطاليا", "ايطاليا"],
  opera: [
    "opera house",
    "sydney",
    "australia",
    "أوبرا",
    "سيدني",
    "أستراليا",
    "استراليا",
  ],
  eiffel: ["eiffel", "paris", "france", "إيفل", "ايفل", "باريس", "فرنسا"],
  victoria: [
    "victoria peak",
    "hong kong",
    "فيكتوريا",
    "هونغ كونغ",
    "هونج كونج",
  ],
  amazon: ["amazon", "brazil", "الأمازون", "امازون", "أمازون", "البرازيل"],
  camden: ["camden", "london", "england", "كامدن", "لندن", "إنجلترا"],
  komodo: ["komodo", "indonesia", "كومودو", "إندونيسيا", "اندونيسيا"],
  zurich: ["zurich", "switzerland", "زيورخ", "زيوريخ", "سويسرا"],
  taj: ["taj mahal", "india", "تاج محل", "الهند"],
};

export const DESTINATION_NAMES: Record<string, { en: string; ar: string }> = {
  italy: { en: "Italy", ar: "إيطاليا" },
  france: { en: "France", ar: "فرنسا" },
  australia: { en: "Australia", ar: "أستراليا" },
  "hong kong": { en: "Hong Kong", ar: "هونغ كونغ" },
  brazil: { en: "Brazil", ar: "البرازيل" },
  london: { en: "London", ar: "لندن" },
  indonesia: { en: "Indonesia", ar: "إندونيسيا" },
  switzerland: { en: "Switzerland", ar: "سويسرا" },
  india: { en: "India", ar: "الهند" },
};

export const EXPLICIT_TABLE_KEYWORDS = [
  "compare",
  "comparison",
  "table",
  "side by side",
  "side-by-side",
  "قارن",
  "مقارنة",
  "مقارنه",
  "جدول",
];

export const GENERAL_PACKAGES_KEYWORDS = [
  "available travel packages",
  "available packages",
  "show available",
  "all packages",
  "what packages",
  "what trips",
  "show trips",
  "الباقات السياحية المتاحة",
  "الباقات المتاحة",
  "اعرض الباقات",
  "ما هي الباقات",
  "اعرض رحلات",
  "الرحلات المتاحة",
];
