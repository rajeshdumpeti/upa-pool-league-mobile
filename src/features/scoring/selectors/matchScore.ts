// src/features/scoring/selectors/matchScore.ts
// -----------------------------------------------------------------------------
// Purpose: stable, pure selector for running score + next breaker.
// Uses shallow comparison so components don't re-render unnecessarily.
// -----------------------------------------------------------------------------
import { useLiveScoringStore } from '~/stores/liveScoringStore';
import type { LiveScoringState } from '~/stores/liveScoringStore';
import { useShallow } from 'zustand/react/shallow';

export type MatchScore = {
  homeWins: number;
  awayWins: number;
  breakerId?: number;
  breakerName?: string;
  homeName?: string;
  awayName?: string;
};

// pure derivation (no writes, no side effects)
export function getMatchScore(s: LiveScoringState): MatchScore {
  const m = s.match;
  if (!m) return { homeWins: 0, awayWins: 0 };

  const homeWins = m.racks.filter((r) => r.winnerPlayerId === m.home.id).length;
  const awayWins = m.racks.filter((r) => r.winnerPlayerId === m.away.id).length;

  let breakerId: number | undefined;
  if (s.rackMeta?.breakerPlayerId) {
    breakerId = s.rackMeta.breakerPlayerId;
  } else if (m.racks.length > 0) {
    const last = m.racks[m.racks.length - 1];
    if (last.breakerPlayerId === m.home.id) breakerId = m.away.id;
    else if (last.breakerPlayerId === m.away.id) breakerId = m.home.id;
  } else {
    breakerId = m.home.id;
  }

  const breakerName =
    breakerId === m.home.id ? m.home.name : breakerId === m.away.id ? m.away.name : undefined;

  return {
    homeWins,
    awayWins,
    breakerId,
    breakerName,
    homeName: m.home.name,
    awayName: m.away.name,
  };
}

// hook with shallow equality to avoid noisy rerenders
export const useMatchScore = () => useLiveScoringStore(useShallow((state) => getMatchScore(state)));
