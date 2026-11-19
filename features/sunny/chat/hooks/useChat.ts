import { useState, useEffect, useRef, useCallback } from "react";
import { useQuery } from "@tanstack/react-query";
import type {
  ChatMessageItem,
  PackageRecord,
  SupportedLanguage,
  VoiceSyncedTurn,
} from "../types";
import { INITIAL_VISIBLE_PACKAGES, PACKAGE_PAGE_STEP } from "../constants";
import { detectTextLanguage } from "../utils/language";
import { mergeVoiceTurnsIntoMessages } from "../utils/voiceMerge";
import { ChatServiceError, sendChatMessage } from "../services/chatService";
import { useChatSuggestions } from "./useChatSuggestions";
import { useLocale, useTranslations } from "next-intl";
import { queryKeys } from "@/lib/query/queryKeys";
import { packagesService } from "@/features/packages/services/packages.service";

export interface UseChatOptions {
  isOpen: boolean;
}

export function useChat({ isOpen }: UseChatOptions) {
  const locale = useLocale();
  const t = useTranslations("sunny");
  const language: SupportedLanguage = locale;

  const [isMinimized, setIsMinimized] = useState(false);
  const [messages, setMessages] = useState<ChatMessageItem[]>([]);
  const [expandedMessages, setExpandedMessages] = useState<Record<string, boolean>>({});
  const [visiblePackageCounts, setVisiblePackageCounts] = useState<Record<string, number>>({});
  const [inputValue, setInputValue] = useState("");
  const [isSending, setIsSending] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [failedHistory, setFailedHistory] = useState<ChatMessageItem[] | null>(null);

  const textareaRef = useRef<HTMLTextAreaElement | null>(null);
  const abortControllerRef = useRef<AbortController | null>(null);
  const activeRequestIdRef = useRef<number>(0);
  const clearedAtRef = useRef<number>(0);

  // Access real PostgreSQL travel packages cached via React Query
  const { data: dbPackages = [] } = useQuery<PackageRecord[]>({
    queryKey: queryKeys.packages.all,
    queryFn: async () => {
      try {
        return await packagesService.getPackages<PackageRecord>();
      } catch {
        return [];
      }
    },
    staleTime: 5 * 60 * 1000,
    gcTime: 30 * 60 * 1000,
    enabled: isOpen,
  });

  const welcomeSuggestions = useChatSuggestions({ dbPackages, language });

  // Reset minimized state when reopened from launcher
  const [prevIsOpen, setPrevIsOpen] = useState(isOpen);
  if (isOpen !== prevIsOpen) {
    setPrevIsOpen(isOpen);
    if (isOpen) {
      setIsMinimized(false);
    }
  }

  useEffect(() => {
    if (isOpen) {
      const timer = setTimeout(() => {
        textareaRef.current?.focus();
      }, 120);
      return () => clearTimeout(timer);
    }
  }, [isOpen]);

  // Clean up any in-flight request if component unmounts
  useEffect(() => {
    return () => {
      abortControllerRef.current?.abort();
    };
  }, []);

  const toggleMessageExpanded = useCallback((messageId: string) => {
    setExpandedMessages((prev) => ({
      ...prev,
      [messageId]: !prev[messageId],
    }));
  }, []);

  const handleShowMoreTrips = useCallback(
    (messageId: string, totalCount: number) => {
      setVisiblePackageCounts((prev) => {
        const current = prev[messageId] ?? INITIAL_VISIBLE_PACKAGES;
        const next = Math.min(totalCount, current + PACKAGE_PAGE_STEP);
        return { ...prev, [messageId]: next };
      });
    },
    []
  );

  const handleShowFewerTrips = useCallback((messageId: string) => {
    setVisiblePackageCounts((prev) => ({
      ...prev,
      [messageId]: INITIAL_VISIBLE_PACKAGES,
    }));
  }, []);

  const executeChatRequest = useCallback(
    async (
      conversationHistory: ChatMessageItem[],
      preferredLang: SupportedLanguage
    ) => {
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }

      const controller = new AbortController();
      abortControllerRef.current = controller;
      const requestId = ++activeRequestIdRef.current;

      setIsSending(true);
      setErrorMessage(null);
      setFailedHistory(null);

      try {
        const { assistantMessage } = await sendChatMessage({
          conversationHistory,
          preferredLang,
          signal: controller.signal,
        });

        if (requestId !== activeRequestIdRef.current) {
          return;
        }

        setMessages((prev) => [...prev, assistantMessage]);
      } catch (err: unknown) {
        if (err instanceof Error && err.name === "AbortError") {
          return;
        }
        if (requestId !== activeRequestIdRef.current) {
          return;
        }
        const errCode = err instanceof ChatServiceError ? err.code : undefined;
        const rawMsg = err instanceof Error ? err.message : "";

        let errText = t("errors.network");
        if (
          errCode === "BACKEND_WAKING" ||
          rawMsg.includes("getting ready") ||
          rawMsg.includes("قيد التجهيز")
        ) {
          errText = t("errors.waking");
        } else if (
          errCode === "BACKEND_TIMEOUT" ||
          rawMsg.includes("too long") ||
          rawMsg.includes("أطول من المعتاد") ||
          rawMsg.toLowerCase().includes("timeout")
        ) {
          errText = t("errors.timeout");
        } else if (
          errCode === "AI_PROCESSING_ERROR" ||
          rawMsg.includes("processing your message") ||
          rawMsg.includes("معالجة رسالتك")
        ) {
          errText = t("errors.processing");
        } else if (
          errCode === "BACKEND_UNAVAILABLE" ||
          errCode === "ENDPOINT_NOT_FOUND" ||
          rawMsg === "Network error" ||
          rawMsg.includes("loading options") ||
          rawMsg.includes("جلب الخيارات")
        ) {
          errText = t("errors.network");
        } else if (rawMsg) {
          errText = rawMsg;
        }

        setErrorMessage(errText);
        setFailedHistory(conversationHistory);
      } finally {
        if (requestId === activeRequestIdRef.current) {
          setIsSending(false);
        }
      }
    },
    [t]
  );

  const handleSend = useCallback(
    async (overrideText?: string) => {
      if (isSending) return;

      const hasStringOverride = typeof overrideText === "string";
      const rawText = (hasStringOverride ? overrideText : inputValue).trim();
      if (!rawText) return;

      const detectedMsgLang = detectTextLanguage(rawText, language);

      const userMsg: ChatMessageItem = {
        id: `user-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
        role: "user",
        content: rawText,
        language: detectedMsgLang,
        timestamp: Date.now(),
      };

      const updatedHistory = [...messages, userMsg];
      setMessages(updatedHistory);
      if (!hasStringOverride) {
        setInputValue("");
      }

      await executeChatRequest(updatedHistory, language);
    },
    [isSending, inputValue, language, messages, executeChatRequest]
  );

  const handleRetry = useCallback(async () => {
    if (isSending || !failedHistory || failedHistory.length === 0) return;
    await executeChatRequest(failedHistory, language);
  }, [isSending, failedHistory, executeChatRequest, language]);

  const handleNewConversation = useCallback(() => {
    activeRequestIdRef.current += 1;
    clearedAtRef.current = Date.now();
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
      abortControllerRef.current = null;
    }
    setIsSending(false);
    setMessages([]);
    setExpandedMessages({});
    setVisiblePackageCounts({});
    setInputValue("");
    setErrorMessage(null);
    setFailedHistory(null);
    textareaRef.current?.focus();
  }, []);

  const syncVoiceMessages = useCallback((voiceTurns: VoiceSyncedTurn[]) => {
    if (!Array.isArray(voiceTurns) || voiceTurns.length === 0) return;

    setMessages((prev) =>
      mergeVoiceTurnsIntoMessages(prev, voiceTurns, clearedAtRef.current)
    );
  }, []);

  return {
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
  };
}
