import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import {
  AccessToken,
  type AccessTokenOptions,
  type VideoGrant,
} from 'livekit-server-sdk';
import { buildBackendHeaders, getBackendBaseUrls } from '@/lib/server/ai/backend';

const API_KEY = process.env.LIVEKIT_API_KEY;
const API_SECRET = process.env.LIVEKIT_API_SECRET;
const LIVEKIT_URL = process.env.LIVEKIT_URL;
const VOICE_AGENT_NAME =
  process.env.LIVEKIT_AGENT_NAME?.trim() || 'sunny-voice-agent';

export const revalidate = 0;

import type { ConnectionDetails } from "@/features/sunny/voice/types";

// Check if the voice agent is active and running on the configured Python backend(s)
async function checkAgentReady(): Promise<boolean> {
  const candidateUrls = getBackendBaseUrls();
  const headers = {
    ...buildBackendHeaders(),
    'User-Agent': 'TravelTour-ReadinessCheck/2.0',
    Accept: 'application/json, text/plain, */*',
  };

  for (const baseUrl of candidateUrls) {
    try {
      const res = await fetch(`${baseUrl}/health`, {
        method: 'GET',
        headers,
        cache: 'no-store',
        signal: AbortSignal.timeout(3500),
      });

      if (res.ok) {
        try {
          const data = await res.json();
          if (data && (data.voice_ready === true || data.agent_running === true)) {
            return true;
          }
        } catch {
          const text = await res.text();
          if (text.includes('LiveKit Voice Agent is running')) {
            return true;
          }
        }
      }
    } catch {
      // Try next backend candidate
    }
  }
  return false;
}

async function handleConnectionDetails(
  request: Request,
  bodyPayload?: {
    locale?: string;
    history?: Array<{ role?: string; content?: string }>;
  } | null
) {
  try {
    if (LIVEKIT_URL === undefined) {
      throw new Error('LIVEKIT_URL is not defined');
    }
    if (API_KEY === undefined) {
      throw new Error('LIVEKIT_API_KEY is not defined');
    }
    if (API_SECRET === undefined) {
      throw new Error('LIVEKIT_API_SECRET is not defined');
    }

    const { searchParams } = new URL(request.url);
    const skipCheck = searchParams.get('skipCheck') === 'true';

    // Verify if agent backend is ready before issuing connection
    const isReady = skipCheck ? true : await checkAgentReady();

    const headers = new Headers({
      'Cache-Control': 'no-store, no-cache, must-revalidate',
    });

    if (!isReady) {
      return NextResponse.json({ ready: false }, { headers });
    }

    // Determine session language from body, query parameter, or cookie
    const cookieStore = await cookies();
    const cookieLocale = cookieStore.get('NEXT_LOCALE')?.value;
    const requestedLocale =
      bodyPayload?.locale || searchParams.get('locale') || cookieLocale || 'en';
    const normalizedLocale = requestedLocale === 'ar' ? 'ar' : 'en';

    // Sanitize compact recent conversation history (up to 6 turns) so Voice Mode shares context with Chat Mode
    const compactHistory = Array.isArray(bodyPayload?.history)
      ? bodyPayload!.history
          .filter(
            (m) =>
              m &&
              (m.role === 'user' || m.role === 'assistant') &&
              typeof m.content === 'string' &&
              m.content.trim().length > 0
          )
          .slice(-6)
          .map((m) => ({
            role: m.role as 'user' | 'assistant',
            content: m.content!.trim().slice(0, 220),
          }))
      : [];

    // Generate participant token with session language & compact history attached
    const participantName = 'user';
    const randomSuffix = Math.floor(Math.random() * 10_000);
    const participantIdentity = `voice_assistant_user_${normalizedLocale}_${randomSuffix}`;
    const roomName = `voice_assistant_room_${normalizedLocale}_${randomSuffix}`;
    const metadataJson = JSON.stringify({
      language: normalizedLocale,
      ...(compactHistory.length > 0 ? { history: compactHistory } : {}),
    });

    const participantToken = await createParticipantToken(
      {
        identity: participantIdentity,
        name: participantName,
        metadata: metadataJson,
        attributes: { language: normalizedLocale },
      },
      roomName,
      VOICE_AGENT_NAME,
      metadataJson
    );

    const data: ConnectionDetails = {
      ready: true,
      serverUrl: LIVEKIT_URL,
      roomName,
      participantToken,
      participantName,
      agentName: VOICE_AGENT_NAME,
    };

    return NextResponse.json(data, { headers });
  } catch (error) {
    if (error instanceof Error) {
      console.error(error);
      return new NextResponse(error.message, { status: 500 });
    }
  }
}

export async function GET(request: Request) {
  return handleConnectionDetails(request, null);
}

export async function POST(request: Request) {
  const body = await request.json().catch(() => null);
  return handleConnectionDetails(request, body);
}

function createParticipantToken(
  userInfo: AccessTokenOptions,
  roomName: string,
  agentName: string,
  metadataJson: string
) {
  const at = new AccessToken(API_KEY, API_SECRET, {
    ...userInfo,
    ttl: '15m',
  });
  const grant: VideoGrant = {
    room: roomName,
    roomJoin: true,
    canPublish: true,
    canPublishData: true,
    canSubscribe: true,
  };
  at.addGrant(grant);
  // Also attach roomConfig agent dispatch on the token itself
  (at as unknown as { roomConfig: unknown }).roomConfig = {
    agents: [
      {
        agentName,
        metadata: metadataJson,
      },
    ],
  };
  return at.toJwt();
}
