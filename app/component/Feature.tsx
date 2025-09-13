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
    slidesToShow: 3,
    responsive: [
      { breakpoint: 1536, settings: { slidesToShow: 3 } }, // ≥2xl
      { breakpoint: 1280, settings: { slidesToShow: 3 } }, // ≥xl
      { breakpoint: 1024, settings: { slidesToShow: 2 } }, // ≥lg
      { breakpoint: 768,  settings: { slidesToShow: 1 } }, // ≥md
      { breakpoint: 640,  settings: { slidesToShow: 1 } }, // ≥sm
      { breakpoint: 0,    settings: { slidesToShow: 1 } }, // extra-small <640
    ],
  };

  const fadeInUp = (delay = 0) => ({
    initial: { opacity: 0, y: 20 },
    whileInView: { opacity: 1, y: 0 },
    transition: { duration: 0.8, ease: "easeInOut", delay },
  });

  return (
    <section
      id="feature"
      className="
        mx-auto
        w-full
        max-w-[1290px]     
        sm:max-w-[1330px] 
        px-4 sm:px-6 lg:px-8  
        py-16 sm:py-20 xl:py-24
      "
    >
      {/* Title & Description */}
      <div className="text-left mb-12">
        <motion.h4
          className="bold-16 text-secondary text-sm md:text-base"
          {...fadeInUp(0)}
        >
          WHAT WE SERVE
        </motion.h4>
        <motion.h3
          className="
            bold-28 sm:text-xl md:text-2xl max-w-lg
          "
          {...fadeInUp(0.2)}
        >
          We Provide Top Destinations
        </motion.h3>
        <motion.p
          className="
           max-w-lg text-gray-700
          "
          {...fadeInUp(0.4)}
        >
          Lorem ipsum dolor sit amet consectetur adipisicing elit. Corrupti eum
          tempora illum laboriosam corporis possimus ipsum, est reprehenderit,
          voluptatum itaque repellendus voluptas error quasi deserunt modi,
          obcaecati aliquam. Ullam, eligendi.
        </motion.p>
      </div>

      {/* Slider */}
      <Slider {...settings}>
        {FEATURE.map(({ URL, title }) => (
          <motion.div
            key={URL}
            className="px-2 sm:px-3 lg:px-4"
            {...fadeInUp(0.5)}
          >
            <FeatureItem URL={URL} title={title} />
          </motion.div>
        ))}
      </Slider>
    </section>
  );
};

export default Feature;
