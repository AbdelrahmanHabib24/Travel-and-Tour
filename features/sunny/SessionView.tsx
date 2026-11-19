"use client";

import React, { useEffect, useState, useRef, useCallback } from "react";
import {
  RoomAudioRenderer,
  StartAudio,
  RoomContext,
  useRoomContext,
  useLocalParticipant,
} from "@livekit/components-react";
import { ConnectionState } from "livekit-client";
import { toast as sonnerToast } from "sonner";
import { Warning } from "phosphor-react";
import { useTranslations, useLocale } from "next-intl";
import type { ChatMessageItem, VoiceSyncedTurn } from "./chat/types";
import { MICROPHONE_CAPTURE_OPTIONS, type MicrophonePreferences } from "./voice/audio";
import { useVoiceConnection } from "./voice/useVoiceConnection";
import {
  isAgentAvailable,
  useSunnyVoiceAssistant,
} from "./voice/hooks/useSunnyVoiceAssistant";
import { useVoiceTranscriptSync } from "./voice/hooks/useVoiceTranscriptSync";
import { VoiceControls } from "./voice/components/VoiceControls";
import { VoiceStatusView } from "./voice/components/VoiceStatusView";

function toastAlert(toast: {
  title: React.ReactNode;
  description: React.ReactNode;
}) {
  return sonnerToast.custom(
    (id) => (
      <div
        onClick={() => sonnerToast.dismiss(id)}
        className="flex items-start gap-3 bg-gradient-to-r from-[#0796A5] to-[#07566B] text-white cursor-pointer rounded-xl p-4 shadow-lg"
      >
        <Warning weight="bold" className="text-yellow-300" />
        <div className="flex flex-col">
          <strong className="font-semibold">{toast.title}</strong>
          {toast.description && (
            <div className="text-sm opacity-90">{toast.description}</div>
          )}
        </div>
      </div>
    ),
    { duration: 10_000 }
  );
}

export interface SessionViewProps {
  showCard: boolean;
  setShowCard: React.Dispatch<React.SetStateAction<boolean>>;
  onEndSession: () => void;
  onSwitchToChat?: () => void;
  isPreConnectBufferEnabled?: boolean;
  isConnecting?: boolean;
  hasError?: boolean;
  errorCode?: string | null;
  onRetry?: () => void;
  conversationHistory?: ChatMessageItem[];
  onSyncVoiceMessages?: (turns: VoiceSyncedTurn[]) => void;
}

