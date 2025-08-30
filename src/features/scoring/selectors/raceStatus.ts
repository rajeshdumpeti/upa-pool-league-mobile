// src/features/scoring/selectors/raceStatus.ts
// -----------------------------------------------------------------------------
// Purpose: derive race status (who's won, isOver) without side effects.
// -----------------------------------------------------------------------------
import { useShallow } from 'zustand/react/shallow';
import { useLiveScoringStore } from '~/stores/liveScoringStore';
import type { LiveScoringState } from '~/stores/liveScoringStore';

export type RaceStatus = {
  homeWins: number;
  awayWins: number;
  raceToHome: number;
  raceToAway: number;
  isOver: boolean;
  winnerSide?: 'home' | 'away';
  winnerName?: string;
};

export function getRaceStatus(s: LiveScoringState): RaceStatus {
  const m = s.match;
  if (!m) {
    return {
      homeWins: 0,
      awayWins: 0,
      raceToHome: 0,
      raceToAway: 0,
      isOver: false,
    };
  }

  const homeWins = m.racks.filter((r) => r.winnerPlayerId === m.home.id).length;
  const awayWins = m.racks.filter((r) => r.winnerPlayerId === m.away.id).length;

  const homeDone = homeWins >= m.raceToHome;
  const awayDone = awayWins >= m.raceToAway;

  let winnerSide: RaceStatus['winnerSide'];
  let winnerName: string | undefined;
  if (homeDone && homeWins >= awayWins) {
    winnerSide = 'home';
    winnerName = m.home.name;
  } else if (awayDone && awayWins >= homeWins) {
    winnerSide = 'away';
    winnerName = m.away.name;
  }

  return {
    homeWins,
    awayWins,
    raceToHome: m.raceToHome,
    raceToAway: m.raceToAway,
    isOver: !!winnerSide,
    winnerSide,
    winnerName,
  };
}

// Convenience hook with shallow equality to avoid noisy rerenders.
export const useRaceStatus = () => useLiveScoringStore(useShallow((s) => getRaceStatus(s)));
