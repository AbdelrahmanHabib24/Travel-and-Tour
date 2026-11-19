"use client";

import Slider from "react-slick";
import { motion } from "framer-motion";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

import FeatureItem from "./FeatureItem";
import { useLocale, useTranslations } from "next-intl";

const FEATURE = [
  { title: "Brazil", URL: "/brazil.webp" },
  { title: "England", URL: "/england.webp" },
  { title: "France", URL: "/france.webp" },
  { title: "Australia", URL: "/australia.webp" },
  { title: "California", URL: "/california.webp" },
  { title: "Germany", URL: "/germany.webp" },
  { title: "HongKong", URL: "/hong-kong.webp" },
  { title: "India", URL: "/india.webp" },
];

const Feature = () => {
  const locale = useLocale();
  const t = useTranslations("home.services");
  const isRTL = locale === "ar";

  const settings = {
    dots: true,
    autoplay: true,
    infinite: true,
    speed: 500,
    slidesToScroll: 1,
    arrows: false,
    slidesToShow: 3,
    rtl: isRTL,
    responsive: [
      { breakpoint: 1280, settings: { slidesToShow: 3, rtl: isRTL } },
      { breakpoint: 1024, settings: { slidesToShow: 2, rtl: isRTL } },
      { breakpoint: 768, settings: { slidesToShow: 1, rtl: isRTL } },
      { breakpoint: 640, settings: { slidesToShow: 1, rtl: isRTL } },
    ],
  };

  const fadeInUp = (delay = 0) => ({
    initial: { opacity: 0, y: 20 },
    whileInView: { opacity: 1, y: 0 },
    transition: { duration: 0.8, ease: "easeInOut", delay },
    viewport: { once: true },
  });

  return (
    <section id="feature" className="py-10 xl:py-12">
      <div className="max_padd_container text-start">
        <motion.h4
          className="font-bold text-secondary text-sm sm:text-base md:text-lg max-w-full sm:max-w-md"
          {...fadeInUp(0)}
        >
          {t("badge")}
        </motion.h4>
        <motion.h3
          className="font-bold text-lg sm:text-xl md:text-2xl lg:text-3xl max-w-full sm:max-w-md mt-1"
          {...fadeInUp(0.2)}
        >
          {t("title")}
        </motion.h3>
        <motion.p
          className="mt-2 text-gray-700 text-sm sm:text-base md:text-lg max-w-full sm:max-w-md"
          {...fadeInUp(0.4)}
        >
          {t("subtitle")}
        </motion.p>
        <div className="overflow-hidden mx-auto pt-10">
          <Slider key={locale} {...settings} className="overflow-visible">
            {FEATURE.map((item, idx) => (
              <motion.div key={`${item.title}-${idx}`} {...fadeInUp(0.5)}>
                <FeatureItem URL={item.URL} title={item.title} />
              </motion.div>
            ))}
          </Slider>
        </div>
      </div>
    </section>
  );
};

export default Feature;