const SessionViewInner = ({
  onEndSession,
  onSwitchToChat,
  setShowCard,
  showCard,
  isConnecting = false,
  hasError = false,
  errorCode = null,
  onRetry,
  onSyncVoiceMessages,
  onMicPreferencesChange,
}: SessionViewProps & { onMicPreferencesChange: (value: MicrophonePreferences) => void }) => {
  const t = useTranslations("sunny");
  const room = useRoomContext();

  const {
    agent: agentParticipant,
    state: agentState,
    audioTrack,
  } = useSunnyVoiceAssistant();
  const { localParticipant, microphoneTrack, isMicrophoneEnabled } = useLocalParticipant();

  useVoiceTranscriptSync({
    agentIdentity: agentParticipant?.identity,
    onSyncVoiceMessages,
  });

  const [isMuted, setIsMuted] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [updatingParticipant, setUpdatingParticipant] = useState<typeof localParticipant | null>(null);
  const isUpdatingAudio = updatingParticipant === localParticipant;
  const audioOperationRef = useRef(0);

  useEffect(() => {
    // Disregard completion of a control operation belonging to a replaced Room.
    audioOperationRef.current += 1;
  }, [localParticipant]);

  useEffect(() => {
    onMicPreferencesChange({ muted: isMuted, paused: isPaused });
  }, [isMuted, isPaused, onMicPreferencesChange]);

  useEffect(() => {
    const enabled = !isMuted && !isPaused;
    if (isConnecting || hasError || isUpdatingAudio || room.state !== ConnectionState.Connected || isMicrophoneEnabled === enabled) return;
    // Apply the user's preference to the replacement participant as well.
    void localParticipant.setMicrophoneEnabled(enabled, MICROPHONE_CAPTURE_OPTIONS, { dtx: false }).catch(() => {});
  }, [localParticipant, room, isMuted, isPaused, isConnecting, hasError, isUpdatingAudio, isMicrophoneEnabled]);

  // The hook reacts to publication/restart events as well as mute state changes.
  const micTrack = microphoneTrack?.track?.mediaStreamTrack || null;

  // Diagnostic logs for agent discovery, state transitions, and remote audio track subscription
  useEffect(() => {
    if (agentParticipant) {
      console.info(
        `[SunnyVoiceDiag] ${new Date().toISOString()} Remote agent active: identity=${
          agentParticipant.identity
        } agentName=${
          agentParticipant.attributes?.["lk.agent.name"] ||
          agentParticipant.attributes?.["lkAgentName"] ||
          "(unnamed)"
        } state=${agentState} hasAudioTrack=${Boolean(
          audioTrack?.publication?.track
        )}`
      );
    }
  }, [agentParticipant, agentState, audioTrack?.publication?.track]);

  const toggleMute = async () => {
    if (isUpdatingAudio) return;
    const nextMuted = !isMuted;
    const operation = ++audioOperationRef.current;
    setIsMuted(nextMuted);
    onMicPreferencesChange({ muted: nextMuted, paused: isPaused });
    setUpdatingParticipant(localParticipant);
    try {
      if (!isPaused) {
        await localParticipant.setMicrophoneEnabled(!nextMuted, MICROPHONE_CAPTURE_OPTIONS, { dtx: false });
      }
    } catch {
      if (audioOperationRef.current === operation) {
        setIsMuted(isMuted);
        onMicPreferencesChange({ muted: isMuted, paused: isPaused });
        toastAlert({ title: t("session.errorTitle"), description: t("session.audioUnavailable") });
      }
    } finally {
      if (audioOperationRef.current === operation) setUpdatingParticipant(null);
    }
  };

  const togglePause = async () => {
    if (isUpdatingAudio) return;
    const nextPaused = !isPaused;
    const operation = ++audioOperationRef.current;
    setIsPaused(nextPaused);
    onMicPreferencesChange({ muted: isMuted, paused: nextPaused });
    setUpdatingParticipant(localParticipant);
    try {
      await localParticipant.setMicrophoneEnabled(!nextPaused && !isMuted, MICROPHONE_CAPTURE_OPTIONS, { dtx: false });
      if (audioOperationRef.current !== operation) return;
      audioTrack?.publication?.track?.attachedElements.forEach((element) => {
        if (nextPaused) element.pause();
        else void element.play().catch(() => {});
      });
    } catch {
      if (audioOperationRef.current === operation) {
        setIsPaused(isPaused);
        onMicPreferencesChange({ muted: isMuted, paused: isPaused });
        toastAlert({ title: t("session.errorTitle"), description: t("session.audioUnavailable") });
      }
    } finally {
      if (audioOperationRef.current === operation) setUpdatingParticipant(null);
    }
  };

  useEffect(() => {
    if (!isPaused && agentState === "speaking" && audioTrack?.publication?.track) {
      audioTrack.publication.track.attachedElements.forEach((el) => {
        el.play().catch(() => {});
      });
    }
  }, [agentState, audioTrack, isPaused]);

  if (!showCard) return null;

  const isWaitingForAgent = isConnecting || !isAgentAvailable(agentState);

  const handleRetry = () => {
    if (onRetry) {
      onRetry();
    } else {
      setShowCard(false);
      onEndSession();
    }
  };

  const handleEndCall = () => {
    setShowCard(false);
    onEndSession();
  };

  return (
    <VoiceStatusView
      hasError={hasError}
      errorCode={errorCode}
      agentState={agentState}
      audioTrack={audioTrack}
      micTrack={micTrack}
      isMuted={isMuted}
      isPaused={isPaused}
      isWaitingForAgent={isWaitingForAgent}
      onSwitchToChat={onSwitchToChat}
      onRetry={handleRetry}
    >
      <VoiceControls
        isPaused={isPaused}
        isMuted={isMuted}
        isWaitingForAgent={isWaitingForAgent}
        isUpdatingAudio={isUpdatingAudio}
        onTogglePause={togglePause}
        onToggleMute={toggleMute}
        onEndSession={handleEndCall}
      />
    </VoiceStatusView>
  );
};

export const SessionView = (props: SessionViewProps) => {
  const { onEndSession, onRetry } = props;
  const locale = useLocale();
  const t = useTranslations("sunny");
  const connection = useVoiceConnection({
    locale,
    history: props.conversationHistory || [],
    isPreConnectBufferEnabled: props.isPreConnectBufferEnabled ?? true,
  });
  const { disconnect, retry } = connection;
  const handleEnd = useCallback(() => {
    disconnect();
    onEndSession();
  }, [disconnect, onEndSession]);
  const handleRetry = useCallback(() => {
    retry();
    onRetry?.();
  }, [retry, onRetry]);

  if (!connection.room) {
    return <div role="status" className="flex-1 flex items-center justify-center text-sm text-[#64748B]">{t("session.connecting")}</div>;
  }

  return (
    <RoomContext.Provider value={connection.room}>
      <RoomAudioRenderer />
      <StartAudio
        label={t("session.startAudio")}
        className="absolute w-0 h-0 opacity-0 pointer-events-none"
      />
      <SessionViewInner
        {...props}
        isConnecting={props.isConnecting ?? (connection.isConnecting || !connection.ready)}
        hasError={props.hasError ?? connection.hasError}
        errorCode={connection.errorCode}
        onRetry={handleRetry}
        onEndSession={handleEnd}
        onMicPreferencesChange={connection.updateMicrophonePreferences}
      />
    </RoomContext.Provider>
  );
};

export default SessionView;
