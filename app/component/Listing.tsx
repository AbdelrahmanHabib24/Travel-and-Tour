"use client";

import React, { useEffect, useState, useCallback } from "react";
import Image from "next/image";
import { SlLocationPin } from "react-icons/sl";
import { TbStarFilled, TbStarHalfFilled } from "react-icons/tb";
import { RiTimeLine } from "react-icons/ri";
import Link from "next/link";
import AOS from "aos";
import "aos/dist/aos.css";
import GlobalLoading from "../loading";
import { useQueryClient } from "@tanstack/react-query";

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

const StarRating = React.memo(
  ({ rating = 0, count = 0 }: { rating?: number; count?: number }) => {
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
  }
);

StarRating.displayName = "StarRating"; 

const Listing: React.FC = () => {
  const [packages, setPackages] = useState<PackageType[]>([]);
  const [loading, setLoading] = useState(true);
  const queryClient = useQueryClient();

  useEffect(() => {
    AOS.init({ duration: 800, once: true });
  }, []);

  const fetchPackages = useCallback(async () => {
    try {
      const res = await fetch("/api/packages", { cache: "force-cache" });
      const data: PackageType[] = await res.json();
      setPackages(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchPackages();
  }, [fetchPackages]);

  if (loading) return <GlobalLoading />;

  return (
    <section className="max_padd_container xl:py-10 py-10" id="listing">
      <header className="mb-10">
        <h4 className="font-bold text-secondary text-sm sm:text-base md:text-lg">
          TAKE A LOOK AT THESE OFFERS
        </h4>
        <h3 className="font-bold text-2xl sm:text-3xl lg:text-4xl max-w-md">
          We Provide Top Destinations
        </h3>
        <p className="mt-2 text-gray-700 text-sm sm:text-base md:text-lg max-w-md">
          Discover amazing destinations with top-notch facilities. Explore the
          world with unbeatable offers.
        </p>
      </header>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {packages.map((pkg, index) => (
          <article
            key={pkg.id}
            data-aos="zoom-in"
            data-aos-delay={index * 100}
            className="p-3 border rounded-xl shadow-md hover:shadow-lg transition duration-300 relative group"
          >
            <Link
              href={`/packages/${pkg.id}`}
              aria-label={`View details for ${pkg.title1}`}
              prefetch
              onMouseEnter={() => {
                // Preload package in cache before navigation
                queryClient.setQueryData(["package", String(pkg.id)], pkg);
              }}
            >
              <div className="overflow-hidden rounded-lg mb-4">
                <Image
                  src={pkg.URL}
                  alt={pkg.title1}
                  width={640}
                  height={366}
                  className="rounded-lg group-hover:scale-105 transition-transform duration-300"
                  priority={index < 3}
                  loading={index < 3 ? undefined : "lazy"}
                  placeholder="blur"
                  blurDataURL="/placeholder.jpg"
                />
              </div>
              <span className="absolute bottom-56 left-1/2 transform -translate-x-1/2 bg-tertiary group-hover:bg-secondary text-white px-3 py-1 rounded-2xl text-sm font-semibold">
                ${pkg.price.toFixed(2)}
              </span>

              <h4 className="text-lg lg:text-xl font-bold mb-1">
                {pkg.title1}
              </h4>
              <div className="flex items-center gap-1">
                <SlLocationPin className="text-gray-500" />
                <h5 className="text-gray-600 text-sm">{pkg.title2}</h5>
              </div>

              <p className="text-sm text-gray-700 mt-2 mb-3">{pkg.des}</p>
              <footer className="flex justify-between items-center border-t pt-2">
                <StarRating rating={pkg.rating} count={pkg.count} />
                <div className="flex items-center gap-1 text-sm">
                  <RiTimeLine /> {pkg.duration}
                </div>
              </footer>
            </Link>
          </article>
        ))}
      </div>
    </section>
  );
};

export default React.memo(Listing);
