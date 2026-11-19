/* ---------------------- Hero.tsx ---------------------- */
"use client";

import React, { useEffect, useRef } from "react";
import BackgroundVideo from "@/components/ui/BackgroundVideo";
import { useTranslations } from "next-intl";
import { useTypewriter } from "@/features/home/hooks/useTypewriter";
import HeroSearchForm from "./HeroSearchForm";

const Hero: React.FC = () => {
  const t = useTranslations("home.hero");
  const typedText = useTypewriter(t("title"), 100, 50);
  const animatedRefs = useRef<(HTMLElement | null)[]>([]);

  // Intersection animations
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) =>
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("visible");
            observer.unobserve(entry.target);
          }
        }),
      { threshold: 0.1 },
    );

    animatedRefs.current.forEach((el) => {
      if (el) observer.observe(el);
    });

    return () => observer.disconnect();
  }, []);

  return (
    <section
      className="relative w-full min-h-screen flex items-center justify-center"
      id="home"
    >
      <div className="absolute inset-0 bg-[#2f6a7f2f] z-10" />
      <BackgroundVideo />

      <div className="relative z-20 text-white flex flex-col items-center gap-6 text-center px-4 sm:px-6 lg:px-10 w-full">
        <p className="text-orange-400 text-base sm:text-lg md:text-2xl fade-down">
          {typedText}
        </p>

        <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold fade-up">
          {t("mainHeading")}
        </h1>

        <div
          ref={(el) => {
            animatedRefs.current[2] = el;
          }}
          className="w-full sm:flex flex-col items-center"
        >
          {/* Search Section */}
          <div className="zoom-in">
            <span className="bg-white text-tertiary px-4 py-2 rounded-lg text-sm sm:text-base font-medium">
              {t("searchBadge")}
            </span>

            <HeroSearchForm />
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
