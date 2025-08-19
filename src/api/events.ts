// src/api/events.ts
// -----------------------------------------------------------------------------
// Purpose: HTTP helpers to record scoring events per match_game.
// Supports single-event and batch insert to reduce network overhead.
// -----------------------------------------------------------------------------

import { axiosClient } from './axiosClient';
import type { ScoreEvent, CreateScoreEvent, CreateScoreEventsBatch, Paged } from './types';

/** Create a single score event (fallback when batching isn’t desired). */
export async function createScoreEvent(input: CreateScoreEvent): Promise<ScoreEvent> {
  const { data } = await axiosClient.post<ScoreEvent>(
    `/games/${input.match_game_id}/events`,
    input
  );
  return data;
}

/** Batch create score events for a game. */
export async function createScoreEventsBatch(
  gameId: number,
  batch: CreateScoreEventsBatch
): Promise<{ inserted: number }> {
  const { data } = await axiosClient.post<{ inserted: number }>(
    `/games/${gameId}/events:batch`,
    batch
  );
  return data;
}

/** Optional utility: fetch all events for a game (useful for audit/debug). */
export async function listScoreEvents(gameId: number): Promise<Paged<ScoreEvent>> {
  const { data } = await axiosClient.get<Paged<ScoreEvent>>(`/games/${gameId}/events`);
  return data;
}
