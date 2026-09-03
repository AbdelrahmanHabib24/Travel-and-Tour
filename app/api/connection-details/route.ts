import { NextResponse } from 'next/server';
import { AccessToken, type AccessTokenOptions, type VideoGrant } from 'livekit-server-sdk';

// NOTE: you are expected to define the following environment variables in `.env.local`:
const API_KEY = process.env.LIVEKIT_API_KEY;
const API_SECRET = process.env.LIVEKIT_API_SECRET;
const LIVEKIT_URL = process.env.LIVEKIT_URL;
const HF_SPACE_URL = process.env.HF_SPACE_URL || 'https://abdelrahmanhabib-livekit-voice-agent.hf.space';

// don't cache the results
export const revalidate = 0;

export type ConnectionDetails = {
  serverUrl: string;
  roomName: string;
  participantName: string;
  participantToken: string;
};

// Fire-and-forget non-blocking pre-warm ping to wake up Hugging Face Space if sleeping
function prewarmAgentSpace(url: string | undefined) {
  if (!url) return;
  try {
    fetch(url, {
      method: 'GET',
      headers: {
        'User-Agent': 'TravelTour-Vercel-Prewarm/1.0',
        'Accept': '*/*',
      },
      cache: 'no-store',
    }).catch((err) => {
      // Catch network or cold-start timeouts so token generation is completely unaffected
      console.log('[pre-warm] Ping dispatched to HF Space:', err?.message || err);
    });
  } catch (err) {
    console.log('[pre-warm] Failed to initiate pre-warm ping:', err);
  }
}

export async function GET() {
  try {
    // Dispatch non-blocking pre-warm immediately
    prewarmAgentSpace(HF_SPACE_URL);
    if (LIVEKIT_URL === undefined) {
      throw new Error('LIVEKIT_URL is not defined');
    }
    if (API_KEY === undefined) {
      throw new Error('LIVEKIT_API_KEY is not defined');
    }
    if (API_SECRET === undefined) {
      throw new Error('LIVEKIT_API_SECRET is not defined');
    }

    // Generate participant token
    const participantName = 'user';
    const participantIdentity = `voice_assistant_user_${Math.floor(Math.random() * 10_000)}`;
    const roomName = `voice_assistant_room_${Math.floor(Math.random() * 10_000)}`;
    const participantToken = await createParticipantToken(
      { identity: participantIdentity, name: participantName },
      roomName
    );

    // Return connection details
    const data: ConnectionDetails = {
      serverUrl: LIVEKIT_URL,
      roomName,
      participantToken: participantToken,
      participantName,
    };
    const headers = new Headers({
      'Cache-Control': 'no-store',
    });
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
