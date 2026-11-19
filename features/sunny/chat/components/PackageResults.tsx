import React from "react";
import type { PackageRecord } from "../types";
import { INITIAL_VISIBLE_PACKAGES } from "../constants";
import { ChatPackageCard } from "./ChatPackageCard";

export interface PackageResultsProps {
  messageId: string;
  packages: PackageRecord[];
  visibleCount: number;
  isLatestAssistant: boolean;
  isSending: boolean;
  nextPriceTier?: number | null;
  canShowAllTrips?: boolean;
  viewDetailsLabel: string;
  durationUnavailableLabel: string;
  showMoreTripsLabel: (remaining: number) => string;
  showFewerTripsLabel: string;
  showNextPriceTierLabel: (tierPrice: number) => string;
  showNextPriceTierPrompt: string;
  showAllTripsButtonLabel: string;
  showAllTripsPrompt: string;
  onShowMore: (messageId: string, totalCount: number) => void;
  onShowFewer: (messageId: string) => void;
  onSend: (text: string) => void;
}

export const PackageResults: React.FC<PackageResultsProps> = ({
  messageId,
  packages,
  visibleCount,
  isLatestAssistant,
  isSending,
  nextPriceTier,
  canShowAllTrips,
  viewDetailsLabel,
  durationUnavailableLabel,
  showMoreTripsLabel,
  showFewerTripsLabel,
  showNextPriceTierLabel,
  showNextPriceTierPrompt,
  showAllTripsButtonLabel,
  showAllTripsPrompt,
  onShowMore,
  onShowFewer,
  onSend,
}) => {
  if (!packages || packages.length === 0) {
    return null;
  }

  const visiblePackages = packages.slice(0, visibleCount);
  const remainingCount = Math.max(0, packages.length - visibleCount);

  return (
    <div
      className="space-y-2 ps-2 sm:ps-3"
    >
      {visiblePackages.map((pkg) => (
        <ChatPackageCard
          key={pkg.id}
          pkg={pkg}
          viewDetailsLabel={viewDetailsLabel}
          durationUnavailableLabel={durationUnavailableLabel}
        />
      ))}

      {/* Pagination strictly within current matched group */}
      {remainingCount > 0 ? (
        <button
          type="button"
          onClick={() => onShowMore(messageId, packages.length)}
          className="w-full py-2 px-3 rounded-xl bg-white hover:bg-[#E3F5F6]/50 border border-[#0796A5]/35 text-[#07566B] font-bold text-[12px] flex items-center justify-center gap-1.5 shadow-2xs transition cursor-pointer"
        >
          <span>{showMoreTripsLabel(remainingCount)}</span>
          <svg
            viewBox="0 0 20 20"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            className="w-3.5 h-3.5"
          >
            <path
              d="M5 7.5L10 12.5L15 7.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </button>
      ) : (
        packages.length > INITIAL_VISIBLE_PACKAGES && (
          <button
            type="button"
            onClick={() => onShowFewer(messageId)}
            className="w-full py-1.5 px-3 rounded-xl bg-transparent hover:bg-[#F1F5F9] text-[#64748B] font-semibold text-[11.5px] flex items-center justify-center gap-1 transition cursor-pointer"
          >
            <span>{showFewerTripsLabel}</span>
            <svg
              viewBox="0 0 20 20"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              className="w-3.5 h-3.5 rotate-180"
            >
              <path
                d="M5 7.5L10 12.5L15 7.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </button>
        )
      )}

      {/* Separate Explicit Actions: 'Show the next price tier' and 'Show all available trips' */}
      {isLatestAssistant &&
        remainingCount === 0 &&
        (typeof nextPriceTier === "number" || canShowAllTrips) && (
          <div className="flex flex-wrap items-center gap-1.5 pt-1">
            {typeof nextPriceTier === "number" && (
              <button
                type="button"
                disabled={isSending}
                onClick={() => onSend(showNextPriceTierPrompt)}
                className="flex-1 min-w-[160px] py-1.5 px-3 rounded-xl bg-[#E3F5F6]/70 hover:bg-[#0796A5] text-[#07566B] hover:text-white border border-[#0796A5]/40 font-bold text-[11.5px] flex items-center justify-center gap-1.5 transition cursor-pointer disabled:opacity-50"
              >
                <span>{showNextPriceTierLabel(nextPriceTier)}</span>
              </button>
            )}
            {canShowAllTrips && (
              <button
                type="button"
                disabled={isSending}
                onClick={() => onSend(showAllTripsPrompt)}
                className="py-1.5 px-3 rounded-xl bg-white hover:bg-[#F1F5F9] text-[#475569] border border-[#CBD5E1] font-semibold text-[11.5px] flex items-center justify-center gap-1 transition cursor-pointer disabled:opacity-50"
              >
                <span>{showAllTripsButtonLabel}</span>
              </button>
            )}
          </div>
        )}
    </div>
  );
};
