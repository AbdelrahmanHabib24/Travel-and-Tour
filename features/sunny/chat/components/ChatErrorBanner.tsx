import React from "react";

export interface ChatErrorBannerProps {
  errorMessage: string;
  hasFailedHistory: boolean;
  isSending: boolean;
  retryLabel: string;
  dismissLabel: string;
  onRetry: () => void;
  onDismiss: () => void;
}

export const ChatErrorBanner: React.FC<ChatErrorBannerProps> = ({
  errorMessage,
  hasFailedHistory,
  isSending,
  retryLabel,
  dismissLabel,
  onRetry,
  onDismiss,
}) => {
  return (
    <div
      role="alert"
      className="mt-2 bg-red-50 border border-red-200 rounded-2xl p-3 text-xs text-red-800 shadow-xs"
    >
      <p className="font-medium leading-relaxed mb-2 text-red-800">
        {errorMessage}
      </p>
      <div className="flex items-center gap-2">
        {hasFailedHistory && (
          <button
            type="button"
            onClick={onRetry}
            disabled={isSending}
            className="px-3 py-1 rounded-full bg-[#07566B] hover:bg-[#073B50] text-white font-semibold transition disabled:opacity-50 cursor-pointer"
          >
            {retryLabel}
          </button>
        )}
        <button
          type="button"
          onClick={onDismiss}
          className="px-2.5 py-1 rounded-full text-red-700 hover:bg-red-100 transition cursor-pointer"
        >
          {dismissLabel}
        </button>
      </div>
    </div>
  );
};
