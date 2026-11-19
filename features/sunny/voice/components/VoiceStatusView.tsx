"use client";

import React from "react";
import type { AgentState, TrackReference } from "@livekit/components-react";
import { Warning, ChatCircleDots, ArrowClockwise } from "phosphor-react";
import { useTranslations } from "next-intl";
import { VoiceOrb } from "../VoiceOrb";

export interface VoiceStatusViewProps {
  hasError: boolean;
  errorCode: string | null;
  agentState: AgentState;
  audioTrack?: TrackReference | null;
  micTrack?: MediaStreamTrack | null;
  isMuted: boolean;
  isPaused: boolean;
  isWaitingForAgent: boolean;
  onSwitchToChat?: () => void;
  onRetry: () => void;
  children?: React.ReactNode;
}

export const VoiceStatusView: React.FC<VoiceStatusViewProps> = ({
  hasError,
  errorCode,
  agentState,
  audioTrack,
  micTrack,
  isMuted,
  isPaused,
  isWaitingForAgent,
  onSwitchToChat,
  onRetry,
  children,
}) => {
  const t = useTranslations("sunny");

  // Top sub-bar with explicit "Back to Chat" control inside the widget body
  const subHeader = (
    <div className="px-4 pt-2.5 pb-1 flex items-center justify-end gap-2 shrink-0">
      {onSwitchToChat && (
        <button
          type="button"
          onClick={onSwitchToChat}
          title={t("session.backToChat")}
          aria-label={t("session.backToChat")}
          className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold text-[#07566B] bg-[#E3F5F6]/80 hover:bg-[#E3F5F6] transition cursor-pointer"
        >
          <ChatCircleDots size={15} weight="fill" className="text-[#0796A5]" />
          <span>{t("session.backToChat")}</span>
        </button>
      )}
    </div>
  );

  // Error State inside the same white Sunny widget body
  if (hasError) {
    const errorDescription =
      errorCode === "micDenied"
        ? t("session.micDenied")
        : errorCode === "micUnavailable"
        ? t("session.micUnavailable")
        : errorCode === "audioUnavailable"
        ? t("session.audioUnavailable")
        : errorCode === "networkLost"
        ? t("session.networkLost")
        : errorCode === "connectionFailed"
        ? t("session.connectionFailed")
        : t("session.errorSubtitle");

    return (
      <div
        role="region"
        aria-label={t("session.errorTitle")}
        className="flex-1 flex flex-col min-h-0 bg-gradient-to-b from-[#FFFFFF] to-[#F7FAFC]"
      >
        {subHeader}

        <div className="flex-1 flex flex-col justify-center items-center px-6 text-center">
          <div className="w-14 h-14 rounded-full bg-amber-50 border border-amber-200 flex items-center justify-center mb-4 text-amber-600 shadow-sm">
            <Warning size={28} weight="bold" />
          </div>
          <h3 className="text-[#0F172A] font-bold text-lg mb-1.5">
            {t("session.errorTitle")}
          </h3>
          <p className="text-[#64748B] text-[13.5px] mb-6 max-w-[290px] leading-relaxed">
            {errorDescription}
          </p>
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={onRetry}
              title={t("session.retry")}
              aria-label={t("session.retry")}
              className="inline-flex items-center justify-center gap-2 py-2.5 px-5 bg-gradient-to-r from-[#0796A5] to-[#07566B] hover:from-[#07566B] hover:to-[#073B50] text-white text-xs font-semibold rounded-full shadow-[0_4px_12px_rgba(7,150,165,0.3)] transition-all cursor-pointer"
            >
              <ArrowClockwise size={15} weight="bold" />
              <span>{t("session.retry")}</span>
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Determine status title and supporting instruction
  const statusLabel = isWaitingForAgent
    ? t("session.connecting")
    : isPaused
    ? t("session.paused")
    : isMuted
    ? t("session.muteMic")
    : agentState === "listening"
    ? t("session.listening")
    : agentState === "thinking"
    ? t("session.thinking")
    : agentState === "speaking"
    ? t("session.speaking")
    : t("session.listening");

  const subtitleHint = isWaitingForAgent
    ? t("session.preparing")
    : isPaused
    ? t("session.pausedHint")
    : isMuted
    ? t("session.mutedHint")
    : agentState === "thinking"
    ? t("session.thinkingHint")
    : agentState === "speaking"
    ? t("session.speakingHint")
    : t("session.listeningHint");

  return (
    <div
      role="region"
      aria-label={t("session.drawerAria")}
      className="flex-1 flex flex-col justify-between min-h-0 bg-gradient-to-b from-[#FFFFFF] to-[#F8FAFC] select-none"
    >
      {/* Top Sub-Header with Back to Chat button */}
      {subHeader}

      {/* Centerpiece: Organic Audio-Reactive Orb + Status Heading + Subtitle */}
      <div
        aria-label={t("session.agentVisualizerAria")}
        className="flex-1 flex flex-col items-center justify-center px-4 min-h-0"
      >
        <VoiceOrb
          state={agentState}
          audioTrack={audioTrack}
          micTrack={micTrack}
          isMuted={isMuted || isWaitingForAgent}
          isPaused={isPaused}
          width={320}
          height={250}
        />

        <h3 className="text-[22px] font-bold text-[#0F172A] tracking-tight text-center mt-1">
          {statusLabel}
        </h3>

        <p className="text-[13.5px] text-[#64748B] font-normal text-center max-w-[310px] leading-relaxed mt-1.5">
          {subtitleHint}
        </p>
      </div>

      {children}
    </div>
  );
};