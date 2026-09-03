"use client";

import React, { useEffect, useState, useRef, useCallback } from "react";
import { Room, RoomEvent } from "livekit-client";
import {
  RoomAudioRenderer,
  StartAudio,
  RoomContext,
} from "@livekit/components-react";

import FloatingAssistant from "@/app/component/FloatingAssistant";
import { SessionView } from "@/app/component/SessionView";
import { ConnectionDetails } from "@/app/api/connection-details/route";
import { usePathname } from "next/navigation";

interface AppConfig {
  startButtonText: string;
  isPreConnectBufferEnabled: boolean;
}

interface AppRootProps {
  appConfig: AppConfig;
  autoStartSession?: boolean;
}

const AppRoot = ({ appConfig, autoStartSession = false }: AppRootProps) => {
  const pathname = usePathname();

  // Hide Sunny AI on authentication pages
  const isAuthPage = Boolean(
    pathname && (
      pathname.toLowerCase().startsWith("/login") ||
      pathname.toLowerCase().startsWith("/signup") ||
      pathname.toLowerCase().startsWith("/sign-up") ||
      pathname.toLowerCase().startsWith("/register") ||
      pathname.toLowerCase().startsWith("/forgot-password") ||
      pathname.toLowerCase().startsWith("/reset-password") ||
      pathname.toLowerCase().startsWith("/auth")
    )
  );

  const roomRef = useRef<Room | null>(null);
  const [sessionStarted, setSessionStarted] = useState(autoStartSession);
  const [showCard, setShowCard] = useState(false);
  const [ready, setReady] = useState(false);
  const [isConnecting, setIsConnecting] = useState(false);
  const [hasError, setHasError] = useState(false);
  const connectionAbortRef = useRef<boolean>(false);

  if (!roomRef.current) {
    roomRef.current = new Room();
  }
  const room = roomRef.current;

  const handleEndSession = useCallback(() => {
    connectionAbortRef.current = true;
    setSessionStarted(false);
    setShowCard(false);
    setReady(false);
    setIsConnecting(false);
    setHasError(false);
    if (room.state !== "disconnected") {
      room.localParticipant.setMicrophoneEnabled(false).catch(() => {});
      room.disconnect();
    }
  }, [room]);

  // Connects only after backend confirms Sunny AI is ready
  const startConnecting = useCallback(async () => {
    connectionAbortRef.current = false;
    setHasError(false);
    setIsConnecting(true);
    setReady(false);

    const startTime = Date.now();
    const maxWaitMs = 45_000;

    try {
      let details: ConnectionDetails | null = null;

      while (!connectionAbortRef.current) {
        if (Date.now() - startTime > maxWaitMs) {
          throw new Error("Connection timeout");
        }

        try {
          const res = await fetch("/api/connection-details", { cache: "no-store" });
          if (res.ok) {
            const data: ConnectionDetails = await res.json();
            if (data?.ready && data?.serverUrl && data?.participantToken) {
              details = data;
              break;
            }
          }
        } catch {
          // Keep checking
        }

        if (connectionAbortRef.current) return;
        await new Promise((resolve) => setTimeout(resolve, 2000));
      }

      if (connectionAbortRef.current || !details?.serverUrl || !details?.participantToken) {
        return;
      }

      // Agent is verified ready on the backend; connect to room now
      if (room.state !== "disconnected") {
        room.disconnect();
      }

      await room.connect(details.serverUrl, details.participantToken);
      if (connectionAbortRef.current) {
        room.disconnect();
        return;
      }

      await room.localParticipant.setMicrophoneEnabled(true, undefined, {
        preConnectBuffer: appConfig.isPreConnectBufferEnabled,
      });

      setReady(true);
      setIsConnecting(false);
    } catch (err) {
      if (!connectionAbortRef.current) {
        console.error("Connection error:", err);
        setIsConnecting(false);
        setHasError(true);
        room.disconnect();
      }
    }
  }, [room, appConfig.isPreConnectBufferEnabled]);

  // Auto-start session if requested (e.g. /sessionpage)
  useEffect(() => {
    if (autoStartSession) {
      setSessionStarted(true);
      setShowCard(true);
      startConnecting();
    }
  }, [autoStartSession, startConnecting]);

  // Handle room disconnect
  useEffect(() => {
    const handleDisconnect = () => {
      setReady(false);
    };
    const handleMediaError = () => {
      setHasError(true);
    };

    room.on(RoomEvent.Disconnected, handleDisconnect);
    room.on(RoomEvent.MediaDevicesError, handleMediaError);

    return () => {
      room.off(RoomEvent.Disconnected, handleDisconnect);
      room.off(RoomEvent.MediaDevicesError, handleMediaError);
    };
  }, [room]);

  // Cleanly terminate active session if user navigates to an authentication page
  useEffect(() => {
    if (isAuthPage && sessionStarted) {
      handleEndSession();
    }
  }, [isAuthPage, sessionStarted, handleEndSession]);

  // Hide Sunny AI completely on authentication pages
  if (isAuthPage) {
    return null;
  }

  return (
    <>
      <RoomContext.Provider value={room}>
        <RoomAudioRenderer />
        <StartAudio
          label="Start Audio"
          className="absolute w-0 h-0 opacity-0"
        />

        <FloatingAssistant
          startButtonText={appConfig.startButtonText}
          onStartCall={() => {
            setSessionStarted(true);
            setShowCard(true);
            startConnecting();
          }}
          disabled={sessionStarted && showCard}
        />

        {sessionStarted && showCard && (
          <SessionView
            disabled={false}
            sessionStarted={sessionStarted}
            showCard={showCard}
            setShowCard={setShowCard}
            isConnecting={isConnecting || !ready}
            hasError={hasError}
            onRetry={startConnecting}
            onEndSession={handleEndSession}
          />
        )}
      </RoomContext.Provider>
    </>
  );
};

export default AppRoot;
