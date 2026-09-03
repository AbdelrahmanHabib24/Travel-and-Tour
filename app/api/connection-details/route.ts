import { NextResponse } from 'next/server';
import { AccessToken, type AccessTokenOptions, type VideoGrant } from 'livekit-server-sdk';

const API_KEY = process.env.LIVEKIT_API_KEY;
const API_SECRET = process.env.LIVEKIT_API_SECRET;
const LIVEKIT_URL = process.env.LIVEKIT_URL;
const HF_SPACE_URL = process.env.HF_SPACE_URL || 'https://abdelrahmanhabib-livekit-voice-agent.hf.space';

export const revalidate = 0;

export type ConnectionDetails = {
  ready: boolean;
  serverUrl?: string;
  roomName?: string;
  participantName?: string;
  participantToken?: string;
};

// Check if the voice agent is active and running, while also triggering wake-up if asleep
async function checkAgentReady(url: string | undefined): Promise<boolean> {
  if (!url) return true;
  try {
    const res = await fetch(url, {
      method: 'GET',
      headers: {
        'User-Agent': 'TravelTour-ReadinessCheck/1.0',
        'Accept': 'application/json, text/plain, */*',
      },
      cache: 'no-store',
      signal: AbortSignal.timeout(3500),
    });

    if (res.ok) {
      try {
        const data = await res.json();
        if (data && data.agent_running === true) {
          return true;
        }
      } catch {
        const text = await res.text();
        if (text.includes('LiveKit Voice Agent is running')) {
          return true;
        }
      }
    }
    return false;
  } catch {
    // The wake request was dispatched to HF even if fetch timed out or returned 503
    return false;
  }
}

export async function GET(request: Request) {
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
    const isReady = skipCheck ? true : await checkAgentReady(HF_SPACE_URL);

    const headers = new Headers({
      'Cache-Control': 'no-store, no-cache, must-revalidate',
    });

    if (!isReady) {
      return NextResponse.json({ ready: false }, { headers });
    }

    // Generate participant token once agent is confirmed ready
    const participantName = 'user';
    const participantIdentity = `voice_assistant_user_${Math.floor(Math.random() * 10_000)}`;
    const roomName = `voice_assistant_room_${Math.floor(Math.random() * 10_000)}`;
    const participantToken = await createParticipantToken(
      { identity: participantIdentity, name: participantName },
      roomName
    );

    const data: ConnectionDetails = {
      ready: true,
      serverUrl: LIVEKIT_URL,
      roomName,
      participantToken: participantToken,
      participantName,
    };

    return NextResponse.json(data, { headers });
  } catch (error) {
    if (error instanceof Error) {
      console.error(error);
      return new NextResponse(error.message, { status: 500 });
    }
  }
}

function createParticipantToken(userInfo: AccessTokenOptions, roomName: string) {
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
  return at.toJwt();
}
