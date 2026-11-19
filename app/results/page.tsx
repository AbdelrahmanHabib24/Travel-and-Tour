"use client";

import React from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { useQuery } from "@tanstack/react-query";
import { useTranslations } from "next-intl";
import { queryKeys } from "@/lib/query/queryKeys";
import { packagesService } from "@/features/packages/services/packages.service";
import type { PackageRecord } from "@/features/packages/types";
import PackageCard from "@/features/packages/components/PackageCard";
import { PackageSkeletonGrid } from "@/features/packages/components/PackageCardSkeleton";

const ResultsPage: React.FC = () => {
  const searchParams = useSearchParams();
  const city = searchParams.get("city") || "";
  const maxPrice = parseFloat(searchParams.get("maxPrice") || "5000");

  const tResults = useTranslations("results");

  const { data: filteredListings = [], isLoading } = useQuery<PackageRecord[]>({
    queryKey: queryKeys.packages.list({ city, maxPrice }),
    queryFn: () => packagesService.getPackages<PackageRecord>({ city, maxPrice }),
    staleTime: 5 * 60 * 1000,
    gcTime: 30 * 60 * 1000,
  });

  return (
    <div className="p-4 max_padd_container mb-14 mt-24 flexCenter fix-height text-start">
      {isLoading ? (
        <PackageSkeletonGrid />
      ) : filteredListings.length > 0 ? (
        <section className="w-full grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredListings.map((rawPkg, index) => (
            <PackageCard key={rawPkg.id} pkg={rawPkg} index={index} />
          ))}
        </section>
      ) : (
        <div className="text-center py-16 w-full">
          <p className="mb-4 text-xl font-semibold text-gray-700">
            {tResults("noResults")}
          </p>
          <p className="text-sm text-gray-500 mb-6">
            {tResults("tryAdjusting")}
          </p>
          <Link
            href="/#listing"
            className="inline-block px-6 py-2.5 rounded-lg bg-secondary text-white font-medium hover:bg-secondary/90 transition shadow-sm"
          >
            {tResults("viewAll")}
          </Link>
        </div>
      )}
    </div>
  );
};

export default ResultsPage;
