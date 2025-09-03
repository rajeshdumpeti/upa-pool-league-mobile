// src/features/scoring/effects/scoreQueue.ts
// -----------------------------------------------------------------------------
// Purpose: Persistent local queue for score_events.
// - We enqueue a normalized payload whenever a shot is recorded,
//   provided there's a known serverMatchGameId.
// - No network calls here. C2.4 will read & flush this queue.
// -----------------------------------------------------------------------------

import { getJSON, setJSON, STORE_KEYS } from '~/lib/storage';
import type { CreateScoreEvent, ScoreEventType } from '~/api/types';
import type { Shot } from '~/stores/liveScoringStore';

/** Queue item that mirrors the API request shape closely */
export type PendingScoreEvent = CreateScoreEvent & {
  // local-only metadata helpful for debugging/retry
  _local_id: string; // unique client id
  _rack_number: number; // for audit
};

/** Load the current queue (empty array if not set) */
export function readQueue(): PendingScoreEvent[] {
  return getJSON<PendingScoreEvent[]>(STORE_KEYS.scoreQueue) ?? [];
}

/** Overwrite queue atomically */
export function replaceQueue(items: PendingScoreEvent[]) {
  setJSON(STORE_KEYS.scoreQueue, items);
}

/** Append one item */
export function enqueue(item: PendingScoreEvent) {
  const now = readQueue();
  now.push(item);
  replaceQueue(now);
}

/** Clear all items */
export function clearQueue() {
  replaceQueue([]);
}

/** Map a Shot (UI symbol) to an API ScoreEventType + minimal payload */
function mapShotToBackend(shot: Shot): {
  type: 'X' | 'O' | 'M' | 'S' | 'F' | 'V' | 'I' | 'T' | '8';
  payload: Record<string, any> | undefined;
} {
  // Use the symbol directly; attach tiny payloads only when useful
  switch (shot.symbol) {
    case 'X':
    case 'O':
    case 'M':
    case 'S':
    case 'T':
    case '8':
      return { type: shot.symbol, payload: undefined };
    case 'F':
    case 'V':
    case 'I':
      // Keep a code in payload for future analytics; backend allows any JSON
      return { type: shot.symbol, payload: { code: shot.symbol } };
    default:
      // Shouldn't happen; fall back to NOTE-like payload
      return { type: 'M', payload: { note: String(shot.symbol) } }; // safe fallback
  }
}

/** Build a queue item from a shot and known game id — P0 backend event shape */
export function toPendingEvent(gameId: number, rackNumber: number, shot: Shot) {
  const { type, payload } = mapShotToBackend(shot);
  return {
    _local_id: `${Date.now()}-${Math.random().toString(36).slice(2)}`,
    _rack_number: rackNumber,
    match_game_id: gameId,
    ts: new Date(shot.ts).toISOString(),
    actor_player_id: shot.playerId,
    type, // <-- raw symbol as required by backend
    payload_json: payload,
    rule_ref: null,
  };
}
/** Split queue into (current game's items) and (others) */
export function splitQueueByGame(gameId: number) {
  const all = readQueue();
  const current = all.filter((e) => e.match_game_id === gameId);
  const others = all.filter((e) => e.match_game_id !== gameId);
  return { current, others };
}

/** After successful flush for a game, keep only 'others' */
export function keepOnly(remaining: PendingScoreEvent[]) {
  replaceQueue(remaining);
}
