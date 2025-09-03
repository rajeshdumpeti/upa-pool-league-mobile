// src/api/matches.ts
// -----------------------------------------------------------------------------
// Purpose: HTTP helpers for match + match_game endpoints.
// Depends on axiosClient configured with ENV.apiBase.
// -----------------------------------------------------------------------------

import { axiosClient } from './axiosClient';
import type {
  MatchGame,
  CreateMatchGame,
  CompleteMatchGame,
  Paged,
  MatchCreateRequest,
  MatchCreateResponse,
} from './types';

// 👇 add lightweight types that match your backend stubs
export type MatchGameCreated = { id: number; match_id: number; game_no: number };
export type MatchGamePatched = { id: number; status: 'completed' };
export type MatchSubmitted = { id: number; status: 'submitted' };

/** Create a new rack (match_game) — matches FastAPI: POST /match-games */
export async function createMatchGame(input: CreateMatchGame): Promise<MatchGameCreated> {
  const { data } = await axiosClient.post<MatchGameCreated>(`/match-games`, input);
  return data;
}

/** Complete/patch a rack — matches FastAPI: PATCH /match-games/{id}/complete */
export async function completeMatchGame(
  gameId: number,
  patch: CompleteMatchGame
): Promise<MatchGamePatched> {
  const { data } = await axiosClient.patch<MatchGamePatched>(
    `/match-games/${gameId}/complete`,
    patch
  );
  return data;
}

/** Optional utility: list games for a match (useful for history). */
export async function listMatchGames(matchId: number): Promise<Paged<MatchGame>> {
  const { data } = await axiosClient.get<Paged<MatchGame>>(`/matches/${matchId}/games`);
  return data;
}

export async function createMatch(body: MatchCreateRequest): Promise<MatchCreateResponse> {
  const { data } = await axiosClient.post<MatchCreateResponse>('/matches', body);
  return data;
}

export async function submitMatch(matchId: number): Promise<MatchSubmitted> {
  // send {} so any body parser is happy
  const { data } = await axiosClient.post<MatchSubmitted>(`/matches/${matchId}/submit`, {});
  return data;
}
