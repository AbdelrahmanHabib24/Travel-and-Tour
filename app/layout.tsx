import type { Metadata } from "next";
import { Nunito } from "next/font/google";
import "./globals.css";
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

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className={`bg-primary text-tertiary flex flex-col min-h-screen ${nunito.variable}`}>
        <Providers>
          <Suspense fallback={<GlobalLoading/>}>
            <main className="flex-1">{children}</main>
          </Suspense>
        </Providers>
      </body>
    </html>
  );
}
