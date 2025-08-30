import type { LiveScoringState } from '~/stores/liveScoringStore';

export type RaceState = {
  homeWins: number;
  awayWins: number;
  raceToHome: number;
  raceToAway: number;
  raceDone: boolean;
  winnerSide?: 'home' | 'away';
};

export function getRaceState(s: LiveScoringState): RaceState {
  const m = s.match;
  if (!m) {
    return { homeWins: 0, awayWins: 0, raceToHome: 0, raceToAway: 0, raceDone: false };
  }
  const homeWins = m.racks.filter((r) => r.winnerPlayerId === m.home.id).length;
  const awayWins = m.racks.filter((r) => r.winnerPlayerId === m.away.id).length;

  const rh = m.raceToHome ?? 0;
  const ra = m.raceToAway ?? 0;
  const homeReached = rh > 0 && homeWins >= rh;
  const awayReached = ra > 0 && awayWins >= ra;

  return {
    homeWins,
    awayWins,
    raceToHome: rh,
    raceToAway: ra,
    raceDone: homeReached || awayReached,
    winnerSide: homeReached ? 'home' : awayReached ? 'away' : undefined,
  };
}
