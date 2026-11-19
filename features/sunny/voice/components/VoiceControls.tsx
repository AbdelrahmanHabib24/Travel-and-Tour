"use client";

import React from "react";
import {
  Microphone,
  MicrophoneSlash,
  Pause,
  Play,
  PhoneDisconnect,
} from "phosphor-react";
import { useTranslations } from "next-intl";

export interface VoiceControlsProps {
  isPaused: boolean;
  isMuted: boolean;
  isWaitingForAgent: boolean;
  isUpdatingAudio: boolean;
  onTogglePause: () => void;
  onToggleMute: () => void;
  onEndSession: () => void;
}

export const VoiceControls: React.FC<VoiceControlsProps> = ({
  isPaused,
  isMuted,
  isWaitingForAgent,
  isUpdatingAudio,
  onTogglePause,
  onToggleMute,
  onEndSession,
}) => {
  const t = useTranslations("sunny");

  return (
    <div className="pb-6 pt-3 px-6 flex items-center justify-center gap-7 shrink-0">
      {/* Left Button: Pause / Resume */}
      <button
        type="button"
        onClick={onTogglePause}
        disabled={isWaitingForAgent || isUpdatingAudio}
        title={isPaused ? t("session.resume") : t("session.pause")}
        aria-label={isPaused ? t("session.resume") : t("session.pause")}
        className="w-12 h-12 rounded-full bg-gradient-to-b from-[#FFFFFF] to-[#F1F5F9] border border-[#E2E8F0] shadow-[0_4px_12px_rgba(15,23,42,0.08),inset_0_2px_2px_rgba(255,255,255,1)] hover:shadow-[0_6px_16px_rgba(15,23,42,0.12)] flex items-center justify-center text-[#1E293B] transition-all active:scale-95 disabled:opacity-50 cursor-pointer"
      >
        {isPaused ? (
          <Play size={20} weight="fill" className="text-[#07566B]" />
        ) : (
          <Pause size={20} weight="fill" className="text-[#1E293B]" />
        )}
      </button>

      {/* Center Button: Large Glowing Teal/Cyan Microphone Toggle */}
      <button
        type="button"
        onClick={onToggleMute}
        disabled={isWaitingForAgent || isUpdatingAudio}
        title={isMuted ? t("session.unmuteMic") : t("session.muteMic")}
        aria-label={isMuted ? t("session.unmuteMic") : t("session.muteMic")}
        className={`w-[68px] h-[68px] rounded-full p-[3px] transition-all duration-200 active:scale-95 disabled:opacity-60 cursor-pointer ${
          isMuted
            ? "bg-gradient-to-b from-slate-300 to-slate-400 shadow-[0_0_16px_rgba(100,116,139,0.25)]"
            : "bg-gradient-to-b from-[#67E8F9] via-[#22D3EE] to-[#06B6D4] shadow-[0_0_26px_rgba(6,182,212,0.55)] hover:shadow-[0_0_34px_rgba(6,182,212,0.75)]"
        }`}
      >
        <span
          className={`w-full h-full rounded-full flex items-center justify-center text-white border transition-all ${
            isMuted
              ? "bg-gradient-to-b from-slate-600 to-slate-700 border-slate-400/50"
              : "bg-gradient-to-b from-[#0891B2] via-[#0E7490] to-[#064E5B] border-[#CFFAFE]/70"
          }`}
        >
          {isMuted ? (
            <MicrophoneSlash size={28} weight="fill" />
          ) : (
            <Microphone size={28} weight="fill" />
          )}
        </span>
      </button>

      {/* Right Button: White Circular End Call with Red Hangup Icon */}
      <button
        type="button"
        onClick={onEndSession}
        title={t("session.endConversation")}
        aria-label={t("session.endConversation")}
        className="w-12 h-12 rounded-full bg-gradient-to-b from-[#FFFFFF] to-[#F1F5F9] border border-[#E2E8F0] shadow-[0_4px_12px_rgba(15,23,42,0.08),inset_0_2px_2px_rgba(255,255,255,1)] hover:bg-red-50/70 hover:border-red-200 flex items-center justify-center text-[#EF4444] transition-all active:scale-95 cursor-pointer"
      >
        <PhoneDisconnect size={22} weight="fill" />
      </button>
    </div>
  );
};