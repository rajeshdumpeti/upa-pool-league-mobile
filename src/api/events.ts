// src/api/events.ts
// -----------------------------------------------------------------------------
// Purpose: HTTP helpers to record scoring events per match_game.
// Updated to align with backend P0 stubs:
//   - POST /api/v1/match-games/{gameId}/score-events:batch  -> { accepted, game_id }
//   - (single create + list are not implemented on backend P0; we adapt/guard)
// -----------------------------------------------------------------------------

import { axiosClient } from './axiosClient';
import type { ScoreEvent, CreateScoreEvent, CreateScoreEventsBatch, Paged } from './types';

// Internal: P0 batch ACK from backend
type ScoreEventsBatchAck = { accepted: number; game_id: number };

/**
 * Create a single score event (adapter for P0).
 * Backend doesn’t have a single-event endpoint yet, so we send a 1‑item batch.
 */
export async function createScoreEvent(input: CreateScoreEvent): Promise<ScoreEvent> {
  const { match_game_id, ...rest } = input as any;
  const body = { events: [{ ...rest }] };

  const { data } = await axiosClient.post<ScoreEventsBatchAck>(
    `/match-games/${match_game_id}/score-events:batch`,
    body
  );

  // P0 backend doesn’t return the created event; fabricate a minimal echo so callers don’t break.
  // When backend adds real single-create, replace this with server response.
  return {
    id: Date.now(), // temporary client-side id
    match_game_id,
    ...rest,
  } as unknown as ScoreEvent;
}

/**
 * Batch create score events for a game.
 * Old return type was { inserted: number }. We adapt backend { accepted } -> { inserted }.
 */
export async function createScoreEventsBatch(
  gameId: number,
  batch: CreateScoreEventsBatch
): Promise<{ inserted: number }> {
  const { data } = await axiosClient.post<ScoreEventsBatchAck>(
    `/match-games/${gameId}/score-events:batch`,
    batch
  );
  return { inserted: data.accepted };
}

/**
 * Optional utility: fetch all events for a game (useful for audit/debug).
 * NOTE: Not implemented on backend P0. Throw a clear error to avoid silent failures.
 */
export async function listScoreEvents(_gameId: number): Promise<Paged<ScoreEvent>> {
  throw new Error('listScoreEvents is not available in backend P0 (no GET endpoint yet).');
}
