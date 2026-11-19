import type { ChatMessageItem, VoiceSyncedTurn } from "../types";
import { normalizePromptKey } from "./packageResolver";

/**
 * Merges synced voice turns into chat message history while respecting conversation resets,
 * updating existing voice turn IDs in place, and deduplicating consecutive voice turns.
 */
export function mergeVoiceTurnsIntoMessages(
  prev: ChatMessageItem[],
  voiceTurns: VoiceSyncedTurn[],
  clearedAt: number
): ChatMessageItem[] {
  if (!Array.isArray(voiceTurns) || voiceTurns.length === 0) {
    return prev;
  }

  let mutated = false;
  const next = [...prev];

  for (const turn of voiceTurns) {
    const trimmed = (turn.content || "").trim();
    if (!trimmed) continue;
    if (turn.timestamp > 0 && turn.timestamp < clearedAt) {
      continue;
    }

    // Resolve preceding user query for assistant messages so package cards attach accurately
    let latestUserQuery: string | undefined = undefined;
    if (turn.role === "assistant") {
      for (let i = next.length - 1; i >= 0; i--) {
        if (next[i].role === "user" && next[i].content.trim()) {
          latestUserQuery = next[i].content;
          break;
        }
      }
    }

    const existingIdx = next.findIndex((m) => m.id === turn.id);
    if (existingIdx !== -1) {
      const existing = next[existingIdx];
      if (
        existing.content !== trimmed ||
        existing.language !== turn.language ||
        (turn.role === "assistant" &&
          latestUserQuery &&
          existing.userQuery !== latestUserQuery)
      ) {
        next[existingIdx] = {
          ...existing,
          content: trimmed,
          language: turn.language,
          userQuery:
            turn.role === "assistant"
              ? latestUserQuery ?? existing.userQuery
              : existing.userQuery,
        };
        mutated = true;
      }
      continue;
    }

    // Prevent duplicate consecutive voice messages with identical role and normalized text
    const lastMsg = next[next.length - 1];
    if (
      lastMsg &&
      lastMsg.role === turn.role &&
      lastMsg.id.startsWith("voice-") &&
      normalizePromptKey(lastMsg.content) === normalizePromptKey(trimmed) &&
      Math.abs((turn.timestamp || Date.now()) - lastMsg.timestamp) < 10_000
    ) {
      continue;
    }

    next.push({
      id: turn.id,
      role: turn.role,
      content: trimmed,
      language: turn.language,
      timestamp: turn.timestamp || Date.now(),
      userQuery: turn.role === "assistant" ? latestUserQuery : undefined,
    });
    mutated = true;
  }

  return mutated ? next : prev;
}