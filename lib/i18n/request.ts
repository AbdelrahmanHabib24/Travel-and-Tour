import { getRequestConfig } from "next-intl/server";
import { cookies } from "next/headers";
import type { Locale } from "./types";

export const locales = ["en", "ar"] as const;
export const defaultLocale: Locale = "en";

export default getRequestConfig(async () => {
  const cookieStore = await cookies();
  const rawLocale = cookieStore.get("NEXT_LOCALE")?.value;
  const locale: Locale = rawLocale && locales.includes(rawLocale as Locale)
    ? (rawLocale as Locale)
    : defaultLocale;

  return {
    locale,
    messages: {
      common: (await import(`@/locales/common/${locale}.json`)).default,
      home: (await import(`@/locales/home/${locale}.json`)).default,
      "packages-listing": (await import(`@/locales/packages-listing/${locale}.json`)).default,
      "package-details": (await import(`@/locales/package-details/${locale}.json`)).default,
      results: (await import(`@/locales/results/${locale}.json`)).default,
      about: (await import(`@/locales/about/${locale}.json`)).default,
      blog: (await import(`@/locales/blog/${locale}.json`)).default,
      login: (await import(`@/locales/login/${locale}.json`)).default,
      signup: (await import(`@/locales/signup/${locale}.json`)).default,
      sunny: (await import(`@/locales/sunny/${locale}.json`)).default,
    },
  };
});

