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
  ArrowClockwise,
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
  isConnecting?: boolean;
  hasError?: boolean;
  onRetry?: () => void;
}

export const SessionView = ({
  sessionStarted,
  onEndSession,
  setShowCard,
  showCard,
  isConnecting = false,
  hasError = false,
  onRetry,
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

  useEffect(() => {
    if (agentState === 'speaking' && audioTrack?.publication?.track) {
      audioTrack.publication.track.attachedElements.forEach((el) => {
        el.play().catch((e) => console.log('Audio resume error:', e));
      });
    }
  }, [agentState, audioTrack]);

  if (!showCard) return null;

  // Simple, clean error view
  if (hasError) {
    return (
      <div className="fixed top-0 right-0 h-full w-full sm:max-w-sm md:w-96 
        bg-gradient-to-b from-white to-orange-50 border-l border-orange-100 
        shadow-2xl rounded-none sm:rounded-l-2xl z-50 flex flex-col justify-center items-center p-6 text-center">
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
        <div className="w-12 h-12 rounded-full bg-orange-100 flex items-center justify-center mb-4 text-orange-600">
          <Warning size={28} weight="bold" />
        </div>
        <p className="text-gray-900 font-semibold text-base mb-1">Something went wrong</p>
        <p className="text-gray-500 text-sm mb-6">Please try again.</p>
        <button
          onClick={() => {
            if (onRetry) onRetry();
            else {
              setShowCard(false);
              onEndSession();
            }
          }}
          className="flex items-center justify-center gap-2 py-2.5 px-6 bg-gradient-to-r from-orange-500 to-rose-500 text-white text-sm font-medium rounded-xl shadow-md hover:scale-105 transition-all cursor-pointer"
        >
          <ArrowClockwise size={16} weight="bold" />
          <span>Try Again</span>
        </button>
      </div>
    );
  }

  // Simple, clean connecting view - original layout without technical wording or countdowns
  if (isConnecting || !isAgentAvailable(agentState)) {
    return (
      <div className="fixed top-0 right-0 h-full w-full sm:max-w-sm md:w-96 
        bg-gradient-to-b from-white to-orange-50 border-l border-orange-100 
        shadow-2xl rounded-none sm:rounded-l-2xl z-50 flex flex-col justify-center items-center">
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
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-500 mb-4"></div>
        <p className="text-orange-600 font-medium">Connecting...</p>
        <p className="text-gray-500 text-sm mt-2 text-center px-6">
          Getting Sunny ready...
        </p>
      </div>
    );
  }

  return (
    <>
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

  {/* Agent Section / Visual State Indicators */}
  <div className="flex-1 flex flex-col justify-center items-center p-6 space-y-4">
    {isMuted ? (
      <div className="flex flex-col items-center animate-pulse">
        <div className="h-16 w-16 bg-gray-300 rounded-full flex items-center justify-center">
          <MicrophoneSlash size={32} className="text-gray-600" weight="fill" />
        </div>
        <p className="mt-4 text-gray-500 font-medium">Session Paused</p>
      </div>
    ) : audioTrack ? (
      <>
        <AgentTile state={agentState} audioTrack={audioTrack} className="max-h-56" />
        
        {/* State Label */}
        <div className="text-center mt-4">
          {agentState === "listening" && (
            <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full ">
              <p className="text-gray-500 text-sm font-medium">Listening...</p>
            </span>
          )}
          {agentState === "thinking" && (
            <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full  ">
              <p className="text-orange-600 text-sm font-medium">Thinking...</p>
            </span>
          )}
          {agentState === "speaking" && (
            <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full  ">
              <p className="text-[#ff813f] text-sm font-semibold">Speaking...</p>
            </span>
          )}
        </div>
      </>
    ) : (
      <p className="text-center text-gray-500 text-sm italic">
        Connecting audio...
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

    {/* Mic Button (Pause / Resume) */}
    <button
      onClick={toggleMute}
      className={cn(
        "flex items-center gap-2 px-6 py-3 rounded-full shadow-md transition-all font-medium",
        isMuted
          ? "bg-red-500 hover:bg-red-600 text-white"
          : "bg-orange-500 hover:bg-orange-600 text-white"
      )}
    >
      {isMuted ? (
        <>
          <MicrophoneSlash size={22} weight="fill" />
          <span>Resume</span>
        </>
      ) : (
        <>
          <Microphone size={22} weight="fill" />
          <span>Pause</span>
        </>
      )}
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
          {messages.filter(m => m.message !== "Please pause.").map((message) => (
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
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                e.preventDefault();
                handleSendMessage(inputValue);
              }
            }}
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
    </>
  );
};
