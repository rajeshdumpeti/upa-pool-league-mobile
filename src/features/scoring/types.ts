// Core entities referenced during live scoring

export type GameFormat = '8-ball' | '9-ball' | '10-ball';

export interface PlayerRef {
  id: number; // backend id
  name: string;
  skill: number; // UPA skill rating (int)
}

export interface RackEvent {
  id: string; // client event id (uuid)
  rackNumber: number; // 1-based
  winnerPlayerId: number; // who won the rack
  breakerPlayerId?: number; // who broke
  defensiveShots?: number; // optional: count of defensive shots in rack
  innings?: number; // optional: innings taken
  timeouts?: number; // optional: timeouts used in rack (team/player)
  notes?: string; // e.g., "break & run", "8 on break"
  createdAt: string; // ISO timestamp (client time)
}

export interface LiveMatch {
  matchId: string; // backend match id or temp UUID before create
  format: GameFormat;
  raceToHome: number; // target racks for home player
  raceToAway: number; // target racks for away player
  home: PlayerRef;
  away: PlayerRef;
  currentRack: number;
  racks: RackEvent[];
  status: 'not_started' | 'in_progress' | 'completed';
}
