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
      { breakpoint: 1400, settings: { slidesToShow: 4 } },
      { breakpoint: 1280, settings: { slidesToShow: 3 } },
      { breakpoint: 768, settings: { slidesToShow: 2 } },
      { breakpoint: 640, settings: { slidesToShow: 1 } },
    ],
  };

  const fadeInUp = (delay = 0) => ({
    initial: { opacity: 0, y: 20 },
    whileInView: { opacity: 1, y: 0 },
    transition: { duration: 1, ease: "easeInOut", delay },
  });

  return (
    <section
      id="feature"
      className="max_padd_container flex items-center justify-center py-20 xl:py-20"
    >
      <div className="w-full lg:w-[103%] md:w-[104%]">
        {/* Title & Description */}
        <div className="mx-4">
          <motion.h4 className="bold-16 text-secondary" {...fadeInUp(0)}>
            WHAT WE SERVE
          </motion.h4>
          <motion.h3
            className="bold-28 sm:text-xl md:text-2xl max-w-lg"
            {...fadeInUp(0.2)}
          >
            We Provide Top Destinations
          </motion.h3>
          <motion.p className="max-w-lg" {...fadeInUp(0.4)}>
            Lorem ipsum dolor sit amet consectetur adipisicing elit. Corrupti eum
            tempora illum laboriosam corporis possimus ipsum, est reprehenderit,
            voluptatum itaque repellendus voluptas error quasi deserunt modi,
            obcaecati aliquam. Ullam, eligendi.
          </motion.p>
        </div>

        {/* Slider */}
        <div className="pt-4">
          <Slider {...settings}>
            {FEATURE.map(({ URL, title }) => (
              <motion.div
                key={URL}
                style={{ margin: "0 40px" }}
                {...fadeInUp(0.5)}
              >
                <FeatureItem URL={URL} title={title} />
              </motion.div>
            ))}
          </Slider>
        </div>
      </div>
    </section>
  );
};

export default Feature;
