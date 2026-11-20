import React from "react";
import Image from "next/image";
import { useTranslations } from "next-intl";
import type { StarterSuggestionItem } from "../types";

function SuggestionIcon({ type }: { type: "packages" | "plan" | "budget" }) {
  if (type === "packages") {
    return (
      <svg
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        className="w-4 h-4 text-[#0796A5] shrink-0"
      >
        <rect x="3" y="4" width="18" height="16" rx="3" />
        <path d="M3 10h18" />
        <path d="M8 2v4" />
        <path d="M16 2v4" />
      </svg>
    );
  }
  if (type === "plan") {
    return (
      <svg
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        className="w-4 h-4 text-[#0796A5] shrink-0"
      >
        <path d="M9 11l3 3L22 4" />
        <path d="M21 12v7a2 2 0 01-2 2H5a2 2 0 01-2-2V5a2 2 0 012-2h11" />
      </svg>
    );
  }
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className="w-4 h-4 text-[#0796A5] shrink-0"
    >
      <path d="M12 2v20M17 5H9.5a3.5 3.5 0 000 7h5a3.5 3.5 0 010 7H6" />
    </svg>
  );
}

export interface ChatEmptyStateProps {
  welcomeTitle: string;
  welcomeBody: string;
  welcomeSuggestions: StarterSuggestionItem[];
  isSending: boolean;
  onSend: (text: string) => void;
}

export const ChatEmptyState: React.FC<ChatEmptyStateProps> = ({
  welcomeTitle,
  welcomeBody,
  welcomeSuggestions,
  isSending,
  onSend,
}) => {
  const t = useTranslations("sunny");

  return (
    <div className="min-h-full flex flex-col items-center gap-5 sm:gap-6 lg:gap-4 text-center pt-4 pb-1 sm:pt-5 sm:pb-1 lg:py-1">
      <div className="flex flex-col items-center my-auto lg:my-0">
        <div className="w-28 h-28 sm:w-[118px] sm:h-[118px] relative flex items-center justify-center select-none shrink-0">
          <Image
            src="/sunny-welcome.webp"
            alt={t("welcome.mascotAlt")}
            width={118}
            height={118}
            className="w-full h-full object-contain"
          />
        </div>

        <h3 className="text-[18px] sm:text-[19px] font-extrabold text-[#102D40] tracking-tight mt-0.5 flex items-center justify-center gap-1.5">
          <span>{welcomeTitle}</span>
          <span aria-hidden="true">👋</span>
        </h3>

        <p className="text-[12.5px] text-[#64748B] leading-snug max-w-[305px] mt-1 lg:mb-2.5">
          {welcomeBody}
        </p>
      </div>

      {/* Three Initial Starter Suggestion Buttons Grounded in Real Inventory */}
      <div className="w-full space-y-2 pb-0.5 lg:mt-auto">
        {welcomeSuggestions.map((suggestion) => (
          <button
            key={suggestion.text}
            type="button"
            disabled={isSending}
            onClick={() => onSend(suggestion.text)}
            className="w-full bg-white hover:bg-[#F7FAFC] border border-[#E2E8F0] hover:border-[#0796A5]/45 rounded-xl px-3.5 py-2 shadow-[0_2px_8px_rgba(16,45,64,0.04)] hover:shadow-[0_4px_14px_rgba(7,150,165,0.12)] flex items-center gap-2.5 text-start transition-all duration-200 cursor-pointer disabled:opacity-50 group"
          >
            <span className="w-7 h-7 rounded-lg bg-[#E3F5F6]/80 group-hover:bg-[#E3F5F6] flex items-center justify-center shrink-0 transition-colors">
              <SuggestionIcon type={suggestion.icon} />
            </span>
            <span className="text-[13px] font-semibold text-[#102D40] group-hover:text-[#073B50] leading-snug">
              {suggestion.text}
            </span>
          </button>
        ))}
      </div>
    </div>
  );
};
