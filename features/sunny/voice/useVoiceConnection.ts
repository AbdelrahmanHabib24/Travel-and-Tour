"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { Room, RoomEvent } from "livekit-client";
import type { ConnectionDetails } from "./types";
import type { ChatMessageItem } from "../chat/types";
import { MICROPHONE_CAPTURE_OPTIONS, type MicrophonePreferences } from "./audio";

export function useVoiceConnection({
  locale,
  history,
  isPreConnectBufferEnabled,
}: {
  locale: string;
  history: ChatMessageItem[];
  isPreConnectBufferEnabled: boolean;
}) {
  const [room, setRoom] = useState<Room | null>(null);
  const [attempt, setAttempt] = useState(0);
  const [ready, setReady] = useState(false);
  const [isConnecting, setIsConnecting] = useState(true);
  const [errorCode, setErrorCode] = useState<string | null>(null);
  const historyRef = useRef(history);
  const preferencesRef = useRef<MicrophonePreferences>({ muted: false, paused: false });
  const disposeRef = useRef<(() => void) | null>(null);

  const updateMicrophonePreferences = useCallback((value: MicrophonePreferences) => {
    preferencesRef.current = value;
  }, []);
  const retry = useCallback(() => setAttempt((value) => value + 1), []);
  const disconnect = useCallback(() => disposeRef.current?.(), []);

  useEffect(() => {
    historyRef.current = history;
  }, [history]);

  useEffect(() => {
    // Every effect setup owns its Room, including StrictMode's setup/cleanup/setup.
    // An obsolete async operation can therefore never disconnect a newer attempt.
    const currentRoom = new Room({
      audioCaptureDefaults: MICROPHONE_CAPTURE_OPTIONS,
      publishDefaults: { dtx: false },
    });
    const controller = new AbortController();
    let disposed = false;
    const active = () => !disposed && !controller.signal.aborted;

    const releaseRoom = () => {
      currentRoom.localParticipant.audioTrackPublications.forEach((publication) => {
        publication.track?.stop();
      });
      void currentRoom.disconnect(true).catch(() => {});
    };
    const fail = (code: string) => {
      if (!active()) return;
      setReady(false);
      setIsConnecting(false);
      setErrorCode(code);
      controller.abort();
      clearTimeout(deadline);
      releaseRoom();
    };
    const onDisconnected = () => fail("networkLost");
    const onMediaError = (error: Error) => {
      fail(error.name === "NotAllowedError" || error.name === "PermissionDeniedError"
        ? "micDenied"
        : error.name === "NotFoundError" || error.name === "DevicesNotFoundError"
          ? "micUnavailable"
          : "audioUnavailable");
    };
    const onPlaybackChanged = () => {
      if (active() && !currentRoom.canPlaybackAudio) {
        void currentRoom.startAudio().catch(() => {});
      }
    };
    currentRoom.on(RoomEvent.Disconnected, onDisconnected);
    currentRoom.on(RoomEvent.MediaDevicesError, onMediaError);
    currentRoom.on(RoomEvent.AudioPlaybackStatusChanged, onPlaybackChanged);

    const dispose = () => {
      disposed = true;
      controller.abort();
      clearTimeout(deadline);
      currentRoom.off(RoomEvent.Disconnected, onDisconnected);
      currentRoom.off(RoomEvent.MediaDevicesError, onMediaError);
      currentRoom.off(RoomEvent.AudioPlaybackStatusChanged, onPlaybackChanged);
      releaseRoom();
      if (disposeRef.current === dispose) disposeRef.current = null;
    };
    disposeRef.current = dispose;
    setRoom(currentRoom);
    setReady(false);
    setIsConnecting(true);
    setErrorCode(null);
    const deadline = setTimeout(() => fail("connectionFailed"), 45_000);

    const waitBeforeRetry = () => new Promise<void>((resolve, reject) => {
      const finish = () => {
        controller.signal.removeEventListener("abort", abort);
        resolve();
      };
      const timer = setTimeout(finish, 2000);
      const abort = () => {
        clearTimeout(timer);
        reject(new DOMException("Connection cancelled", "AbortError"));
      };
      controller.signal.addEventListener("abort", abort, { once: true });
      if (controller.signal.aborted) abort();
    });

    const connect = async () => {
      try {
        const selectedLocale = locale === "ar" ? "ar" : "en";
        const priorMessages = historyRef.current.slice(-6).map(({ role, content }) => ({ role, content }));
        let details: ConnectionDetails | undefined;
        while (active()) {
          try {
            const response = await fetch(`/api/connection-details?locale=${selectedLocale}`, {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({ locale: selectedLocale, history: priorMessages }),
              cache: "no-store",
              signal: controller.signal,
            });
            if (!active()) return;
            if (response.ok) {
              const data: ConnectionDetails = await response.json();
              if (data.ready && data.serverUrl && data.participantToken) {
                details = data;
                break;
              }
            } else if (response.status >= 400 && response.status < 500) {
              fail("connectionFailed");
              return;
            }
          } catch {
            if (!active()) return;
            // A warming backend or transient network failure can recover within the deadline.
          }
          if (active()) await waitBeforeRetry();
        }
        if (!active() || !details?.serverUrl || !details.participantToken) return;
        await currentRoom.connect(details.serverUrl, details.participantToken);
        if (!active()) { releaseRoom(); return; }
        try {
          if (!preferencesRef.current.muted && !preferencesRef.current.paused) {
            await currentRoom.localParticipant.setMicrophoneEnabled(true, MICROPHONE_CAPTURE_OPTIONS, {
              preConnectBuffer: isPreConnectBufferEnabled,
              dtx: false,
            });
          }
        } catch (error) {
          if (active()) onMediaError(error as Error);
          return;
        }
        if (!active()) { releaseRoom(); return; }
        clearTimeout(deadline);
        setReady(true);
        setIsConnecting(false);
      } catch {
        fail("connectionFailed");
      }
    };
    void connect();
    return dispose;
  }, [locale, attempt, isPreConnectBufferEnabled]);

  return { room, ready, isConnecting, hasError: errorCode !== null, errorCode, retry, disconnect, updateMicrophonePreferences };
}
