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

function transcriptionToChatMessage(
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
     <div className="fixed top-0 right-0 h-full w-full sm:max-w-sm md:w-96 
  bg-gradient-to-b from-white to-orange-50 border-l border-orange-100 
  shadow-2xl rounded-none sm:rounded-l-2xl z-50 flex flex-col">

  {/* Close button */}
  <button
    onClick={() => {
      setShowCard(false);
      onEndSession();
    }}
    className="absolute top-4 right-4 bg-orange-100 hover:bg-orange-200 
    p-3 rounded-full shadow-md transition-all"
  >
    <X size={22} weight="bold" className="text-orange-600" />
  </button>

  {/* Agent Section */}
  <div className="flex-1 flex justify-center items-center p-6">
    {audioTrack ? (
      <AgentTile state={agentState} audioTrack={audioTrack} className="max-h-56" />
    ) : (
      <p className="text-center text-gray-500 text-sm italic">
        Waiting for agent audio...
      </p>
    )}
  </div>

  {/* Controls */}
  <div className="flex items-center justify-around gap-3 p-4 border-t 
    bg-white/80 backdrop-blur-sm">
    
    {/* Chat Button */}
    <button
      onClick={() => setShowChat(!showChat)}
      className="bg-orange-100 hover:bg-orange-200 
      p-3 rounded-full text-orange-600 shadow-sm transition-all"
    >
      <ChatDots size={22} weight="fill" />
    </button>

    {/* Mic Button */}
    <button
      onClick={toggleMute}
      className={cn(
        "p-3 rounded-full shadow-md transition-all",
        isMuted
          ? "bg-red-500 hover:bg-red-600 text-white"
          : "bg-orange-500 hover:bg-orange-600 text-white"
      )}
    >
      {isMuted ? (
        <MicrophoneSlash size={22} weight="fill" />
      ) : (
        <Microphone size={22} weight="fill" />
      )}
    </button>

    {/* Stop Button */}
    <button
      onClick={handleStop}
      className="bg-gray-800 hover:bg-black p-3 rounded-full text-white 
      shadow-sm transition-all"
    >
      <StopCircle size={22} weight="fill" />
    </button>
  </div>

  {/* Chat Drawer */}
  <AnimatePresence>
    {showChat && (
      <motion.div
        initial={{ opacity: 0, x: "100%" }}
        animate={{ opacity: 1, x: 0 }}
        exit={{ opacity: 0, x: "100%" }}
        transition={{ duration: 0.3 }}
        className="fixed bottom-0 right-0 h-full w-full sm:max-w-sm md:w-96 
          bg-gradient-to-b from-white to-orange-50 border-l border-orange-100 
          shadow-2xl flex flex-col"
      >
        {/* Header */}
        <div className="flex justify-between items-center p-4 border-b border-orange-100">
          <h2 className="text-lg font-semibold text-orange-600">Chat</h2>
          <button
            onClick={() => setShowChat(false)}
            className="bg-orange-100 hover:bg-orange-200 p-2 rounded-full shadow-sm"
          >
            <X size={20} weight="bold" className="text-orange-600" />
          </button>
        </div>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto p-4 space-y-3">
          {messages.map((message) => (
            <div
              key={message.id}
              className={cn(
                "px-4 py-2 rounded-lg max-w-[80%] break-words text-sm",
                message.from?.isLocal
                  ? "bg-gray-100 text-gray-800 ml-auto"
                  : "bg-orange-100 text-orange-800 mr-auto"
              )}
            >
              {message.message}
            </div>
          ))}
        </div>

        {/* Input */}
        <div className="flex p-3 border-t border-orange-100 gap-2">
          <input
            type="text"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            disabled={!isAgentAvailable(agentState)}
            placeholder="Type a message..."
            className="flex-1 border border-orange-200 
            rounded-lg px-3 py-2 focus:outline-none focus:ring-2 
            focus:ring-orange-400 disabled:opacity-50 
            bg-white text-gray-900"
          />
          <button
            onClick={() => handleSendMessage(inputValue)}
            disabled={!isAgentAvailable(agentState)}
            className="bg-orange-500 hover:bg-orange-600 text-white px-4 py-2 
            rounded-lg shadow-md transition-all"
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
