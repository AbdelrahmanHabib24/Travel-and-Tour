import type { Metadata } from "next";
import { Nunito, Cairo } from "next/font/google";
import { getLocale, getMessages } from "next-intl/server";
import { NextIntlClientProvider } from "next-intl";
import pick from "lodash/pick";
import "./globals.css";
import Providers from "./providers";
import { Suspense } from "react";
import GlobalLoading from "./loading";
import AppRoot from "@/features/sunny/AppRoot";

const nunito = Nunito({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700", "800", "900"],
  variable: "--font-nunito",
});

const cairo = Cairo({
  subsets: ["arabic", "latin"],
  weight: ["400", "500", "600", "700", "800"],
  variable: "--font-cairo",
});

export const metadata: Metadata = {
  title: "Passport",
  description: "Tour and travel app",
};

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  const locale = await getLocale();
  const dir = locale === "ar" ? "rtl" : "ltr";
  const allMessages = await getMessages();
  const globalMessages = pick(allMessages, ["common", "sunny"]);

  return (
    <html lang={locale} dir={dir}>
      <body
        className={`bg-primary text-tertiary flex flex-col min-h-screen ${nunito.variable} ${cairo.variable}`}
      >
        <NextIntlClientProvider locale={locale} messages={globalMessages}>
          <Providers>
            <Suspense fallback={<GlobalLoading />}>
              <div className="flex-1">{children}</div>
              <AppRoot
                appConfig={{
                  isPreConnectBufferEnabled: true,
                }}
              />
            </Suspense>
          </Providers>
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
