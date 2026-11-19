import type {
  ChatAPIResponse,
  ChatTurnMessage,
} from "../types";
import type {
  ChatMessageItem,
  PackageRecord,
  SupportedLanguage,
} from "../types";
import { detectTextLanguage } from "../utils/language";

export interface SendChatMessageParams {
  conversationHistory: ChatMessageItem[];
  preferredLang: SupportedLanguage;
  signal?: AbortSignal;
}

export interface SendChatMessageResult {
  assistantMessage: ChatMessageItem;
}

export class ChatServiceError extends Error {
  readonly code?: string;

  constructor(message: string, code?: string) {
    super(message);
    this.name = "ChatServiceError";
    this.code = code;
  }
}

export async function sendChatMessage({
  conversationHistory,
  preferredLang,
  signal,
}: SendChatMessageParams): Promise<SendChatMessageResult> {
  const apiMessages: ChatTurnMessage[] = conversationHistory.map((m) => ({
    role: m.role,
    content: m.content,
  }));
  const latestUserMsg =
    conversationHistory[conversationHistory.length - 1]?.content || "";

  const res = await fetch("/api/chat", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      messages: apiMessages,
      language: preferredLang,
    }),
    signal,
  });

  const data = await res.json().catch(() => null);

  if (!res.ok || !data?.reply) {
    const serverErr =
      typeof data?.error === "string" && data.error
        ? data.error
        : "Network error";
    const serverCode = typeof data?.code === "string" ? data.code : undefined;
    throw new ChatServiceError(serverErr, serverCode);
  }

  const responseData = data as ChatAPIResponse;
  const replyLang = detectTextLanguage(
    responseData.reply,
    responseData.language || preferredLang
  );

  const rawPackageList =
    responseData.packages ?? responseData.matched_packages;

  const normalizedBackendPackages: PackageRecord[] | undefined =
    Array.isArray(rawPackageList)
      ? rawPackageList.map((raw) => ({
          id: Number(raw.id),
          URL: String(raw.URL || raw.image_url || ""),
          title1: String(raw.title1 || ""),
          title2: String(raw.title2 || ""),
          price: Number(raw.price ?? raw.price_usd ?? 0),
          currency: String(raw.currency || "USD"),
          des: String(raw.des || raw.description || ""),
          duration: String(raw.duration || ""),
          durationDays:
            typeof raw.durationDays === "number"
              ? raw.durationDays
              : undefined,
          durationNights:
            typeof raw.durationNights === "number"
              ? raw.durationNights
              : undefined,
          rating:
            typeof raw.rating === "number" ? raw.rating : undefined,
          count: typeof raw.count === "number" ? raw.count : undefined,
        }))
      : undefined;

  const assistantMessage: ChatMessageItem = {
    id: `assistant-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
    role: "assistant",
    content: responseData.reply,
    language: replyLang,
    timestamp: Date.now(),
    packagesQueried: Boolean(responseData.packages_queried),
    userQuery: latestUserMsg,
    intent: responseData.intent,
    explicitTableRequested: Boolean(
      responseData.explicit_table_requested
    ),
    suggestions: Array.isArray(responseData.suggestions)
      ? responseData.suggestions
      : undefined,
    structuredSuggestions: Array.isArray(responseData.structured_suggestions)
      ? responseData.structured_suggestions
      : undefined,
    responseId: responseData.response_id,
    searchMode: responseData.search_mode,
    currentPriceTier: responseData.current_price_tier ?? null,
    nextPriceTier: responseData.next_price_tier ?? null,
    canShowAllTrips: Boolean(responseData.can_show_all_trips),
    matchedPackages: normalizedBackendPackages,
  };

  return { assistantMessage };
}
