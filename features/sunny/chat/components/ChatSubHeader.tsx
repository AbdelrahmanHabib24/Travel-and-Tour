import React from "react";

export interface ChatSubHeaderProps {
  messagesCount: number;
  newChatLabel: string;
  isVoiceActive?: boolean;
  returnToVoiceLabel?: string;
  onNewConversation: () => void;
  onReturnToVoice?: () => void;
}

export const ChatSubHeader: React.FC<ChatSubHeaderProps> = ({
  messagesCount,
  newChatLabel,
  isVoiceActive = false,
  returnToVoiceLabel,
  onNewConversation,
  onReturnToVoice,
}) => {
  if (messagesCount === 0 && !isVoiceActive) {
    return <div className="h-2 shrink-0" />;
  }

  return (
    <div className="px-4 pt-2.5 pb-1 flex items-center justify-end gap-2 shrink-0">
      {isVoiceActive && onReturnToVoice && returnToVoiceLabel && (
        <button
          type="button"
          onClick={onReturnToVoice}
          title={returnToVoiceLabel}
          aria-label={returnToVoiceLabel}
          className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold text-white bg-gradient-to-r from-[#0796A5] to-[#07566B] hover:from-[#07566B] hover:to-[#073B50] shadow-sm transition cursor-pointer"
        >
          <span className="w-2 h-2 rounded-full bg-[#67E8F9] animate-pulse" />
          <span>{returnToVoiceLabel}</span>
        </button>
      )}

      {messagesCount > 0 && (
        <button
          type="button"
          onClick={onNewConversation}
          title={newChatLabel}
          className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-semibold text-[#07566B] bg-[#E3F5F6]/70 hover:bg-[#E3F5F6] transition cursor-pointer"
        >
          <svg
            viewBox="0 0 20 20"
            fill="currentColor"
            className="w-3.5 h-3.5"
          >
            <path
              fillRule="evenodd"
              d="M15.312 11.424a5.5 5.5 0 01-9.201 2.466l-.312-.311h2.433a.75.75 0 000-1.5H3.989a.75.75 0 00-.75.75v4.242a.75.75 0 001.5 0v-2.43l.31.31a7 7 0 0011.712-3.138.75.75 0 00-1.449-.39zm1.23-3.723a.75.75 0 00.219-.53V2.929a.75.75 0 00-1.5 0V5.36l-.31-.31A7 7 0 003.239 8.188a.75.75 0 101.448.389A5.5 5.5 0 0113.89 6.11l.311.31h-2.432a.75.75 0 000 1.5h4.243a.75.75 0 00.53-.219z"
              clipRule="evenodd"
            />
          </svg>
          <span>{newChatLabel}</span>
        </button>
      )}
    </div>
  );
};
