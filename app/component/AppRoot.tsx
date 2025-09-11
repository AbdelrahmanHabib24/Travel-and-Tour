"use client";

import React, { useEffect, useState, useRef } from "react";
import { Room, RoomEvent } from "livekit-client";
import {
  RoomAudioRenderer,
  StartAudio,
  RoomContext,
} from "@livekit/components-react";
import { toast as sonnerToast } from "sonner";

import FloatingAssistant from "@/app/component/FloatingAssistant";
import { SessionView } from "@/app/component/SessionView";
import useConnectionDetails from "@/app/ulits/useConnectionDetails";

interface AppConfig {
  startButtonText: string;
  isPreConnectBufferEnabled: boolean;
}

interface AppRootProps {
  appConfig: AppConfig;
  autoStartSession?: boolean;
}

function toastAlert(toast: {
  title: React.ReactNode;
  description: React.ReactNode;
}) {
  return sonnerToast.custom(
    (id) => (
      <div
        onClick={() => sonnerToast.dismiss(id)}
        className="bg-accent cursor-pointer p-3 rounded-md shadow"
      >
        <strong>{toast.title}</strong>
        <p>{toast.description}</p>
      </div>
    ),
    { duration: 8000 }
  );
}

const AppRoot = ({ appConfig, autoStartSession = false }: AppRootProps) => {
  const roomRef = useRef<Room | null>(null);
  const [sessionStarted, setSessionStarted] = useState(autoStartSession);
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [loading, setLoading] = useState(false);
  const [showCard, setShowCard] = useState(false);
  const { connectionDetails, refreshConnectionDetails } =
    useConnectionDetails();
  const [ready, setReady] = useState(false);

  if (!roomRef.current) {
    roomRef.current = new Room();
  }
  const room = roomRef.current;

  // Room events
  useEffect(() => {
    const handleDisconnect = () => {
      setSessionStarted(false);
      refreshConnectionDetails();
    };
    const handleMediaError = (error: Error) => {
      toastAlert({
        title: "Encountered an error with your media devices",
        description: `${error.name}: ${error.message}`,
      });
    };

    room.on(RoomEvent.Disconnected, handleDisconnect);
    room.on(RoomEvent.MediaDevicesError, handleMediaError);

    return () => {
      room.off(RoomEvent.Disconnected, handleDisconnect);
      room.off(RoomEvent.MediaDevicesError, handleMediaError);
      room.disconnect();
    };
  }, [room, refreshConnectionDetails]);

  useEffect(() => {
    if (sessionStarted && room.state === "disconnected" && connectionDetails) {
      setLoading(true);
      room
        .connect(
          connectionDetails.serverUrl,
          connectionDetails.participantToken
        )
        .then(() =>
          room.localParticipant.setMicrophoneEnabled(true, undefined, {
            preConnectBuffer: appConfig.isPreConnectBufferEnabled,
          })
        )
        .then(() => setReady(true))
        .catch((error) => {
          toastAlert({
            title: "Error connecting to the agent",
            description: `${error.name}: ${error.message}`,
          });
        })
        .finally(() => setLoading(false));
    }
  }, [
    sessionStarted,
    connectionDetails,
    appConfig.isPreConnectBufferEnabled,
    room,
  ]);

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
          }}
          disabled={sessionStarted && showCard}
        />

        {sessionStarted && ready && showCard && (
          <SessionView
            disabled={false}
            sessionStarted={sessionStarted}
            showCard={showCard}
            setShowCard={setShowCard}
            onEndSession={() => setSessionStarted(false)}
          />
        )}
      </RoomContext.Provider>
    </>
  );
};

export default AppRoot;
