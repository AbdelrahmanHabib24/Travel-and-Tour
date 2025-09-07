"use client";

import React, { useEffect, useState, useMemo } from "react";
import { AnimatePresence, motion } from "framer-motion";
import {
  type AgentState,
  type ReceivedChatMessage,
  type TextStreamData,
  useRoomContext,
  useVoiceAssistant,
  useLocalParticipant,
  useChat,
  useTranscriptions,
} from "@livekit/components-react";

import { Room } from "livekit-client";
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import { toast as sonnerToast } from "sonner";
import {
  Warning,
  ChatDots,
  Microphone,
  MicrophoneSlash,
  StopCircle,
  X,
} from "phosphor-react";
import { AgentTile } from "./Agent-tile";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function transcriptionToChatMessage(
  textStream: TextStreamData,
  room: Room
): ReceivedChatMessage {
  return {
    id: textStream.streamInfo.id,
    timestamp: textStream.streamInfo.timestamp,
    message: textStream.text,
    from:
      textStream.participantInfo.identity === room.localParticipant.identity
        ? room.localParticipant
        : Array.from(room.remoteParticipants.values()).find(
            (p) => p.identity === textStream.participantInfo.identity
          ),
  };
}

function toastAlert(toast: {
  title: React.ReactNode;
  description: React.ReactNode;
}) {
  return sonnerToast.custom(
    (id) => (
      <div
        onClick={() => sonnerToast.dismiss(id)}
        className="flex items-start gap-3 bg-gradient-to-r from-purple-500 to-pink-500 text-white cursor-pointer rounded-xl p-4 shadow-lg"
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

function isAgentAvailable(agentState: AgentState) {
  return ["listening", "thinking", "speaking"].includes(agentState);
}

function useChatAndTranscription() {
  const transcriptions: TextStreamData[] = useTranscriptions();
  const chat = useChat();
  const room = useRoomContext();

  const mergedTranscriptions = useMemo(() => {
    const merged: Array<ReceivedChatMessage> = [
      ...transcriptions.map((t) => transcriptionToChatMessage(t, room)),
      ...chat.chatMessages,
    ];
    return merged.sort((a, b) => a.timestamp - b.timestamp);
  }, [transcriptions, chat.chatMessages, room]);

  return { messages: mergedTranscriptions, send: chat.send };
}

interface SessionViewProps {
  disabled: boolean;
  sessionStarted: boolean;
  showCard: boolean;
  setShowCard: React.Dispatch<React.SetStateAction<boolean>>;
  onEndSession: () => void;
}

export const SessionView = ({
  sessionStarted,
  onEndSession,
  setShowCard,
  showCard,
}: SessionViewProps) => {
  const { state: agentState, audioTrack } = useVoiceAssistant();
  const { localParticipant } = useLocalParticipant();
  const { messages, send } = useChatAndTranscription();

  const room = useRoomContext();
  const [isMuted, setIsMuted] = useState(false);
  const [inputValue, setInputValue] = useState("");
  const [showChat, setShowChat] = useState(false);

  async function handleSendMessage(message: string) {
    if (!message.trim()) return;
    await send(message);
    setInputValue("");
  }

  const toggleMute = async () => {
    const newMuted = !isMuted;
    setIsMuted(newMuted);
    await localParticipant.setMicrophoneEnabled(!newMuted);
  };

 const handleStop = () => {
  if (!audioTrack?.publication?.track) return;
  const track = audioTrack.publication.track;

  const attachedElements = track.detach();
  attachedElements.forEach((el) => {
    el.pause();
    el.currentTime = 0; 
  });

};



  useEffect(() => {
    if (sessionStarted) {
      const timeout = setTimeout(() => {
        if (!isAgentAvailable(agentState)) {
          const reason =
            agentState === "connecting"
              ? "Agent did not join the room."
              : "Agent connected but did not complete initializing.";

          toastAlert({
            title: "Session ended",
            description: (
              <p className="w-full">
                {reason}{" "}
                <a
                  target="_blank"
                  rel="noopener noreferrer"
                  href="https://docs.livekit.io/agents/start/voice-ai/"
                  className="underline font-medium ml-1 text-blue-200"
                >
                  Quickstart guide
                </a>
                .
              </p>
            ),
          });
          room.disconnect();
        }
      }, 10_000);
      return () => clearTimeout(timeout);
    }
  }, [agentState, sessionStarted, room]);

  return (
    <>
      {showCard && (
        <div className="fixed top-0 right-0 h-full w-96 max-w-sm bg-gradient-to-tr from-gray-100 to-gray-200 dark:from-gray-800 dark:to-gray-900 rounded-l-2xl shadow-2xl overflow-hidden z-50 flex flex-col justify-between">
          <button
            onClick={() => {
              setShowCard(false);
              onEndSession();
            }}
            className="absolute top-4 right-4 z-50 bg-white/80 dark:bg-gray-700 hover:bg-white dark:hover:bg-gray-600 p-3 rounded-full shadow-md text-black"
          >
            <X size={24} weight="bold" />
          </button>

          <div className="flex-1 flex justify-center items-center p-4">
            {audioTrack ? (
              <AgentTile
                state={agentState}
                audioTrack={audioTrack}
                className="max-h-56 "
              />
            ) : (
              <p className="text-center text-gray-500 text-sm italic">
                Waiting for agent audio...
              </p>
            )}
          </div>

          <div className="flex flex-wrap items-center justify-between gap-3 p-4 border-t bg-white/90 dark:bg-gray-800/90 backdrop-blur-md rounded-t-xl shadow-inner">
            <button
              onClick={() => setShowChat(!showChat)}
              className="bg-blue-500 hover:bg-blue-600 p-3 rounded-full text-white shadow-md transition-all transform hover:scale-105"
            >
              <ChatDots size={24} weight="fill" />
            </button>

            <button
              onClick={toggleMute}
              className={cn(
                "p-3 rounded-full text-white shadow-md transition-all transform hover:scale-105",
                isMuted
                  ? "bg-red-500 hover:bg-red-600"
                  : "bg-green-500 hover:bg-green-600"
              )}
            >
              {isMuted ? (
                <MicrophoneSlash size={24} weight="fill" />
              ) : (
                <Microphone size={24} weight="fill" />
              )}
            </button>

            <button
              onClick={handleStop}
              className="bg-gray-700 hover:bg-gray-800 p-3 rounded-full text-white shadow-md transition-all transform hover:scale-105"
            >
              <StopCircle size={24} weight="fill" />
            </button>
          </div>

          <AnimatePresence>
            {showChat && (
              <motion.div
                initial={{ opacity: 0, x: 100 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 100 }}
                transition={{ duration: 0.3 }}
                className="fixed top-0 right-0 h-full w-96 max-w-sm bg-gradient-to-tr from-gray-100 to-gray-200 dark:from-gray-800 dark:to-gray-900 rounded-l-2xl shadow-2xl overflow-hidden z-50 flex flex-col"
              >
                <div className="flex justify-between items-center p-4 border-b border-gray-300 dark:border-gray-700">
                  <h2 className="text-lg font-semibold text-gray-700 dark:text-gray-200">
                    Chat
                  </h2>
                  <button
                    onClick={() => setShowChat(false)}
                    className="bg-white/80 dark:bg-gray-700 hover:bg-white dark:hover:bg-gray-600 p-3 rounded-full shadow-md text-black"
                  >
                    <X size={24} weight="bold" />
                  </button>
                </div>

                <div className="flex-1 overflow-y-auto p-4 space-y-2">
                  {messages.map((message) => (
                    <div
                      key={message.id}
                      className={cn(
                        "px-3 py-2 rounded-xl max-w-[75%] break-words shadow-sm transition-colors",
                        message.from?.isLocal
                          ? "bg-blue-100 ml-auto hover:bg-blue-200"
                          : "bg-gray-100 mr-auto hover:bg-gray-200 dark:bg-gray-700 dark:hover:bg-gray-600"
                      )}
                    >
                      {message.message}
                    </div>
                  ))}
                </div>

                <div className="flex p-3 border-t bg-white/90 dark:bg-gray-800/90 gap-2 backdrop-blur-md rounded-t-xl shadow-inner">
                  <input
                    type="text"
                    value={inputValue}
                    onChange={(e) => setInputValue(e.target.value)}
                    disabled={!isAgentAvailable(agentState)}
                    placeholder="Type a message..."
                    className="flex-1 border rounded-lg px-3 py-2 focus:outline-none disabled:bg-gray-200 dark:disabled:bg-gray-700 shadow-inner"
                  />
                  <button
                    onClick={() => handleSendMessage(inputValue)}
                    disabled={!isAgentAvailable(agentState)}
                    className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg shadow-md transition-all transform hover:scale-105"
                  >
                    Send
                  </button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      )}
    </>
  );
};
