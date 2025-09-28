export type GameFormat = '8-ball' | '9-ball' | '10-ball';
export type CoinSide = 'heads' | 'tails';
export type TeamSide = 'Home' | 'Away';
export type CoinFace = 'Heads' | 'Tails';
export type CoinResult = { face: CoinFace; winner: TeamSide };
export type Player = { id: number; name: string; skill?: number | null };

export type PreMatchSelection = {
  // Required to start
  format: GameFormat | null;
  homeTeamId: number | null;
  awayTeamId: number | null;
  game1HomePlayerId: number | null;
  game1AwayPlayerId: number | null;

  // Toss + breaker
  coin?: { side: CoinSide; winner: TeamSide } | null;
  breaker?: { team: TeamSide; playerId: number } | null;
};
