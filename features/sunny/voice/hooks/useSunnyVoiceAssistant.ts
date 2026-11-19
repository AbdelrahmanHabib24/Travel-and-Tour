"use client";

import { useMemo } from "react";
import {
  type AgentState,
  useVoiceAssistant,
  useRemoteParticipants,
  useTracks,
  useConnectionState,
  useParticipantAttributes,
} from "@livekit/components-react";
import { ConnectionState, ParticipantKind, Track } from "livekit-client";

const TARGET_VOICE_AGENT_NAME = "sunny-voice-agent";

export function isAgentAvailable(agentState: AgentState): boolean {
  return ["listening", "thinking", "speaking"].includes(agentState);
}

/**
 * Resolves the preferred Sunny LiveKit voice agent participant, state, and audio track.
 * Must be called strictly inside `<RoomContext.Provider>`.
 */
export function useSunnyVoiceAssistant() {
  const va = useVoiceAssistant();
  const remoteParticipants = useRemoteParticipants();
  const connectionState = useConnectionState();
  const remoteMicTracks = useTracks([Track.Source.Microphone], {
    onlySubscribed: false,
  });

  // Prefer the named Sunny voice agent ("sunny-voice-agent") or an agent that has published a microphone track
  const preferredAgent = useMemo(() => {
    const agents = remoteParticipants.filter(
      (p) =>
        p.kind === ParticipantKind.AGENT &&
        !("lk.publish_on_behalf" in (p.attributes || {}))
    );
    if (agents.length === 0) return va.agent;

    const namedSunny = agents.find(
      (p) =>
        p.attributes?.["lk.agent.name"] === TARGET_VOICE_AGENT_NAME ||
        p.attributes?.["lkAgentName"] === TARGET_VOICE_AGENT_NAME
    );
    if (namedSunny) return namedSunny;

    const agentWithAudio = agents.find((p) =>
      remoteMicTracks.some((tr) => tr.participant.identity === p.identity)
    );
    return agentWithAudio || agents[0] || va.agent;
  }, [remoteParticipants, remoteMicTracks, va.agent]);

  const { attributes } = useParticipantAttributes({
    participant: preferredAgent,
  });

  const preferredAudioTrack = useMemo(() => {
    if (!preferredAgent) return va.audioTrack;
    const found = remoteMicTracks.find(
      (tr) =>
        tr.participant.identity === preferredAgent.identity &&
        tr.source === Track.Source.Microphone
    );
    return found || va.audioTrack;
  }, [preferredAgent, remoteMicTracks, va.audioTrack]);

  const preferredState: AgentState = useMemo(() => {
    if (connectionState === ConnectionState.Disconnected) {
      return "disconnected";
    }
    const rawState =
      attributes?.["lk.agent.state"] ||
      attributes?.["lkAgentState"] ||
      preferredAgent?.attributes?.["lk.agent.state"] ||
      preferredAgent?.attributes?.["lkAgentState"];
    if (
      connectionState === ConnectionState.Connecting ||
      !preferredAgent ||
      !rawState
    ) {
      return "connecting";
    }
    return rawState as AgentState;
  }, [connectionState, preferredAgent, attributes]);

  return {
    agent: preferredAgent,
    state: preferredState,
    audioTrack: preferredAudioTrack,
  };
}