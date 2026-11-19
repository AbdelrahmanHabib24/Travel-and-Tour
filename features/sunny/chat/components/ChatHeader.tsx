import React from "react";
import Image from "next/image";

export interface ChatHeaderProps {
  title: string;
  subtitle: string;
  closeLabel: string;
  onClose: () => void;
}

export const ChatHeader: React.FC<ChatHeaderProps> = ({
  title,
  subtitle,
  closeLabel,
  onClose,
}) => {
  return (
    <header
      className="bg-gradient-to-r from-[#0796A5] via-[#07566B] to-[#073B50] text-white px-4 pt-3 pb-5 flex items-center justify-between gap-3 shrink-0"
    >
      <div className="flex items-center gap-3 min-w-0">
        {/* Circular Sunny Avatar */}
        <div className="w-10 h-10 rounded-full p-0.5 bg-white/25 ring-2 ring-[#38BDF8]/40 shadow-md shrink-0 overflow-hidden">
          <Image
            src="/sunny-avatar-transparent.png"
            alt={title}
            width={40}
            height={40}
            className="w-full h-full object-cover rounded-full"
          />
        </div>

        {/* Title & Subtitle */}
        <div className="min-w-0 text-start">
          <h2 className="font-bold text-[17px] leading-tight text-white tracking-tight truncate">
            {title}
          </h2>
          <p className="text-[12px] text-white/85 font-normal truncate">
            {subtitle}
          </p>
        </div>
      </div>

      {/* Header Right Controls: Close (✕) */}
      <div className="flex items-center gap-1.5 shrink-0">
        <button
          type="button"
          onClick={onClose}
          title={closeLabel}
          aria-label={closeLabel}
          className="w-7 h-7 rounded-lg flex items-center justify-center text-white/85 hover:text-white hover:bg-white/15 transition cursor-pointer"
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
    </header>
  );
};
