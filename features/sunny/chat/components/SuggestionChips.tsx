import React from "react";

export interface SuggestionChipsProps {
  suggestions: string[];
  isSending: boolean;
  onSelect: (suggestionText: string) => void;
}

export const SuggestionChips: React.FC<SuggestionChipsProps> = ({
  suggestions,
  isSending,
  onSelect,
}) => {
  if (!suggestions || suggestions.length === 0) {
    return null;
  }

  return (
    <div
      className="ps-9 pt-1 space-y-1.5"
    >
      <div className="flex flex-wrap gap-1.5">
        {suggestions.map((suggestionText) => (
          <button
            key={suggestionText}
            type="button"
            disabled={isSending}
            onClick={() => onSelect(suggestionText)}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white hover:bg-[#E3F5F6]/70 border border-[#CBD5E1] hover:border-[#0796A5] text-[#073B50] text-[12px] font-semibold shadow-[0_1px_4px_rgba(16,45,64,0.04)] transition-all duration-150 cursor-pointer disabled:opacity-50 text-start"
          >
            <span
              className="w-1.5 h-1.5 rounded-full bg-[#0796A5] shrink-0"
              aria-hidden="true"
            />
            <span>{suggestionText}</span>
          </button>
        ))}
      </div>
    </div>
  );
};
