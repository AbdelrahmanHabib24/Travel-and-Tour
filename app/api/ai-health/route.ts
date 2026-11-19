import { NextResponse } from "next/server";
import { buildBackendHeaders, getBackendBaseUrls } from "@/lib/server/ai/backend";

export const revalidate = 0;

export type AIHealthResponse = {
  status: "ready" | "waking" | "degraded" | "offline";
  chatReady: boolean;
  voiceReady: boolean;
  llmReady: boolean;
  dbReady: boolean;
  message: string;
};

export async function GET() {
  const candidateUrls = getBackendBaseUrls();
  const headers = buildBackendHeaders();
  const responseHeaders = {
    "Cache-Control": "no-store, no-cache, must-revalidate",
  };

  let sawStartingOrWaking = false;
  let sawDegraded = false;

  for (const baseUrl of candidateUrls) {
    try {
      const res = await fetch(`${baseUrl}/health`, {
        method: "GET",
        headers,
        cache: "no-store",
        signal: AbortSignal.timeout(4500),
      });

      const contentType = res.headers.get("content-type") || "";
      if (!contentType.includes("application/json")) {
        // HTML or plain-text response from HF proxy while container is waking
        sawStartingOrWaking = true;
        continue;
      }

      const data = await res.json();

      // Strictly require explicit chat_ready === true (do not treat a bare HTTP 200 or
      // legacy process check as a ready AI chat service).
      const chatReady = data?.chat_ready === true;
      const voiceReady = data?.voice_ready === true;
      const llmReady = data?.llm?.ready === true;
      const dbReady = data?.database?.ready === true;

      if (chatReady) {
        const body: AIHealthResponse = {
          status: "ready",
          chatReady: true,
          voiceReady,
          llmReady,
          dbReady,
          message: "Sunny AI is online and ready.",
        };
        return NextResponse.json(body, { status: 200, headers: responseHeaders });
      }

      if (data?.status === "starting") {
        sawStartingOrWaking = true;
      } else if (data?.status === "degraded") {
        sawDegraded = true;
      } else {
        // Legacy or partially started container without chat_ready
        sawStartingOrWaking = true;
      }
    } catch {
      // Try next candidate URL
      continue;
    }
  }

  if (sawDegraded) {
    const body: AIHealthResponse = {
      status: "degraded",
      chatReady: false,
      voiceReady: false,
      llmReady: false,
      dbReady: false,
      message: "Sunny AI service is currently degraded.",
    };
    return NextResponse.json(body, { status: 503, headers: responseHeaders });
  }

  if (sawStartingOrWaking) {
    const body: AIHealthResponse = {
      status: "waking",
      chatReady: false,
      voiceReady: false,
      llmReady: false,
      dbReady: false,
      message: "Sunny AI service is starting up...",
    };
    return NextResponse.json(body, { status: 503, headers: responseHeaders });
  }

  const body: AIHealthResponse = {
    status: "offline",
    chatReady: false,
    voiceReady: false,
    llmReady: false,
    dbReady: false,
    message: "Sunny AI backend is currently unreachable.",
  };
  return NextResponse.json(body, { status: 503, headers: responseHeaders });
}

