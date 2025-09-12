"use client";

import React, { useEffect, useState } from "react";
import Image from "next/image";
import { SlLocationPin } from "react-icons/sl";
import { TbStarFilled, TbStarHalfFilled } from "react-icons/tb";
import { RiTimeLine } from "react-icons/ri";
import Link from "next/link";
import AOS from "aos";
import "aos/dist/aos.css";
import GlobalLoading from "../loading";

type PackageType = {
  id: number;
  URL: string;
  title1: string;
  title2: string;
  price: number;
  des: string;
  duration: string;
  rating?: number;
  count?: number;
  images?: { id: number; url: string }[];
};

const StarRating: React.FC<{ rating: number; count: number }> = React.memo(
  ({ rating, count }) => {
    const fullStars = Math.floor(rating);
    const halfStar = rating % 1 !== 0;

    return (
      <div className="text-secondary flex items-center gap-3">
        {[...Array(fullStars)].map((_, index) => (
          <TbStarFilled key={index} />
        ))}
        {halfStar && <TbStarHalfFilled />}
        <span className="text-tertiary">({count})</span>
      </div>
    );
  }
);

const formatPrice = (price: number | string): string => {
  return parseFloat(String(price)).toFixed(2);
};

const Listing: React.FC = () => {
  const [packages, setPackages] = useState<PackageType[]>([]);
  const [loading, setLoading] = useState(true);
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  useEffect(() => {
    if (isMounted) {
      AOS.init({ duration: 800, once: false, offset: 0, anchorPlacement: "top-center" });
      AOS.refresh();
    }
  }, [isMounted]);

  // fetch data from API
  useEffect(() => {
    const fetchPackages = async () => {
      try {
        const res = await fetch("/api/packages"); 
        const data: PackageType[] = await res.json();
        setPackages(data);
        setLoading(false);
      } catch (err) {
        console.error(err);
        setLoading(false);
      }
    };
    fetchPackages();
  }, []);

  if (loading) {
    return <GlobalLoading/>;
  }

  return (
    <section className="max_padd_container xl:py-10 py-10" id="listing">
      <header className="w-[90%] mb-10">
        <h4 className="bold-16 text-secondary text-sm md:text-base">
          TAKE A LOOK AT THESE OFFERS
        </h4>
        <h3 className="bold-28 sm:text-xl md:text-2xl max-w-lg">
          We Provide Top Destinations
        </h3>
        <p className="max-w-lg text-gray-700">
          Discover amazing destinations with top-notch facilities. Explore the world with unbeatable offers and excellent services.
        </p>
      </header>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {packages.map(
          ({ id, URL, title1, title2, price, des, duration, rating = 0, count = 0 }, index) => (
            <article
              key={id}
              className="py-2 px-2 pb-4 border group relative rounded-lg shadow-md hover:shadow-lg transition-shadow duration-500"
              {...(isMounted
                ? {
                    "data-aos": "zoom-in",
                    "data-aos-delay": `${index * 100}`,
                    "data-aos-anchor": "#listing",
                    "data-aos-anchor-placement": "top-center",
                  }
                : {})}
            >
              {URL && (
                <Link href={`/packages/${id}`} aria-label={`View details for ${title1}`} passHref>
                  <div className="transition-transform duration-300 rounded-lg transform group-hover:scale-105 mb-4">
                    <Image
                      src={URL}
                      alt={title1 || "Package image"}
                      width={640}
                      height={366}
                      className="rounded-lg"
                      loading="lazy"
                    />
                  </div>
                  <span className="absolute bottom-56 left-1/2 transform -translate-x-1/2 group-hover:bg-secondary bg-tertiary rounded-2xl text-white px-2 py-1 text-sm md:text-lg lg:text-xl">
                    ${formatPrice(price)}
                  </span>
                </Link>
              )}

              <h4 className="text-lg lg:text-xl font-bold mb-1 ml-1">{title1}</h4>
              <div className="flex items-start justify-start gap-1">
                <SlLocationPin className="text-gray-500" aria-label="Location" />
                <h5 className="text-gray-600 text-sm">{title2}</h5>
              </div>

              <hr className="my-2" />
              <p className="text-sm text-gray-700 mb-3">{des}</p>
              <hr />

              <footer className="flex justify-between mt-3">
                <StarRating rating={rating} count={count} />
                <div className="flex items-center gap-2">
                  <RiTimeLine aria-label="Duration" />
                  <span>{duration}</span>
                </div>
              </footer>
            </article>
          )
        )}
      </div>
    </section>
  );
};

export default Listing;
