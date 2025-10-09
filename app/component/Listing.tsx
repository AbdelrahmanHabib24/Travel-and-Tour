/* eslint-disable react/display-name */
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
};

/* ⭐ التقييم */
const StarRating = ({
  rating = 0,
  count = 0,
}: {
  rating?: number;
  count?: number;
}) => {
  const fullStars = Math.floor(rating);
  const hasHalf = rating % 1 !== 0;

  return (
    <div className="text-secondary flex items-center gap-3">
      {[...Array(fullStars)].map((_, i) => (
        <TbStarFilled key={i} />
      ))}
      {hasHalf && <TbStarHalfFilled />}
      <span className="text-tertiary">({count})</span>
    </div>
  );
};

/* 💰 السعر */
const formatPrice = (price: number | string) =>
  parseFloat(String(price)).toFixed(2);

const Listing: React.FC = () => {
  const [packages, setPackages] = useState<PackageType[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    AOS.init({
      duration: 800,
      once: false,
      offset: 0,
      anchorPlacement: "top-center",
    });
  }, []);

  useEffect(() => {
    const fetchPackages = async () => {
      try {
        const res = await fetch("/api/packages", { cache: "force-cache" });
        const data: PackageType[] = await res.json();
        setPackages(data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchPackages();
  }, []);

  if (loading) return <GlobalLoading />;

  return (
    <section className="max_padd_container xl:py-10 py-10" id="listing">
      <header className="w-full mb-4 sm:mb-8 md:mb-10 max-w-full">
        <h4 className="font-bold text-secondary text-sm sm:text-base md:text-lg">
          TAKE A LOOK AT THESE OFFERS
        </h4>

        <h3 className="font-bold text-lg sm:text-xl md:text-2xl lg:text-3xl max-w-full sm:max-w-md">
          We Provide Top Destinations
        </h3>

        <p className="mt-2 text-gray-700 text-sm sm:text-base md:text-lg max-w-full sm:max-w-md">
          Discover amazing destinations with top-notch facilities. Explore the
          world with unbeatable offers and excellent services.
        </p>
      </header>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {packages.map((pkg, index) => (
          <article
            key={pkg.id}
            data-aos="zoom-in"
            data-aos-delay={index * 100}
            className="py-2 px-2 pb-4 border group relative rounded-lg shadow-md hover:shadow-lg transition-shadow duration-500"
          >
            {pkg.URL && (
              <Link
                href={`/packages/${pkg.id}`}
                aria-label={`View details for ${pkg.title1}`}
              >
                <div className="transition-transform duration-300 rounded-lg transform group-hover:scale-105 mb-4">
                  <Image
                    src={pkg.URL}
                    alt={pkg.title1}
                    width={640}
                    height={366}
                    className="rounded-lg"
                    {...(index < 3 ? { priority: true } : { loading: "lazy" })}
                  />
                </div>
                <span className="absolute bottom-56 left-1/2 transform -translate-x-1/2 group-hover:bg-secondary bg-tertiary rounded-2xl text-white px-2 py-1 text-sm md:text-lg lg:text-xl">
                  ${formatPrice(pkg.price)}
                </span>
              </Link>
            )}

            <h4 className="text-lg lg:text-xl font-bold mb-1 ml-1">
              {pkg.title1}
            </h4>

            <div className="flex items-start gap-1">
              <SlLocationPin className="text-gray-500" aria-label="Location" />
              <h5 className="text-gray-600 text-sm">{pkg.title2}</h5>
            </div>

            <hr className="my-2" />
            <p className="text-sm text-gray-700 mb-3">{pkg.des}</p>
            <hr />

            <footer className="flex justify-between mt-3">
              <StarRating rating={pkg.rating} count={pkg.count} />
              <div className="flex items-center gap-2">
                <RiTimeLine aria-label="Duration" />
                <span>{pkg.duration}</span>
              </div>
            </footer>
          </article>
        ))}
      </div>
    </section>
  );
};

export default Listing;
