"use client";

import React, { useEffect } from "react";
import AOS from "aos";
import "aos/dist/aos.css";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useTranslations } from "next-intl";
import { queryKeys } from "@/lib/query/queryKeys";
import { packagesService } from "@/features/packages/services/packages.service";
import type { PackageRecord } from "../types";
import PackageCard from "./PackageCard";
import { PackageSkeletonGrid } from "./PackageCardSkeleton";

const Listing: React.FC = () => {
  const queryClient = useQueryClient();
  const t = useTranslations("packages-listing");

  useEffect(() => {
    AOS.init({
      duration: 600,
      once: true,
      offset: 100,
    });
  }, []);

  const {
    data: packages = [],
    isLoading,
    isError,
    refetch,
  } = useQuery<PackageRecord[]>({
    queryKey: queryKeys.packages.all,
    queryFn: () => packagesService.getPackages<PackageRecord>(),
    staleTime: 5 * 60 * 1000,
    gcTime: 30 * 60 * 1000,
  });

  return (
    <section className="w-full max_padd_container xl:py-10 py-10" id="listing">
      <header className="mb-10 text-start">
        <h4 className="font-bold text-secondary text-sm sm:text-base md:text-lg">
          {t("badge")}
        </h4>
        <h3 className="font-bold text-2xl sm:text-3xl lg:text-4xl max-w-md mt-1">
          {t("heading")}
        </h3>
        <p className="mt-2 text-gray-700 text-sm sm:text-base md:text-lg max-w-md">
          {t("subheading")}
        </p>
      </header>

      {isLoading ? (
        <PackageSkeletonGrid />
      ) : isError ? (
        <div className="text-center py-10 bg-white rounded-xl border p-6 shadow-sm">
          <p className="text-gray-700 font-medium mb-3">
            {t("errorLoading")}
          </p>
          <button
            onClick={() => refetch()}
            className="px-5 py-2 bg-secondary text-white rounded-lg font-medium hover:opacity-90 transition"
          >
            {t("retry")}
          </button>
        </div>
      ) : packages.length === 0 ? (
        <div className="text-center py-12 bg-white rounded-xl border p-6">
          <p className="text-gray-600">{t("empty")}</p>
        </div>
      ) : (
        <div className="w-full grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 text-start">
          {packages.map((rawPkg, index) => (
            <PackageCard
              key={rawPkg.id}
              pkg={rawPkg}
              index={index}
              aosDelay={index * 100}
              onPrefetch={() => {
                // Preload package in cache before navigation
                queryClient.setQueryData(
                  queryKeys.packages.detail(rawPkg.id),
                  rawPkg,
                );
              }}
            />
          ))}
        </div>
      )}
    </section>
  );
};

export default React.memo(Listing);
