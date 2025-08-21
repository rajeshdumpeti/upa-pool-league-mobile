// src/api/matches.ts
// -----------------------------------------------------------------------------
// Purpose: HTTP helpers for match + match_game endpoints.
// Depends on axiosClient configured with ENV.apiBase.
// -----------------------------------------------------------------------------

import { axiosClient } from './axiosClient';
import type { MatchGame, CreateMatchGame, CompleteMatchGame, Paged } from './types';

/** Create a new rack (match_game) inside a match. */
export async function createMatchGame(input: CreateMatchGame): Promise<MatchGame> {
  const { data } = await axiosClient.post<MatchGame>(`/matches/${input.match_id}/games`, input);
  return data;
}

/** Patch/complete a rack (winner, tallies, notes). */
export async function completeMatchGame(
  gameId: number,
  patch: CompleteMatchGame
): Promise<MatchGame> {
  const { data } = await axiosClient.patch<MatchGame>(`/games/${gameId}`, patch);
  return data;
}

/** Optional utility: list games for a match (useful for history). */
export async function listMatchGames(matchId: number): Promise<Paged<MatchGame>> {
  const { data } = await axiosClient.get<Paged<MatchGame>>(`/matches/${matchId}/games`);
  return data;
}
