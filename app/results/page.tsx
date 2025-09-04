/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable @typescript-eslint/no-unused-vars */
"use client";

import React, { useEffect, useState, useCallback } from 'react';
import { useSearchParams } from 'next/navigation';
import { PACKAGES } from '@/app/ulits/type';
import Link from 'next/link';
import Image from 'next/image';
import { SlLocationPin } from 'react-icons/sl';
import { RiTimeLine } from 'react-icons/ri';

type ListingType = {
  id: string;
  title1: string;
  title2: string;
  city?: string;
  date?: string;
  price: string;
  duration?: string;
  rating?: number;
  count?: number;
  URL: string;
  des: string;
};

const ResultsPage: React.FC = () => {
  const searchParams = useSearchParams();

  const city = searchParams.get('city') || '';
  const date = searchParams.get('date') || '';
  const maxPrice = parseFloat(searchParams.get('maxPrice') || '5000');

  const [loading, setLoading] = useState(true); 
  const [filteredListings, setFilteredListings] = useState<ListingType[]>([]); 

  const filterListings = useCallback(() => {
    setLoading(true); 

    const searchTerm = city.toLowerCase();
    const results = PACKAGES.filter((listing) => {
      const isMatch = listing.title1.toLowerCase().includes(searchTerm) ||
                      listing.title2.toLowerCase().includes(searchTerm);

      const isPriceMatch = parseFloat(listing.price) <= maxPrice;

      return isMatch && isPriceMatch;
    });

    setFilteredListings(results);
    setLoading(false); 
  }, [city, maxPrice]);

  useEffect(() => {
    filterListings();
  }, [filterListings]);

  return (
    <div className="p-4 max_padd_container mb-14 mt-24 flexCenter fix-height">
      {loading ? (
        <div className="text-center mt-48">
          <p className="text-lg text-gray-600">Loading results...</p>
        </div>
      ) : (
        filteredListings.length > 0 ? (
          <section className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredListings.map(({ id, URL, title1, title2, price, des, duration }: ListingType) => (
              <article
                key={id}
                className="py-4 px-4 max-w-lg pb-6 border rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300"
              >
                {URL ? (
                  <Link
                    href={`/packages/${id}`}
                    aria-label={`View details for ${title1}`}
                    passHref
                    className="overflow-hidden relative block"
                  >
                    <Image
                      src={URL}
                      alt={title1 || "Package image"}
                      width={640}
                      height={366}
                      className="transition-transform duration-300 rounded-lg transform group-hover:scale-105 mb-4"
                      unoptimized={true}
                    />
                    {price && (
                      <span
                        className="absolute bottom-5 left-1/2 transform -translate-x-1/2 group-hover:bg-secondary bg-tertiary rounded-2xl text-white px-4 py-2 text-lg"
                      >
                        ${parseFloat(price).toFixed(2)}
                      </span>
                    )}
                  </Link>
                ) : (
                  <div className="w-full h-48 bg-gray-300 rounded-lg mb-4"></div>
                )}

                <h4 className="text-lg font-bold mb-2">{title1}</h4>
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <SlLocationPin />
                  <span>{title2}</span>
                </div>

                <p className="text-sm text-gray-700 mt-2">{des}</p>

                <hr className="my-2" />

                <footer className="flex justify-between mt-4 text-sm text-gray-600">
                  <div className="flex items-center gap-2">
                    <RiTimeLine />
                    <span>{duration}</span>
                  </div>
                </footer>
              </article>
            ))}
          </section>
        ) : (
          <p className="text-center mb-10 text-lg text-gray-600">
            No matching items found. You can modify your search for better results.
          </p>
        )
      )}
    </div>
  );
};

export default ResultsPage;
