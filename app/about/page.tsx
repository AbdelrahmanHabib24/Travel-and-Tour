import Image from "next/image";
import Link from "next/link";
import { ChevronRightIcon } from "@heroicons/react/20/solid";
import { getTranslations } from "next-intl/server";

export default async function AboutUs() {
  const t = await getTranslations("about");

  const aboutCards = [
    {
      id: 1,
      heading: t("cards.destinations.heading"),
      imgSrc: "/destination.webp",
      paragraph: t("cards.destinations.paragraph"),
      link: t("cards.destinations.link"),
      href: "/about",
    },
    {
      id: 2,
      heading: t("cards.tours.heading"),
      imgSrc: "/tours.webp",
      paragraph: t("cards.tours.paragraph"),
      link: t("cards.tours.link"),
      href: "/about",
    },
    {
      id: 3,
      heading: t("cards.luxury.heading"),
      imgSrc: "/luxury-travel.webp",
      paragraph: t("cards.luxury.paragraph"),
      link: t("cards.luxury.link"),
      href: "/about",
    },
  ];

  return (
    <div
      id="aboutus-section"
      className="min-h-screen bg-gradient-to-b from-blue-900 via-blue-800 to-blue-700 relative overflow-hidden"
    >
      <Image
        src="/travel.webp"
        alt={t("bgAlt")}
        fill
        sizes="100vw"
        className="object-cover opacity-80"
        quality={90}
        priority
      />

      <div className="absolute inset-0 bg-black/30 z-[1]" />

      <div className="relative z-10 max_padd_container pt-32 pb-24 px-6 sm:px-12 lg:px-16">
        <h3 className="text-center text-orange-400 font-bold text-sm tracking-[0.2em] uppercase mb-2">
          {t("badge")}
        </h3>
        <h4 className="text-center text-3xl lg:text-5xl font-extrabold text-white">
          {t("title")}
        </h4>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 mt-16 gap-8 lg:gap-10">
          {aboutCards.map((item) => (
            <div
              key={item.id}
              className="group relative bg-white rounded-3xl shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 flex flex-col justify-between overflow-hidden"
            >
              <div>
                <div className="w-full h-56 sm:h-60 overflow-hidden relative">
                  <Image
                    src={item.imgSrc}
                    alt={item.heading}
                    fill
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                    className="object-cover w-full h-full transition-transform duration-700 group-hover:scale-105"
                    quality={90}
                    loading="lazy"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent" />
                </div>

                <div className="bg-white pt-6 px-6 sm:px-8">
                  <h4 className="text-2xl font-bold text-gray-900 group-hover:text-orange-500 text-center mb-4 transition-colors duration-300">
                    {item.heading}
                  </h4>
                  <p className="text-gray-600 mb-6 text-center text-sm leading-relaxed">
                    {item.paragraph}
                  </p>
                </div>
              </div>

              <div className="flex justify-center pb-8 px-6 sm:px-8 bg-white">
                <Link
                  href={item.href}
                  className="inline-flex items-center text-orange-500 font-semibold text-base hover:text-orange-600 transition-colors duration-300 group/link"
                  aria-label={t("learnMore", { heading: item.heading })}
                >
                  <span>{item.link}</span>
                  <ChevronRightIcon className="directional-icon ms-1 w-5 h-5 transition-transform duration-300 group-hover/link:translate-x-1" />
                </Link>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
