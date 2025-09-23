"use client";

import React from "react";
import Slider from "react-slick";
import { motion } from "framer-motion";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

import { FEATURE } from "../ulits/type";
import FeatureItem from "./FeatureItem";

const Feature = () => {
  const settings = {
    dots: true,
    autoplay: true,
    infinite: true,
    speed: 500,
    slidesToScroll: 1,
    arrows: false,
    slidesToShow: 3,
    responsive: [
      { breakpoint: 1280, settings: { slidesToShow: 3 } }, // ≥xl
      { breakpoint: 1024, settings: { slidesToShow: 2 } }, // ≥lg
      { breakpoint: 768, settings: { slidesToShow: 1 } }, // ≥md
      { breakpoint: 640, settings: { slidesToShow: 1 } }, // ≥sm
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
      {/* النصوص جوه max_padd_container */}
      <div className="max_padd_container text-left mb-8 sm:mb-10 md:mb-12">
        <motion.h4
          className="font-bold text-secondary text-sm sm:text-base md:text-lg max-w-full sm:max-w-md"
          {...fadeInUp(0)}
        >
          WHAT WE SERVE
        </motion.h4>
        <motion.h3
          className="font-bold text-lg sm:text-xl md:text-2xl lg:text-3xl max-w-full sm:max-w-md"
          {...fadeInUp(0.2)}
        >
          We Provide Top Destinations
        </motion.h3>
        <motion.p
          className="mt-2 text-gray-700 text-sm sm:text-base md:text-lg max-w-full sm:max-w-lg"
          {...fadeInUp(0.4)}
        >
          Lorem ipsum dolor sit amet consectetur adipisicing elit. Corrupti eum
          tempora illum laboriosam corporis possimus ipsum, est reprehenderit,
          voluptatum itaque repellendus voluptas error quasi deserunt modi,
          obcaecati aliquam. Ullam, eligendi.
        </motion.p>

         <div className="overflow-hidden mx-auto  py-10">
        <Slider {...settings} className="overflow-visible">
          {FEATURE.map((item, idx) => (
            <motion.div
              key={idx}
              {...fadeInUp(0.5)}
            >
              <FeatureItem URL={item.URL} title={item.title} />
            </motion.div>
          ))}
        </Slider>
      </div>
      </div>

      {/* السلايدر full width مع تعويض الـ padding */}
     
    </section>
  );
};

export default Feature;
