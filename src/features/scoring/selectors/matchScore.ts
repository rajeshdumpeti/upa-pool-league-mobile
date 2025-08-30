// src/features/scoring/selectors/matchScore.ts
// -----------------------------------------------------------------------------
// Purpose: stable, pure selector for running score + next breaker.
// Uses shallow comparison so components don't re-render unnecessarily.
// -----------------------------------------------------------------------------
import { useLiveScoringStore } from '~/stores/liveScoringStore';
import type { LiveScoringState } from '~/stores/liveScoringStore';
import { useShallow } from 'zustand/react/shallow';

// add to type
export type MatchScore = {
  homeWins: number;
  awayWins: number;
  breakerId?: number;
  breakerName?: string;
  homeName?: string;
  awayName?: string;

  // race meta
  raceToHome?: number;
  raceToAway?: number;

  // NEW
  homeProgress: number; // 0..1
  awayProgress: number; // 0..1
  homeOnHill?: boolean;
  awayOnHill?: boolean;
  raceDone?: boolean;
  winnerSide?: 'home' | 'away';
};

export function getMatchScore(s: LiveScoringState): MatchScore {
  const m = s.match;
  if (!m) {
    return {
      homeWins: 0,
      awayWins: 0,
      homeProgress: 0,
      awayProgress: 0,
    };
  }

  const homeWins = m.racks.filter((r) => r.winnerPlayerId === m.home.id).length;
  const awayWins = m.racks.filter((r) => r.winnerPlayerId === m.away.id).length;

  // breaker (unchanged)
  let breakerId: number | undefined;
  if (s.rackMeta?.breakerPlayerId) breakerId = s.rackMeta.breakerPlayerId;
  else if (m.racks.length > 0) {
    const last = m.racks[m.racks.length - 1];
    breakerId =
      last.breakerPlayerId === m.home.id
        ? m.away.id
        : last.breakerPlayerId === m.away.id
          ? m.home.id
          : undefined;
  } else breakerId = m.home.id;
  const breakerName =
    breakerId === m.home.id ? m.home.name : breakerId === m.away.id ? m.away.name : undefined;

  // race state + progress
  const raceToHome = m.raceToHome;
  const raceToAway = m.raceToAway;

  const homeReached = raceToHome ? homeWins >= raceToHome : false;
  const awayReached = raceToAway ? awayWins >= raceToAway : false;

  const raceDone = homeReached || awayReached;
  const winnerSide = homeReached ? 'home' : awayReached ? 'away' : undefined;

  const homeOnHill = !raceDone && raceToHome ? homeWins === raceToHome - 1 : false;
  const awayOnHill = !raceDone && raceToAway ? awayWins === raceToAway - 1 : false;

  const clamp01 = (n: number) => Math.max(0, Math.min(1, n));
  const homeProgress = raceToHome ? clamp01(homeWins / raceToHome) : 0;
  const awayProgress = raceToAway ? clamp01(awayWins / raceToAway) : 0;

  return {
    homeWins,
    awayWins,
    breakerId,
    breakerName,
    homeName: m.home.name,
    awayName: m.away.name,
    raceToHome,
    raceToAway,
    homeProgress,
    awayProgress,
    homeOnHill,
    awayOnHill,
    raceDone,
    winnerSide,
  };
}
// hook with shallow equality to avoid noisy rerenders
export const useMatchScore = () => useLiveScoringStore(useShallow((state) => getMatchScore(state)));
