"use client";

import { useEffect, useMemo } from "react";
import {
  type TextStreamData,
  useRoomContext,
  useTranscriptions,
} from "@livekit/components-react";
import { useLocale } from "next-intl";
import { detectTextLanguage } from "../../chat/utils/language";
import type { VoiceSyncedTurn } from "../../chat/types";

export interface UseVoiceTranscriptSyncOptions {
  agentIdentity?: string;
  onSyncVoiceMessages?: (turns: VoiceSyncedTurn[]) => void;
}

/**
 * Deduplicates and coalesces LiveKit voice transcriptions and syncs them into unified chat history.
 * Must be called strictly inside `<RoomContext.Provider>`.
 */
export function useVoiceTranscriptSync({
  agentIdentity,
  onSyncVoiceMessages,
}: UseVoiceTranscriptSyncOptions): VoiceSyncedTurn[] {
  const locale = useLocale();
  const room = useRoomContext();
  const transcriptions: TextStreamData[] = useTranscriptions();

  const voiceTurns = useMemo<VoiceSyncedTurn[]>(() => {
    if (!transcriptions || transcriptions.length === 0) return [];

    const fallbackLang = locale === "ar" ? "ar" : "en";
    const segmentMap = new Map<
      string,
      {
        id: string;
        role: "user" | "assistant";
        content: string;
        timestamp: number;
        isFinal: boolean;
      }
    >();

    for (const item of transcriptions) {
      const text = (item.text || "").trim();
      if (!text) continue;

      const senderIdentity = item.participantInfo?.identity || "";
      const isLocal = senderIdentity === room.localParticipant.identity;
      if (!isLocal && agentIdentity && senderIdentity !== agentIdentity) {
        continue;
      }

      const role: "user" | "assistant" = isLocal ? "user" : "assistant";
      const rawSegmentId =
        item.streamInfo?.attributes?.["lk.segment_id"] ||
        item.streamInfo?.id ||
        "";
      if (!rawSegmentId) continue;

      const turnId = `voice-${role}-${rawSegmentId}`;
      const isFinalAttr =
        item.streamInfo?.attributes?.["lk.transcription_final"] === "true";
      const ts = item.streamInfo?.timestamp ?? 0;

      const existing = segmentMap.get(turnId);
      if (!existing) {
        segmentMap.set(turnId, {
          id: turnId,
          role,
          content: text,
          timestamp: ts,
          isFinal: isFinalAttr,
        });
      } else {
        existing.content = text;
        existing.isFinal = existing.isFinal || isFinalAttr;
        if (ts > 0 && (existing.timestamp === 0 || ts < existing.timestamp)) {
          existing.timestamp = ts;
        }
      }
    }

    const allSegments = Array.from(segmentMap.values()).sort(
      (a, b) => a.timestamp - b.timestamp
    );

    const lastAssistantTimestamp = allSegments
      .filter((s) => s.role === "assistant")
      .reduce((max, s) => Math.max(max, s.timestamp), 0);

    const filteredSegments = allSegments.filter(
      (s) =>
        s.role === "assistant" ||
        s.isFinal ||
        s.timestamp <= lastAssistantTimestamp
    );

    // Coalesce consecutive same-role segments from a single spoken turn so multi-clause
    // user utterances or interrupted 1-word assistant starts produce one clean chat message
    const coalesced: Array<{
      id: string;
      role: "user" | "assistant";
      content: string;
      timestamp: number;
    }> = [];

    for (const seg of filteredSegments) {
      const prev = coalesced[coalesced.length - 1];
      if (prev && prev.role === seg.role) {
        if (seg.role === "assistant") {
          if (
            seg.content.startsWith(prev.content) ||
            prev.content.length < 18
          ) {
            prev.content = seg.content;
          } else if (!prev.content.includes(seg.content)) {
            prev.content = `${prev.content} ${seg.content}`.trim();
          }
        } else {
          if (!prev.content.includes(seg.content)) {
            prev.content = `${prev.content} ${seg.content}`.trim();
          }
        }
        continue;
      }
      coalesced.push({
        id: seg.id,
        role: seg.role,
        content: seg.content,
        timestamp: seg.timestamp,
      });
    }

    return coalesced.map((s) => ({
      id: s.id,
      role: s.role,
      content: s.content,
      language: detectTextLanguage(s.content, fallbackLang),
      timestamp: s.timestamp,
    }));
  }, [transcriptions, room.localParticipant.identity, agentIdentity, locale]);

  useEffect(() => {
    if (onSyncVoiceMessages && voiceTurns.length > 0) {
      const now = Date.now();
      onSyncVoiceMessages(
        voiceTurns.map((turn) =>
          turn.timestamp > 0 ? turn : { ...turn, timestamp: now }
        )
      );
    }
  }, [voiceTurns, onSyncVoiceMessages]);

  useEffect(() => {
    if (voiceTurns.length > 0) {
      const latest = voiceTurns[voiceTurns.length - 1];
      console.info(
        `[SunnyVoiceDiag] ${new Date().toISOString()} Voice turn synced to chat [${
          latest.role
        }, lang=${latest.language}]: ${latest.content}`
      );
    }
  }, [voiceTurns]);

  return voiceTurns;
}