// src/features/scoring/utils/scoring.ts
// -----------------------------------------------------------------------------
// Purpose: Pure scoring helpers & constants used by Live Scoring UI.
// Keeps the screen lean and makes this logic easy to unit-test later.
// -----------------------------------------------------------------------------

import type { Shot, ShotSymbol, BreakMark } from '~/stores/liveScoringStore';

/** Shot pad keys, matching your paper scoresheet symbols */
export const SHOT_KEYS: ShotSymbol[] = ['X', 'O', 'M', 'S', 'F', 'V', 'I', 'T', '8'];

/** Break marks: Yes / No / Foul / 8 on break */
export const BREAK_KEYS: BreakMark[] = ['Y', 'N', 'F', '8'];

/**
 * Compute rack-level tallies from a list of shots.
 * Pure, deterministic, with the same math you had in-screen.
 */
export function computeRackTally(shots: Shot[], rackNumber: number) {
  const rs = shots.filter((s) => s.rackNumber === rackNumber);
  const count = (sym: ShotSymbol) => rs.filter((s) => s.symbol === sym).length;

  return {
    innings: count('X') + count('O') + count('M'),
    safeties: count('S'),
    fouls: count('F') + count('V') + count('I'),
    timeouts: count('T'),
    eights: count('8'),
  };
}
