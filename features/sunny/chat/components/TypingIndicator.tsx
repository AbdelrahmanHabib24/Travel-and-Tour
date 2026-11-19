"use client";

import React from "react";
import Image from "next/image";
import { useTranslations } from "next-intl";

export const TypingIndicator: React.FC = () => {
  const t = useTranslations("sunny");

  return (
    <div className="flex items-center gap-2">
      <div className="w-7 h-7 rounded-full overflow-hidden ring-1 ring-[#E2E8F0] shadow-xs shrink-0 bg-white">
        <Image
          src="/sunny-avatar-transparent.png"
          alt={t("header.avatarAlt")}
          width={28}
          height={28}
          className="w-full h-full object-cover"
        />
      </div>
      <div className="bg-[#EEF2F6] rounded-full px-3.5 py-2.5 inline-flex items-center gap-1.5 shadow-2xs">
        <span className="w-2 h-2 rounded-full bg-[#0796A5] animate-bounce [animation-delay:-0.3s]" />
        <span className="w-2 h-2 rounded-full bg-[#0796A5]/70 animate-bounce [animation-delay:-0.15s]" />
        <span className="w-2 h-2 rounded-full bg-[#94A3B8] animate-bounce" />
      </div>
    </div>
  );
};
