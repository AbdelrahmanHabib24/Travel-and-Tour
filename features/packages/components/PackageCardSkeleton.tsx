"use client";

import React from "react";
import { useTranslations } from "next-intl";

export const PackageCardSkeleton: React.FC = () => (
  <div className="p-3 border rounded-xl shadow-md bg-white flex flex-col h-full animate-pulse">
    <div className="relative w-full aspect-video bg-gray-200 rounded-lg mb-4" />
    <div className="h-5 bg-gray-200 rounded w-3/4 mb-2" />
    <div className="h-4 bg-gray-200 rounded w-1/2 mb-3" />
    <div className="space-y-2 mb-4 flex-grow">
      <div className="h-3 bg-gray-200 rounded w-full" />
      <div className="h-3 bg-gray-200 rounded w-5/6" />
    </div>
    <div className="border-t pt-3 mt-auto space-y-2">
      <div className="flex justify-between items-center">
        <div className="h-4 bg-gray-200 rounded w-16" />
        <div className="h-4 bg-gray-200 rounded w-20" />
      </div>
      <div className="flex justify-between items-center pt-1 border-t border-gray-100">
        <div className="h-3 bg-gray-200 rounded w-14" />
        <div className="h-5 bg-gray-200 rounded w-24" />
      </div>
    </div>
  </div>
);

export const PackageSkeletonGrid: React.FC<{
  ariaLabel?: string;
  count?: number;
}> = ({ ariaLabel, count = 6 }) => {
  const t = useTranslations("packages-listing");
  return (
    <div
      className="w-full grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6"
      aria-busy="true"
      aria-label={ariaLabel || t("loadingPackages")}
    >
      {Array.from({ length: count }).map((_, idx) => (
        <PackageCardSkeleton key={idx} />
      ))}
    </div>
  );
};