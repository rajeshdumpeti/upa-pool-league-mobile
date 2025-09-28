import type { PreMatchSelection } from '../models/prematch';

export function canStartMatch(sel: PreMatchSelection) {
  // Teams
  if (!sel.homeTeamId || !sel.awayTeamId) {
    return { ok: false, reason: 'Select Home and Away teams' as const };
  }
  if (sel.homeTeamId === sel.awayTeamId) {
    return { ok: false, reason: 'Home and Away teams must be different' as const };
  }

  // Format
  if (!sel.format) {
    return { ok: false, reason: 'Choose a game format' as const };
  }

  // Game 1 players
  if (!sel.game1HomePlayerId || !sel.game1AwayPlayerId) {
    return { ok: false, reason: 'Pick Game 1 players for both teams' as const };
  }

  // Coin toss + breaker
  if (!sel.coin) {
    return { ok: false, reason: 'Flip the coin to decide who breaks' as const };
  }
  if (!sel.breaker) {
    return { ok: false, reason: 'Choose the breaker' as const };
  }

  // Breaker must be one of the two Game 1 players
  const { playerId } = sel.breaker;
  if (playerId !== sel.game1HomePlayerId && playerId !== sel.game1AwayPlayerId) {
    return { ok: false, reason: 'Breaker must be a Game 1 player' as const };
  }

  return { ok: true as const };
}
