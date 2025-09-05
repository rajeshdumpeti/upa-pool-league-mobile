// src/features/prematch/hooks/usePreMatchState.ts
import { useCallback, useMemo, useState } from 'react';

export type GameFormat = '8-ball' | '9-ball' | '10-ball';
export type TeamSide = 'Home' | 'Away';
export type CoinFace = 'Heads' | 'Tails';

export type CoinResult = { face: CoinFace; winner: TeamSide } | null;
export type Breaker = { team: TeamSide; playerId: number; playerName: string } | null;

export type RosterPlayer = { id: number; name: string; skill?: number };

export type PreMatchState = {
  // state
  format: GameFormat;
  coinResult: CoinResult;
  breaker: Breaker;

  // visibility
  coinModalOpen: boolean;
  breakerSheetOpen: boolean;

  // rosters
  homeRoster: RosterPlayer[];
  awayRoster: RosterPlayer[];

  // submit flags
  submitting: boolean;

  // setters
  setFormat: (f: GameFormat) => void;
  setCoinResult: (r: NonNullable<CoinResult>) => void;
  setBreaker: (b: NonNullable<Breaker>) => void;

  setCoinModalOpen: (v: boolean) => void;
  setBreakerSheetOpen: (v: boolean) => void;

  startSubmitting: () => void;
  stopSubmitting: () => void;

  reset: () => void;
};

/**
 * Centralized Pre-Match state used by PreMatchScreen and its child components.
 * Returns an object with explicit setters (no tuple), which keeps the screen clean.
 */
export const usePreMatchState = (): PreMatchState => {
  // --- core state
  const [format, setFormat] = useState<GameFormat>('8-ball');
  const [coinResult, _setCoinResult] = useState<CoinResult>(null);
  const [breaker, _setBreaker] = useState<Breaker>(null);

  // --- UI visibility
  const [coinModalOpen, setCoinModalOpen] = useState(false);
  const [breakerSheetOpen, setBreakerSheetOpen] = useState(false);

  // --- rosters (replace with real team data when you wire Teams)
  const homeRoster = useMemo<RosterPlayer[]>(
    () => [
      { id: 1, name: 'Home Player 1', skill: 5 },
      { id: 3, name: 'Home Player 2', skill: 4 },
      { id: 5, name: 'Home Player 3', skill: 6 },
    ],
    []
  );
  const awayRoster = useMemo<RosterPlayer[]>(
    () => [
      { id: 2, name: 'Away Player 1', skill: 4 },
      { id: 4, name: 'Away Player 2', skill: 5 },
      { id: 6, name: 'Away Player 3', skill: 3 },
    ],
    []
  );

  // --- submit flag
  const [submitting, setSubmitting] = useState(false);
  const startSubmitting = useCallback(() => setSubmitting(true), []);
  const stopSubmitting = useCallback(() => setSubmitting(false), []);

  // --- setters that also keep invariants
  const setCoinResult = useCallback<PreMatchState['setCoinResult']>((r) => {
    _setCoinResult(r);
    // choosing coin winner invalidates previous breaker choice
    _setBreaker(null);
  }, []);

  const setBreaker = useCallback<PreMatchState['setBreaker']>((b) => _setBreaker(b), []);

  const reset = useCallback(() => {
    setFormat('8-ball');
    _setCoinResult(null);
    _setBreaker(null);
    setCoinModalOpen(false);
    setBreakerSheetOpen(false);
    setSubmitting(false);
  }, []);

  return {
    // state
    format,
    coinResult,
    breaker,

    // visibility
    coinModalOpen,
    breakerSheetOpen,

    // rosters
    homeRoster,
    awayRoster,

    // submit flags
    submitting,

    // setters
    setFormat,
    setCoinResult,
    setBreaker,

    setCoinModalOpen,
    setBreakerSheetOpen,

    startSubmitting,
    stopSubmitting,

    reset,
  };
};

export default usePreMatchState;
