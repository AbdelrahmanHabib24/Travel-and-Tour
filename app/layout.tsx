import type { Metadata } from "next";
import { Nunito } from "next/font/google";
import "slick-carousel/slick/slick.css";
import "./globals.css";
import Header from "@/app/component/Header";
import Footer from "@/app/component/Footer";
import Providers from "./providers";
import { Suspense } from "react";
import GlobalLoading from "./loading";

const nunito = Nunito({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700", "800", "900"],
  variable: "--font-nunito",
});

export const metadata: Metadata = {
  title: "Passport",
  description: "Tour and travel app",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <head>
        <link rel="preload" as="video" href="/Video.mp4" type="video/mp4" />
      </head>
      <body
        className={`bg-primary text-tertiary transition-all duration-300 ${nunito.variable}`}
      >
        <Providers>
          {/* Flex container to push footer to bottom */}
          <div className="flex flex-col min-h-screen ">
            <Header />
            <Suspense fallback={<GlobalLoading />}>
              <main className="flex-1">{children}</main>
            </Suspense>
            <Footer  />
          </div>
        </Providers>
      </body>
    </html>
  );
}
