import common from "@/locales/common/en.json";
import home from "@/locales/home/en.json";
import packagesListing from "@/locales/packages-listing/en.json";
import packageDetails from "@/locales/package-details/en.json";
import results from "@/locales/results/en.json";
import about from "@/locales/about/en.json";
import blog from "@/locales/blog/en.json";
import login from "@/locales/login/en.json";
import signup from "@/locales/signup/en.json";
import sunny from "@/locales/sunny/en.json";

export type Messages = {
  common: typeof common;
  home: typeof home;
  "packages-listing": typeof packagesListing;
  "package-details": typeof packageDetails;
  results: typeof results;
  about: typeof about;
  blog: typeof blog;
  login: typeof login;
  signup: typeof signup;
  sunny: typeof sunny;
};

declare module "next-intl" {
  interface AppConfig {
    Locale: "en" | "ar";
    Messages: Messages;
  }
}

