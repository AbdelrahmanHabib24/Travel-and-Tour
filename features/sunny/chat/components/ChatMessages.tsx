import React from "react";
import { useTranslations } from "next-intl";
import type {
  ChatMessageItem,
  PackageRecord,
  StarterSuggestionItem,
  SupportedLanguage,
} from "../types";
import { ChatEmptyState } from "./ChatEmptyState";
import { ChatMessageItemView } from "./ChatMessageItemView";
import { TypingIndicator } from "./TypingIndicator";
import { ChatErrorBanner } from "./ChatErrorBanner";

export interface ChatMessagesProps {
  messages: ChatMessageItem[];
  dbPackages: PackageRecord[];
  welcomeSuggestions: StarterSuggestionItem[];
  visiblePackageCounts: Record<string, number>;
  expandedMessages: Record<string, boolean>;
  inputValue: string;
  isSending: boolean;
  activeLanguage: SupportedLanguage;
  errorMessage: string | null;
  hasFailedHistory: boolean;
  messagesEndRef: React.RefObject<HTMLDivElement | null>;
  onToggleExpanded: (messageId: string) => void;
  onShowMoreTrips: (messageId: string, totalCount: number) => void;
  onShowFewerTrips: (messageId: string) => void;
  onSend: (text: string) => void;
  onRetry: () => void;
  onDismissError: () => void;
}

export const ChatMessages: React.FC<ChatMessagesProps> = ({
  messages,
  dbPackages,
  welcomeSuggestions,
  visiblePackageCounts,
  expandedMessages,
  inputValue,
  isSending,
  activeLanguage,
  errorMessage,
  hasFailedHistory,
  messagesEndRef,
  onToggleExpanded,
  onShowMoreTrips,
  onShowFewerTrips,
  onSend,
  onRetry,
  onDismissError,
}) => {
  const t = useTranslations("sunny");
  const isDrafting = inputValue.trim().length > 0;

  return (
    <div
      tabIndex={0}
      className="flex-1 min-h-0 overflow-y-auto overscroll-contain px-4 py-2 [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden focus:outline-none"
    >
      {messages.length === 0 ? (
        <ChatEmptyState
          welcomeTitle={t("welcome.title")}
          welcomeBody={t("welcome.body")}
          welcomeSuggestions={welcomeSuggestions}
          isSending={isSending}
          onSend={onSend}
        />
      ) : (
        <div className="space-y-3.5 py-1">
          {messages.map((msg, msgIdx) => (
            <ChatMessageItemView
              key={msg.id}
              msg={msg}
              msgIdx={msgIdx}
              allMessages={messages}
              dbPackages={dbPackages}
              visiblePackageCount={visiblePackageCounts[msg.id] ?? 3}
              isExpanded={Boolean(expandedMessages[msg.id])}
              isDrafting={isDrafting}
              isSending={isSending}
              activeLanguage={activeLanguage}
              onToggleExpanded={onToggleExpanded}
              onShowMoreTrips={onShowMoreTrips}
              onShowFewerTrips={onShowFewerTrips}
              onSend={onSend}
            />
          ))}

          {/* Typing Indicator */}
          {isSending && <TypingIndicator />}
        </div>
      )}

      {/* Error Banner with Retry */}
      {errorMessage && (
        <ChatErrorBanner
          errorMessage={errorMessage}
          hasFailedHistory={hasFailedHistory}
          isSending={isSending}
          retryLabel={t("actions.retry")}
          dismissLabel={t("actions.dismiss")}
          onRetry={onRetry}
          onDismiss={onDismissError}
        />
      )}

      <div ref={messagesEndRef} />
    </div>
  );
};
