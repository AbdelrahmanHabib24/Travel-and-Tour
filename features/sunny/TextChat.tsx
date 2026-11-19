"use client";

import React, { useState, useCallback } from "react";
import dynamic from "next/dynamic";
import { useTranslations, useLocale } from "next-intl";
import type { TextChatProps, SunnyWidgetMode } from "./chat/types";
import { useChat } from "./chat/hooks/useChat";
import { useChatScroll } from "./chat/hooks/useChatScroll";
import { ChatMinimizedBar } from "./chat/components/ChatMinimizedBar";
import { ChatHeader } from "./chat/components/ChatHeader";
import { ChatSubHeader } from "./chat/components/ChatSubHeader";
import { ChatMessages } from "./chat/components/ChatMessages";
import { ChatInput } from "./chat/components/ChatInput";
import { VoiceOrb } from "./voice/VoiceOrb";

const VoiceModeLoading = () => {
  const t = useTranslations("sunny");
  return (
    <div
      className="flex-1 flex flex-col items-center justify-center min-h-0 bg-gradient-to-b from-[#FFFFFF] to-[#F8FAFC] px-4 select-none"
      aria-label={t("session.drawerAria")}
    >
      <VoiceOrb
        state="connecting"
        isMuted={true}
        isPaused={false}
        width={340}
        height={205}
      />
      <h3 className="text-[22px] font-bold text-[#0F172A] tracking-tight text-center mt-1">
        {t("session.connecting")}
      </h3>
      <p className="text-[13.5px] text-[#64748B] font-normal text-center max-w-[310px] leading-relaxed mt-1.5">
        {t("session.preparing")}
      </p>
    </div>
  );
};

// Lazy-load LiveKit SessionView inside the shared Sunny widget body
const SessionView = dynamic(
  () => import("@/features/sunny/SessionView").then((mod) => mod.SessionView),
  {
    ssr: false,
    loading: () => <VoiceModeLoading />,
  }
);

