import React, { useState } from "react";
import { useLocale } from "next-intl";

export interface ChatInputProps {
  inputValue: string;
  isSending: boolean;
  placeholder: string;
  micTooltip: string;
  sendLabel: string;
  textareaRef: React.RefObject<HTMLTextAreaElement | null>;
  onChange: (value: string) => void;
  onSend: () => void;
  onStartVoice?: () => void;
}

interface SpeechRecognitionResultAlternativeLike {
  readonly transcript?: string;
}

interface SpeechRecognitionResultListLike {
  readonly [index: number]:
    | { readonly [index: number]: SpeechRecognitionResultAlternativeLike | undefined }
    | undefined;
}

interface SpeechRecognitionEventLike {
  readonly results?: SpeechRecognitionResultListLike;
}

interface SpeechRecognitionInstance {
  lang: string;
  interimResults: boolean;
  maxAlternatives: number;
  onstart: (() => void) | null;
  onend: (() => void) | null;
  onerror: (() => void) | null;
  onresult: ((event: SpeechRecognitionEventLike) => void) | null;
  start: () => void;
}

type SpeechRecognitionConstructor = new () => SpeechRecognitionInstance;

interface WindowWithSpeechRecognition extends Window {
  SpeechRecognition?: SpeechRecognitionConstructor;
  webkitSpeechRecognition?: SpeechRecognitionConstructor;
}

export const ChatInput: React.FC<ChatInputProps> = ({
  inputValue,
  isSending,
  placeholder,
  micTooltip,
  sendLabel,
  textareaRef,
  onChange,
  onSend,
  onStartVoice,
}) => {
  const locale = useLocale();
  const isRTL = locale === "ar";
  const [isListening, setIsListening] = useState(false);

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      onSend();
    }
  };

  const handleMicClick = () => {
    if (onStartVoice) {
      onStartVoice();
      return;
    }

    // Fallback: Browser Web Speech API dictation directly into textarea
    if (typeof window !== "undefined") {
      const speechWindow = window as WindowWithSpeechRecognition;
      const SpeechRecognition =
        speechWindow.SpeechRecognition || speechWindow.webkitSpeechRecognition;
      if (!SpeechRecognition) return;

      try {
        const recognition = new SpeechRecognition();
        recognition.lang = document.documentElement.lang === "ar" ? "ar-SA" : "en-US";
        recognition.interimResults = false;
        recognition.maxAlternatives = 1;

        recognition.onstart = () => setIsListening(true);
        recognition.onend = () => setIsListening(false);
        recognition.onerror = () => setIsListening(false);
        recognition.onresult = (event: SpeechRecognitionEventLike) => {
          const transcript = event.results?.[0]?.[0]?.transcript;
          if (transcript) {
            onChange(inputValue ? `${inputValue} ${transcript}` : transcript);
          }
        };

        recognition.start();
      } catch {
        setIsListening(false);
      }
    }
  };

  return (
    <div
      className="px-4 py-2.5 bg-white border-t border-[#E2E8F0]/80 flex items-center gap-2 shrink-0"
    >
      {/* Rounded Pill Input Container */}
      <div className="flex-1 flex items-center gap-2 bg-white border border-[#CBD5E1] focus-within:border-[#0796A5] focus-within:ring-2 focus-within:ring-[#0796A5]/15 rounded-full px-3.5 py-1.5 shadow-[0_2px_6px_rgba(16,45,64,0.03)] transition-all">
        <textarea
          ref={textareaRef}
          name="sunny-chat-message"
          aria-label={placeholder}
          rows={1}
          dir={isRTL ? (inputValue ? "auto" : "rtl") : (inputValue ? "auto" : "ltr")}
          value={inputValue}
          onChange={(e) => onChange(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder={placeholder}
          maxLength={4000}
          className={`flex-1 resize-none max-h-20 min-h-[24px] bg-transparent text-[13.5px] text-[#102D40] placeholder:text-[#64748B] focus:outline-none leading-6 [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden ${
            isRTL ? "text-right" : "text-left"
          }`}
        />

        {/* Microphone Button (Launches Sunny AI Voice Assistant / Voice Input) */}
        <button
          type="button"
          onClick={handleMicClick}
          title={micTooltip}
          aria-label={micTooltip}
          className={`p-1 rounded-full transition-all duration-200 shrink-0 cursor-pointer hover:scale-110 active:scale-95 ${
            isListening
              ? "text-red-500 animate-pulse bg-red-50"
              : "text-[#475569] hover:text-[#0796A5] hover:bg-[#E3F5F6]/50"
          }`}
        >
          <svg
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="w-[18px] h-[18px]"
          >
            <path d="M12 2a3 3 0 0 0-3 3v7a3 3 0 0 0 6 0V5a3 3 0 0 0-3-3Z" />
            <path d="M19 10v2a7 7 0 0 1-14 0v-2" />
            <line x1="12" x2="12" y1="19" y2="22" />
            <line x1="8" x2="16" y1="22" y2="22" />
          </svg>
        </button>
      </div>

      {/* Circular Teal Send Button */}
      <button
        type="button"
        onClick={() => onSend()}
        disabled={isSending || !inputValue.trim()}
        title={sendLabel}
        aria-label={sendLabel}
        className="w-10 h-10 rounded-full directional-icon bg-gradient-to-br from-[#0796A5] to-[#07566B] hover:from-[#07566B] hover:to-[#073B50] text-white shadow-[0_4px_12px_rgba(7,150,165,0.32)] flex items-center justify-center shrink-0 transition-all duration-200 hover:scale-105 disabled:opacity-50 disabled:hover:scale-100 disabled:cursor-not-allowed cursor-pointer"
      >
        <svg
          viewBox="0 0 24 24"
          fill="currentColor"
          className="w-[18px] h-[18px] -ms-0.5"
        >
          <path d="M3.478 2.405a.75.75 0 00-.926.94l2.432 7.905H13.5a.75.75 0 010 1.5H4.984l-2.432 7.905a.75.75 0 00.926.94 60.519 60.519 0 0018.445-8.986.75.75 0 000-1.218A60.517 60.517 0 003.478 2.405z" />
        </svg>
      </button>
    </div>
  );
};
