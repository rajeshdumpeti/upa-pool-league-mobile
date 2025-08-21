// src/features/scoring/effects/scoreQueue.ts
// -----------------------------------------------------------------------------
// Purpose: Persistent local queue for score_events.
// - We enqueue a normalized payload whenever a shot is recorded,
//   provided there's a known serverMatchGameId.
// - No network calls here. C2.4 will read & flush this queue.
// -----------------------------------------------------------------------------

import { getJSON, setJSON, STORE_KEYS } from '../../../lib/storage';
import type { CreateScoreEvent, ScoreEventType } from '../../../api/types';
import type { Shot } from '../../../stores/liveScoringStore';

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
export function mapShotToEvent(shot: Shot): { type: ScoreEventType; payload: Record<string, any> } {
  switch (shot.symbol) {
    case 'X':
    case 'O':
    case 'M':
      // Normalize to one 'SHOT' event with result detail
      return { type: 'SHOT', payload: { result: shot.symbol } };
    case 'S':
      return { type: 'SAFETY', payload: {} };
    case 'F':
    case 'V':
    case 'I':
      return { type: 'FOUL', payload: { code: shot.symbol } };
    case 'T':
      return { type: 'TIMEOUT', payload: {} };
    case '8':
      return { type: 'EIGHT', payload: {} };
    default:
      // fallback as NOTE to avoid dropping anything unusual
      return { type: 'NOTE', payload: { symbol: shot.symbol } };
  }
}

/** Build a queue item from a shot and known game id */
export function toPendingEvent(gameId: number, rackNumber: number, shot: Shot): PendingScoreEvent {
  const { type, payload } = mapShotToEvent(shot);
  return {
    _local_id: `${Date.now()}-${Math.random().toString(36).slice(2)}`,
    _rack_number: rackNumber,
    match_game_id: gameId,
    ts: new Date(shot.ts).toISOString(),
    actor_player_id: shot.playerId,
    type,
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
