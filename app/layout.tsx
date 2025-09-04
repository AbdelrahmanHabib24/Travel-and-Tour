import type { Metadata } from "next";
import { Nunito } from "next/font/google";
import Head from "next/head"; // 👈 هنا

import "slick-carousel/slick/slick.css";
import "./globals.css";

import Header from "@/app/componant/Header";
import Footer from "@/app/componant/Footer";
import Providers from "./providers";

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
      <Head>
        <link rel="preload" as="video" href="/video.mp4" type="video/mp4" />
      </Head>
      <body className={`bg-primary text-tertiary transition-all duration-300 ${nunito.variable}`}>
        <Providers>
          <Header />
          <main>{children}</main>
          <Footer />
        </Providers>
      </body>
    </html>
  );
}