export const TextChat: React.FC<TextChatProps> = ({
  isOpen,
  onClose,
  onStartVoice,
  initialMode = "chat",
  isPreConnectBufferEnabled = true,
}) => {
  const t = useTranslations("sunny");
  const locale = useLocale();
  const isRTL = locale === "ar";

  // Unified widget mode state ("chat" | "voice") inside the single Sunny widget shell
  const [activeMode, setActiveMode] = useState<SunnyWidgetMode>(initialMode);
  const [voiceSessionActive, setVoiceSessionActive] = useState<boolean>(
    initialMode === "voice"
  );
  const [showVoiceView, setShowVoiceView] = useState<boolean>(
    initialMode === "voice"
  );

  const shouldAutoStartVoice = initialMode === "voice" && isOpen;
  const [prevShouldAutoStartVoice, setPrevShouldAutoStartVoice] = useState(shouldAutoStartVoice);

  if (shouldAutoStartVoice !== prevShouldAutoStartVoice) {
    setPrevShouldAutoStartVoice(shouldAutoStartVoice);
    if (shouldAutoStartVoice) {
      setVoiceSessionActive(true);
      setShowVoiceView(true);
      setActiveMode("voice");
    }
  }

  const {
    language,
    isMinimized,
    setIsMinimized,
    messages,
    expandedMessages,
    visiblePackageCounts,
    inputValue,
    setInputValue,
    isSending,
    errorMessage,
    setErrorMessage,
    failedHistory,
    dbPackages,
    welcomeSuggestions,
    textareaRef,
    toggleMessageExpanded,
    handleShowMoreTrips,
    handleShowFewerTrips,
    handleSend,
    handleRetry,
    handleNewConversation,
    syncVoiceMessages,
  } = useChat({ isOpen });

  const { messagesEndRef } = useChatScroll({
    isOpen,
    isMinimized,
    messagesCount: messages.length,
    isSending,
    hasError: Boolean(errorMessage),
  });

  // Switch from Chat Mode to Voice Mode inside the same widget shell
  const handleSwitchToVoice = useCallback(() => {
    setVoiceSessionActive(true);
    setShowVoiceView(true);
    setActiveMode("voice");
    if (onStartVoice) {
      onStartVoice();
    }
  }, [onStartVoice]);

  // Switch from Voice Mode back to Chat Mode while keeping existing session & messages intact
  const handleSwitchToChat = useCallback(() => {
    setActiveMode("chat");
  }, []);

  // End the LiveKit voice session and return to Chat Mode inside the same widget
  const handleEndVoiceSession = useCallback(() => {
    setVoiceSessionActive(false);
    setShowVoiceView(false);
    setActiveMode("chat");
  }, []);

  // Close the entire Sunny widget and release any active voice session
  const handleCloseWidget = useCallback(() => {
    setVoiceSessionActive(false);
    setShowVoiceView(false);
    setActiveMode("chat");
    onClose();
  }, [onClose]);

  if (!isOpen) return null;

  // Minimized compact bar state
  if (isMinimized) {
    return (
      <ChatMinimizedBar
        expandLabel={t("header.expand")}
        closeLabel={t("header.close")}
        onExpand={() => setIsMinimized(false)}
        onClose={handleCloseWidget}
      />
    );
  }

  return (
    <aside
      dir={isRTL ? "rtl" : "ltr"}
      aria-label={t("floating.assistantAria")}
      className="fixed inset-0 sm:inset-auto sm:bottom-5 sm:end-6 z-50 w-full h-[100dvh] sm:h-[590px] sm:max-h-[calc(100dvh-2.5rem)] sm:w-[395px] md:w-[410px] bg-[#F7FAFC] sm:rounded-[24px] shadow-[0_20px_50px_rgba(7,59,80,0.24)] sm:border sm:border-[#E2E8F0] flex flex-col overflow-hidden transition-all duration-200"
    >
      {/* REGION 1: Fixed Header (Shared across Chat Mode & Voice Mode) */}
      <ChatHeader
        title={t("header.title")}
        subtitle={t("header.subtitle")}
        closeLabel={t("header.close")}
        onClose={handleCloseWidget}
      />

      {/* Main Curved White Body Container overlapping header bottom */}
      <div className="flex-1 flex flex-col min-h-0 bg-gradient-to-b from-[#FFFFFF] to-[#F7FAFC] rounded-t-[22px] -mt-3.5 relative z-10 overflow-hidden">
        {/* MODE A: Voice Mode Body (Stays mounted while voiceSessionActive is true to preserve LiveKit room) */}
        {voiceSessionActive && (
          <div
            className={
              activeMode === "voice"
                ? "flex-1 flex flex-col min-h-0"
                : "hidden"
            }
          >
            <SessionView
              showCard={showVoiceView}
              setShowCard={setShowVoiceView}
              isPreConnectBufferEnabled={isPreConnectBufferEnabled}
              onEndSession={handleEndVoiceSession}
              onSwitchToChat={handleSwitchToChat}
              conversationHistory={messages}
              onSyncVoiceMessages={syncVoiceMessages}
            />
          </div>
        )}

        {/* MODE B: Chat Mode Body (Stays mounted so messages & input state are never lost) */}
        <div
          className={
            activeMode === "chat"
              ? "flex-1 flex flex-col min-h-0"
              : "hidden"
          }
        >
          {/* Sub-Header Bar: Optional New Chat & Return to Active Voice Pill */}
          <ChatSubHeader
            messagesCount={messages.length}
            newChatLabel={t("header.newChat")}
            isVoiceActive={voiceSessionActive}
            returnToVoiceLabel={t("session.returnToVoice")}
            onNewConversation={handleNewConversation}
            onReturnToVoice={() => setActiveMode("voice")}
          />

          {/* REGION 2: Independently Scrollable Conversation */}
          <ChatMessages
            messages={messages}
            dbPackages={dbPackages}
            welcomeSuggestions={welcomeSuggestions}
            visiblePackageCounts={visiblePackageCounts}
            expandedMessages={expandedMessages}
            inputValue={inputValue}
            isSending={isSending}
            activeLanguage={language}
            errorMessage={errorMessage}
            hasFailedHistory={Boolean(
              failedHistory && failedHistory.length > 0
            )}
            messagesEndRef={messagesEndRef}
            onToggleExpanded={toggleMessageExpanded}
            onShowMoreTrips={handleShowMoreTrips}
            onShowFewerTrips={handleShowFewerTrips}
            onSend={handleSend}
            onRetry={handleRetry}
            onDismissError={() => setErrorMessage(null)}
          />

          {/* REGION 3: Fixed Bottom Input Area */}
          <ChatInput
            inputValue={inputValue}
            isSending={isSending}
            placeholder={t("input.placeholder")}
            micTooltip={t("input.voiceInput")}
            sendLabel={t("input.send")}
            textareaRef={textareaRef}
            onChange={setInputValue}
            onSend={handleSend}
            onStartVoice={handleSwitchToVoice}
          />
        </div>
      </div>
    </aside>
  );
};

export default TextChat;
