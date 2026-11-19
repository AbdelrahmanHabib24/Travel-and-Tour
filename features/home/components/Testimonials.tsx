'use client';

import Image from "next/image";
import dynamic from "next/dynamic";
import { motion } from "framer-motion";
import { useLocale, useTranslations } from "next-intl";

const Slider = dynamic(() => import("react-slick"), { ssr: false });

interface TestimonialItemData {
  title: string;
  profession: string;
  url: string;
  desc: string;
}

const Testimonials = () => {
  const locale = useLocale();
  const t = useTranslations("home.testimonials");
  const isRTL = locale === "ar";
  const items = (t.raw("items") as TestimonialItemData[]) || [];

  const settings = {
    autoplay: true,
    infinite: true,
    arrows: false,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
    rtl: isRTL,
    responsive: [
      { breakpoint: 1400, settings: { slidesToShow: 1, rtl: isRTL } },
      { breakpoint: 1280, settings: { slidesToShow: 1, rtl: isRTL } },
      { breakpoint: 768, settings: { slidesToShow: 1, rtl: isRTL } },
      { breakpoint: 640, settings: { slidesToShow: 1, rtl: isRTL } },
    ],
  };

  return (
    <motion.section
      className="py-10"
      initial={{ opacity: 0 }}
      whileInView={{ opacity: 1 }}
      transition={{ duration: 1, ease: "easeOut" }}
    >
      <div className="w-[90%] mx-auto">
        <motion.h4
          className="bold-16 text-center text-secondary"
          initial={{ opacity: 0, y: -20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: "easeOut", delay: 0.2 }}
        >
          {t("badge")}
        </motion.h4>
        <motion.h3
          className="bold-28 regular-22 text-center mb-5"
          initial={{ opacity: 0, y: -20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: "easeOut", delay: 0.4 }}
        >
          {t("title")}
        </motion.h3>

        <Slider key={locale} {...settings}>
          {items.map((item) => (
            <TestimonialsItem
              key={item.title}
              title={item.title}
              Profession={item.profession}
              URL={item.url}
              Desc={item.desc}
            />
          ))}
        </Slider>
      </div>
    </motion.section>
  );
};

type TestimonialsItemProps = {
  title: string;
  Profession: string;
  URL: string;
  Desc: string;
};

const TestimonialsItem = ({
  title,
  Profession,
  URL,
  Desc,
}: TestimonialsItemProps) => {
  return (
    <motion.div
      id="testimonials"
      className="mb-4 justify-center items-center flex flex-col"
      initial={{ opacity: 0, scale: 0.9 }}
      whileInView={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.8, ease: "easeOut", delay: 0.4 }}
    >
      <Image
        className="rounded-full"
        src={URL}
        alt={title}
        width={100}
        height={100}
        priority
      />
      <h4 className="bold-22 text-secondary mt-2">{title}</h4>
      <h5 className="text-gray-500">{Profession}</h5>
      <p className="text-tertiary text-center mt-2">{`"${Desc}"`}</p>
    </motion.div>
  );
};

export default Testimonials;
