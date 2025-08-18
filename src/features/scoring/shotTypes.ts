// src/scoring/shotTypes.ts
// Paper score symbols + helpers for per-shot capture.

export type ShotSymbol =
  | 'X' // striped
  | 'O' // solid
  | 'M' // missed shot
  | 'F' // foul
  | 'S' // safety
  | 'V' // miss & foul
  | 'I' // intentional foul
  | 'T' // timeout
  | '8'; // legal 8-ball pocketed

// BRK box on the sheet: Y (made a ball), N (dry), F (foul on break), 8 (legal 8 on break)
export type BreakMark = 'Y' | 'N' | 'F' | '8';

export interface ShotEvent {
  id: string; // uuid
  rackNumber: number; // 1-based
  playerId: number;
  symbol: ShotSymbol;
  inning: number; // INT column (increments across shot sequence)
  createdAt: string; // ISO
}

// Optional rack-level metadata captured by UI while scoring.
export interface RackMeta {
  rackNumber: number;
  breakMark?: BreakMark;
  breakerPlayerId?: number;
  winnerPlayerId?: number;
  notes?: string; // e.g., "break & run"
}

// Computed counters that mirror the paper sheet quick summary
export interface RackTally {
  innings: number; // INT
  defensiveShots: number; // count of 'S'
  timeouts: number; // count of 'T'
  fouls: number; // count of 'F' + 'V' + 'I' (all fouls)
  bySymbol: Partial<Record<ShotSymbol, number>>;
}

// Given all shots of THIS rack, compute tallies for INT/S/T/fouls, etc.
export function computeRackTally(shots: ShotEvent[], rackNumber: number): RackTally {
  const inRack = shots.filter((s) => s.rackNumber === rackNumber);
  const bySymbol: Partial<Record<ShotSymbol, number>> = {};
  let defensiveShots = 0;
  let timeouts = 0;
  let fouls = 0;

  for (const s of inRack) {
    bySymbol[s.symbol] = (bySymbol[s.symbol] ?? 0) + 1;
    if (s.symbol === 'S') defensiveShots += 1;
    if (s.symbol === 'T') timeouts += 1;
    if (s.symbol === 'F' || s.symbol === 'V' || s.symbol === 'I') fouls += 1;
  }

  const innings = inRack.length ? Math.max(...inRack.map((s) => s.inning)) : 0;

  return { innings, defensiveShots, timeouts, fouls, bySymbol };
}
