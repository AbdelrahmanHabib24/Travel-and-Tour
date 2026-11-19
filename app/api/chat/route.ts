import { NextRequest, NextResponse } from "next/server";
import { buildBackendHeaders, getBackendBaseUrls } from "@/lib/server/ai/backend";

export const revalidate = 0;

const MAX_MESSAGES = 20;
const MAX_MESSAGE_CHARS = 4000;
const MAX_BODY_CHARS = 65536;

import type {
  ChatTurnMessage,
  ChatAPIResponse,
} from "@/features/sunny/chat/types";

export async function POST(req: NextRequest) {
  const responseHeaders = {
    "Cache-Control": "no-store, no-cache, must-revalidate",
  };

  let rawText = "";
  try {
    rawText = await req.text();
  } catch {
    return NextResponse.json(
      { error: "Unable to read request body.", code: "INVALID_BODY" },
      { status: 400, headers: responseHeaders }
    );
  }

  if (!rawText || rawText.length > MAX_BODY_CHARS) {
    return NextResponse.json(
      {
        error: "Request payload is empty or exceeds maximum allowed size.",
        code: "PAYLOAD_SIZE_ERROR",
      },
      { status: rawText ? 413 : 400, headers: responseHeaders }
    );
  }

  let body: { messages?: unknown; language?: unknown };
  try {
    body = JSON.parse(rawText);
  } catch {
    return NextResponse.json(
      { error: "Invalid JSON body.", code: "INVALID_JSON" },
      { status: 400, headers: responseHeaders }
    );
  }

  if (!body || typeof body !== "object" || !Array.isArray(body.messages) || body.messages.length === 0) {
    return NextResponse.json(
      { error: "A non-empty messages array is required.", code: "VALIDATION_ERROR" },
      { status: 400, headers: responseHeaders }
    );
  }

  const language =
    body.language === "ar" || body.language === "en" || body.language === "auto"
      ? body.language
      : "auto";

  const sanitizedMessages: ChatTurnMessage[] = [];
  for (let i = 0; i < body.messages.length; i++) {
    const item = body.messages[i] as Record<string, unknown> | null;
    if (!item || typeof item !== "object") {
      return NextResponse.json(
        { error: `Invalid message at index ${i}.`, code: "VALIDATION_ERROR" },
        { status: 400, headers: responseHeaders }
      );
    }

    const role = item.role;
    const content = typeof item.content === "string" ? item.content.trim() : "";

    if (role !== "user" && role !== "assistant") {
      return NextResponse.json(
        { error: `Invalid message role at index ${i}.`, code: "VALIDATION_ERROR" },
        { status: 400, headers: responseHeaders }
      );
    }

    if (!content) {
      return NextResponse.json(
        { error: `Empty message content at index ${i}.`, code: "VALIDATION_ERROR" },
        { status: 400, headers: responseHeaders }
      );
    }

    if (content.length > MAX_MESSAGE_CHARS) {
      return NextResponse.json(
        {
          error: `Message exceeds maximum length of ${MAX_MESSAGE_CHARS} characters.`,
          code: "MESSAGE_TOO_LONG",
        },
        { status: 400, headers: responseHeaders }
      );
    }

    sanitizedMessages.push({ role, content });
  }

  const boundedMessages = sanitizedMessages.slice(-MAX_MESSAGES);
  if (boundedMessages[boundedMessages.length - 1].role !== "user") {
    return NextResponse.json(
      { error: "The final message must be from the user.", code: "VALIDATION_ERROR" },
      { status: 400, headers: responseHeaders }
    );
  }

  const candidateUrls = getBackendBaseUrls();
  const backendHeaders = buildBackendHeaders();
  const payloadStr = JSON.stringify({
    messages: boundedMessages,
    language,
  });

  const isAr = language === "ar";
  let lastStatus = 503;
  let lastErrorMessage = isAr
    ? "واجهتنا مشكلة مؤقتة أثناء جلب الخيارات. يرجى المحاولة مرة أخرى."
    : "We encountered a temporary issue loading options. Please try again.";
  let lastErrorCode = "BACKEND_UNAVAILABLE";

  for (let idx = 0; idx < candidateUrls.length; idx++) {
    const baseUrl = candidateUrls[idx];
    const isLocalCandidate =
      baseUrl.includes("127.0.0.1") || baseUrl.includes("localhost");
    // Use a fast timeout for local candidate discovery in dev, and a generous timeout for the primary/remote backend
    const timeoutMs = isLocalCandidate && candidateUrls.length > 1 ? 15000 : 32000;

    try {
      const res = await fetch(`${baseUrl}/chat`, {
        method: "POST",
        headers: backendHeaders,
        body: payloadStr,
        cache: "no-store",
        signal: AbortSignal.timeout(timeoutMs),
      });

      const contentType = res.headers.get("content-type") || "";
      if (!contentType.includes("application/json")) {
        // Remote container may be waking up or does not expose /chat yet
        lastStatus = 503;
        lastErrorCode = "BACKEND_WAKING";
        lastErrorMessage = isAr
          ? "المساعد الذكي ساني قيد التجهيز حالياً. يرجى المحاولة بعد قليل."
          : "Sunny AI is getting ready. Please try again shortly.";
        continue;
      }

      const data = await res.json();

      if (res.ok && typeof data?.reply === "string" && data.reply.trim()) {
        return NextResponse.json(data as ChatAPIResponse, {
          status: 200,
          headers: responseHeaders,
        });
      }

      // If 404 on a candidate URL, try next candidate if available
      if (res.status === 404) {
        lastStatus = 503;
        lastErrorCode = "ENDPOINT_NOT_FOUND";
        lastErrorMessage = isAr
          ? "واجهتنا مشكلة مؤقتة أثناء جلب الخيارات. يرجى المحاولة مرة أخرى."
          : "We encountered a temporary issue loading options. Please try again.";
        continue;
      }

      lastStatus = res.status >= 400 && res.status < 600 ? res.status : 502;
      lastErrorCode = data?.code || "AI_PROCESSING_ERROR";
      lastErrorMessage =
        typeof data?.error === "string" && data.error
          ? data.error
          : isAr
          ? "واجهتنا مشكلة مؤقتة أثناء معالجة رسالتك. يرجى إعادة المحاولة."
          : "We encountered a temporary issue processing your message. Please try again.";
      break;
    } catch (err: unknown) {
      const isAbort =
        err instanceof Error &&
        (err.name === "TimeoutError" || err.name === "AbortError");
      if (isAbort) {
        lastStatus = 504;
        lastErrorCode = "BACKEND_TIMEOUT";
        lastErrorMessage = isAr
          ? "استغرق ساني وقتاً أطول من المعتاد للرد. يرجى إعادة المحاولة."
          : "Sunny AI took a bit too long to respond. Please try again.";
      } else {
        lastStatus = 503;
        lastErrorCode = "BACKEND_UNAVAILABLE";
        lastErrorMessage = isAr
          ? "واجهتنا مشكلة مؤقتة أثناء جلب الخيارات. يرجى المحاولة مرة أخرى."
          : "We encountered a temporary issue loading options. Please try again.";
      }
      continue;
    }
  }

  return NextResponse.json(
    {
      error: lastErrorMessage,
      code: lastErrorCode,
    },
    { status: lastStatus, headers: responseHeaders }
  );
}

