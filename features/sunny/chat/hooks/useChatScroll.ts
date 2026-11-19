import { useRef, useCallback, useEffect } from "react";

export interface UseChatScrollOptions {
  isOpen: boolean;
  isMinimized: boolean;
  messagesCount: number;
  isSending: boolean;
  hasError: boolean;
}

export function useChatScroll({
  isOpen,
  isMinimized,
  messagesCount,
  isSending,
  hasError,
}: UseChatScrollOptions) {
  const messagesEndRef = useRef<HTMLDivElement | null>(null);

  const scrollToBottom = useCallback(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, []);

  useEffect(() => {
    if (isOpen && !isMinimized && messagesCount > 0) {
      scrollToBottom();
    }
  }, [messagesCount, isSending, hasError, isOpen, isMinimized, scrollToBottom]);

  return { messagesEndRef, scrollToBottom };
}
