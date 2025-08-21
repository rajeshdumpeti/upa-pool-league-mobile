// src/api/types.ts
// -----------------------------------------------------------------------------
// Purpose: Shared API DTOs used by the mobile app when talking to the backend.
// These mirror the DB tables you showed (matches, match_games, score_events).
// Keeping them in one place prevents type drift across API modules.
// -----------------------------------------------------------------------------

export type GameFormat = '8-ball' | '9-ball' | '10-ball';

/** Minimal shape we expect the backend to return with every resource. */
export type ResourceId = { id: number };

/** Table: match_games ------------------------------------------------------- */
export interface MatchGame extends ResourceId {
  match_id: number;
  game_no: number;
  format: GameFormat;
  home_player_id: number;
  away_player_id: number;
  winner_player_id?: number;
  // Optional, derived/analytics fields may also be returned later
  innings?: number;
  defensive_shots?: number;
  timeouts?: number;
  fouls?: number;
  break_mark?: 'Y' | 'N' | 'F' | '8';
  created_at?: string; // ISO
  updated_at?: string; // ISO
}

/** Create a new game (rack) within a match. */
export interface CreateMatchGame {
  match_id: number;
  game_no: number;
  format: GameFormat;
  home_player_id: number;
  away_player_id: number;
  breaker_player_id?: number; // who broke the rack
  started_at?: string; // ISO
}

/** Complete/patch a game once a rack is finished. */
export interface CompleteMatchGame {
  winner_player_id: number;
  innings?: number;
  defensive_shots?: number;
  timeouts?: number;
  fouls?: number;
  break_mark?: 'Y' | 'N' | 'F' | '8';
  notes?: string;
  ended_at?: string; // ISO
}

/** Table: score_events ------------------------------------------------------ */
export type ScoreEventType =
  | 'SHOT' // X/O/M
  | 'SAFETY' // S
  | 'FOUL' // F/V/I
  | 'TIMEOUT' // T
  | 'BREAK' // Y/N/F/8
  | 'NOTE' // free-form note
  | 'EIGHT'; // legal 8 (for 8-ball)

export interface ScoreEvent extends ResourceId {
  match_game_id: number;
  ts: string; // ISO timestamp
  actor_player_id?: number; // optional for some event kinds
  type: ScoreEventType;
  payload_json?: Record<string, any>;
  rule_ref?: string | null;
}

/** Create one score event. */
export interface CreateScoreEvent {
  match_game_id: number;
  ts: string; // ISO
  actor_player_id?: number;
  type: ScoreEventType;
  payload_json?: Record<string, any>;
  rule_ref?: string | null;
}

/** Batch-create multiple score events in one request. */
export interface CreateScoreEventsBatch {
  events: CreateScoreEvent[];
}

/** Small envelope to standardize API list responses (future-friendly). */
export interface Paged<T> {
  data: T[];
  next_cursor?: string | null;
}
