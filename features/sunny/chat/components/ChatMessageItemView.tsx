import React from "react";
import Image from "next/image";
import { useTranslations } from "next-intl";
import type { ChatMessageItem, PackageRecord, SupportedLanguage } from "../types";
import {
  isExplicitComparisonRequest,
  resolvePackagesForTurn,
} from "../utils/packageResolver";
import { formatPackagePrice } from "@/lib/i18n/packageLocalization";
import { resolveContextualSuggestions } from "../utils/suggestions";
import {
  buildCollapsedPreview,
  isLongAssistantMessage,
  renderFormattedContent,
  stripDuplicateMarkdownTables,
} from "../utils/messageFormatter";
import { PackageResults } from "./PackageResults";
import { SuggestionChips } from "./SuggestionChips";

export interface ChatMessageItemViewProps {
  msg: ChatMessageItem;
  msgIdx: number;
  allMessages: ChatMessageItem[];
  dbPackages: PackageRecord[];
  visiblePackageCount: number;
  isExpanded: boolean;
  isDrafting: boolean;
  isSending: boolean;
  activeLanguage: SupportedLanguage;
  onToggleExpanded: (messageId: string) => void;
  onShowMoreTrips: (messageId: string, totalCount: number) => void;
  onShowFewerTrips: (messageId: string) => void;
  onSend: (text: string) => void;
}

export const ChatMessageItemView: React.FC<ChatMessageItemViewProps> = ({
  msg,
  msgIdx,
  allMessages,
  dbPackages,
  visiblePackageCount,
  isExpanded,
  isDrafting,
  isSending,
  activeLanguage,
  onToggleExpanded,
  onShowMoreTrips,
  onShowFewerTrips,
  onSend,
}) => {
  const t = useTranslations("sunny");
  const isUser = msg.role === "user";

  if (isUser) {
    return (
      <div className="flex items-start justify-end gap-2">
        <div
          dir="auto"
          className="max-w-[78%] rounded-2xl rounded-se-sm bg-[#DDF2F4] text-[#102D40] px-3.5 py-2.5 text-[13.5px] font-medium shadow-[0_2px_8px_rgba(7,59,80,0.05)] break-words text-start"
        >
          <p className="whitespace-pre-wrap leading-relaxed text-[#102D40]">
            {msg.content}
          </p>
        </div>

        {/* Subtle User Avatar Circle */}
        <div className="w-7 h-7 rounded-full bg-[#E2E8F0] text-[#5B7C99] flex items-center justify-center shrink-0 mt-0.5 shadow-2xs">
          <svg
            viewBox="0 0 20 20"
            fill="currentColor"
            className="w-3.5 h-3.5"
          >
            <path d="M10 8a3 3 0 100-6 3 3 0 000 6zM3.465 14.493a1.23 1.23 0 00.41 1.412A9.957 9.957 0 0010 18c2.31 0 4.438-.784 6.131-2.1.43-.333.604-.903.408-1.41a7.002 7.002 0 00-13.074.003z" />
          </svg>
        </div>
      </div>
    );
  }

  const matchedPackages = resolvePackagesForTurn(msg, dbPackages);

  // Ensure we never render a duplicate Markdown table when package cards are shown
  const cleanProse =
    matchedPackages.length > 0 &&
    !msg.explicitTableRequested &&
    !isExplicitComparisonRequest(msg.userQuery)
      ? stripDuplicateMarkdownTables(
          msg.content,
          t("actions.defaultPackageLead")
        )
      : msg.content;

  const isLong = isLongAssistantMessage(cleanProse);
  const displayedContent =
    isLong && !isExpanded ? buildCollapsedPreview(cleanProse) : cleanProse;

  const isLatestAssistant =
    msgIdx === allMessages.length - 1 &&
    msg.role === "assistant" &&
    !isSending &&
    !isDrafting;
  const contextualSuggestions = isLatestAssistant
    ? resolveContextualSuggestions(msg, allMessages, activeLanguage)
    : [];

  return (
    <div className="space-y-2.5">
      <div className="flex items-start justify-start gap-2">
        {/* Sunny Avatar beside Assistant Message */}
        <div className="w-7 h-7 rounded-full overflow-hidden ring-1 ring-[#E2E8F0] shadow-xs shrink-0 mt-0.5 bg-white">
          <Image
            src="/sunny-avatar-transparent.png"
            alt={t("header.avatarAlt")}
            width={28}
            height={28}
            className="w-full h-full object-cover"
          />
        </div>

        <div
          dir="auto"
          className="max-w-[85%] rounded-2xl rounded-ss-sm bg-[#EEF2F6] text-[#102D40] px-3.5 py-2.5 text-[13.5px] shadow-[0_2px_8px_rgba(16,45,64,0.04)] break-words text-start"
        >
          {renderFormattedContent(displayedContent)}

          {isLong && (
            <button
              type="button"
              onClick={() => onToggleExpanded(msg.id)}
              className="mt-2 inline-flex items-center gap-1 text-[12px] font-bold text-[#0796A5] hover:text-[#07566B] transition cursor-pointer"
            >
              <span>
                {isExpanded ? t("actions.showLess") : t("actions.showMore")}
              </span>
              <svg
                viewBox="0 0 20 20"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                className={`w-3.5 h-3.5 transition-transform ${
                  isExpanded ? "rotate-180" : ""
                }`}
              >
                <path
                  d="M5 7.5L10 12.5L15 7.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </button>
          )}
        </div>
      </div>

      {/* Smart Travel Package Cards with pagination & action buttons */}
      <PackageResults
        messageId={msg.id}
        packages={matchedPackages}
        visibleCount={visiblePackageCount}
        isLatestAssistant={isLatestAssistant}
        isSending={isSending}
        nextPriceTier={msg.nextPriceTier}
        canShowAllTrips={msg.canShowAllTrips}
        viewDetailsLabel={t("actions.viewDetails")}
        durationUnavailableLabel={t("actions.durationUnavailable")}
        showMoreTripsLabel={(remaining) =>
          t("actions.showMoreTrips", { remaining })
        }
        showFewerTripsLabel={t("actions.showFewerTrips")}
        showNextPriceTierLabel={(tierPrice) =>
          t("actions.showNextPriceTier", {
            tierPrice: formatPackagePrice(tierPrice, activeLanguage, "USD"),
          })
        }
        showNextPriceTierPrompt={t("actions.showNextPriceTierPrompt")}
        showAllTripsButtonLabel={t("actions.showAllTripsButton")}
        showAllTripsPrompt={t("actions.showAllTripsPrompt")}
        onShowMore={onShowMoreTrips}
        onShowFewer={onShowFewerTrips}
        onSend={onSend}
      />

      {/* Contextual Follow-up Suggestions */}
      <SuggestionChips
        suggestions={contextualSuggestions}
        isSending={isSending}
        onSelect={onSend}
      />
    </div>
  );
};
