export type GameFormat = '8-ball' | '9-ball' | '10-ball';
export type CoinSide = 'heads' | 'tails';
export type TeamSide = 'home' | 'away';

export type Player = { id: number; name: string; skill?: number | null };

export type PreMatchSelection = {
  format: GameFormat;
  coin?: { side: CoinSide; winner: TeamSide } | null;
  breaker?: { team: TeamSide; playerId: number } | null;
};
