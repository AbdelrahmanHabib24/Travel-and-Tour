import React from "react";

export interface ChatMinimizedBarProps {
  expandLabel: string;
  closeLabel: string;
  onExpand: () => void;
  onClose: () => void;
}

export const ChatMinimizedBar: React.FC<ChatMinimizedBarProps> = ({
  expandLabel,
  closeLabel,
  onExpand,
  onClose,
}) => {
  return (
    <div
      className="fixed bottom-4 end-4 sm:bottom-6 sm:end-6 z-50 w-[300px] sm:w-[330px] rounded-2xl bg-gradient-to-r from-[#0796A5] via-[#07566B] to-[#073B50] text-white shadow-[0_14px_34px_rgba(7,59,80,0.35)] border border-white/15 px-4 py-2.5 flex items-center justify-between gap-3 transition-all duration-200"
    >

      <div className="flex items-center gap-1 shrink-0">
        <button
          type="button"
          onClick={onExpand}
          title={expandLabel}
          aria-label={expandLabel}
          className="p-1.5 rounded-lg hover:bg-white/15 text-white/90 hover:text-white transition cursor-pointer"
        >
          <svg
            viewBox="0 0 20 20"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            className="w-4 h-4"
          >
            <path
              d="M5 12.5L10 7.5L15 12.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </button>
        <button
          type="button"
          onClick={onClose}
          title={closeLabel}
          aria-label={closeLabel}
          className="p-1.5 rounded-lg hover:bg-white/15 text-white/90 hover:text-white transition cursor-pointer"
        >
          <svg
            viewBox="0 0 20 20"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            className="w-4 h-4"
          >
            <path
              d="M5 5l10 10M15 5L5 15"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </button>
      </div>
    </div>
  );
};
