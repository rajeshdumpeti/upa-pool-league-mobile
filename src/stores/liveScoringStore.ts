// src/stores/liveScoring.ts
import { create } from 'zustand';
import type { LiveMatch } from '../features/scoring/types';

// If you already have these in ../scoring/shotTypes, import them instead.
// import type { ShotSymbol, BreakMark, Shot } from '../scoring/shotTypes';
export type ShotSymbol = 'X' | 'O' | 'M' | 'S' | 'F' | 'V' | 'I' | 'T' | '8';
export type BreakMark = 'Y' | 'N' | 'F' | '8';
export type Shot = {
  id: string;
  rackNumber: number;
  playerId: number;
  symbol: ShotSymbol;
  ts: number;
};

type RackMeta = {
  rackNumber: number;
  breakerPlayerId?: number;
  breakMark?: BreakMark;
};

type LiveScoringState = {
  match: LiveMatch | null;
  shots: Shot[];
  rackMeta?: RackMeta;

  hydrateMatch: (m: LiveMatch) => void;
  startRack: (rackNumber: number, breakerId: number) => void;
  setBreakMark: (mark: BreakMark) => void;
  addShot: (playerId: number, symbol: ShotSymbol) => void;
  removeLastShot: () => void;
  completeRack: (winnerId: number, notes?: string) => void;
  resetRack: () => void;
  clear: () => void;
};

export const useLiveScoringStore = create<LiveScoringState>((set, get) => ({
  match: null,
  shots: [],
  rackMeta: undefined,

  hydrateMatch: (m) => set({ match: m, shots: [], rackMeta: { rackNumber: 1 } }),

  startRack: (rackNumber, breakerId) => {
    const m = get().match;
    if (!m) {
      console.warn('startRack: no active match');
      return;
    }
    set({
      rackMeta: { rackNumber, breakerPlayerId: breakerId },
      match: { ...m, currentRack: rackNumber },
      shots: [],
    });
  },

  setBreakMark: (mark) => {
    const meta = get().rackMeta;
    if (!meta) return;
    set({ rackMeta: { ...meta, breakMark: mark } });
  },

  addShot: (playerId, symbol) => {
    const meta = get().rackMeta;
    if (!meta) {
      console.warn('addShot: start a rack first');
      return;
    }
    const newShot: Shot = {
      id: `${Date.now()}-${Math.random().toString(36).slice(2)}`,
      rackNumber: meta.rackNumber,
      playerId,
      symbol,
      ts: Date.now(),
    };
    set({ shots: [...get().shots, newShot] });
  },

  removeLastShot: () => {
    const shots = get().shots;
    if (!shots.length) return;
    set({ shots: shots.slice(0, -1) });
  },

  completeRack: (winnerId, notes) => {
    const m = get().match;
    const meta = get().rackMeta;
    if (!m || !meta) {
      console.warn('completeRack: missing match or rackMeta');
      return;
    }

    const { innings, defensiveShots, timeouts, fouls } = computeFromShots(
      get().shots,
      meta.rackNumber
    );

    const rackEvent: LiveMatch['racks'][number] = {
      id: `${Date.now()}-${Math.random().toString(36).slice(2)}`,
      rackNumber: meta.rackNumber,
      winnerPlayerId: winnerId,
      breakerPlayerId: meta.breakerPlayerId,
      defensiveShots,
      innings,
      timeouts,
      notes,
      createdAt: new Date().toISOString(),
    };

    set({
      match: {
        ...m,
        racks: [...m.racks, rackEvent],
        currentRack: meta.rackNumber + 1,
      },
      rackMeta: { rackNumber: meta.rackNumber + 1 },
      shots: [],
    });
  },

  resetRack: () => {
    const meta = get().rackMeta;
    set({
      shots: [],
      rackMeta: meta ? { rackNumber: meta.rackNumber } : undefined,
    });
  },

  clear: () => set({ match: null, shots: [], rackMeta: undefined }),
}));

function computeFromShots(shots: Shot[], rackNumber: number) {
  const rs = shots.filter((s) => s.rackNumber === rackNumber);
  const innings = rs.filter((s) => s.symbol === 'X' || s.symbol === 'O' || s.symbol === 'M').length;
  const defensiveShots = rs.filter((s) => s.symbol === 'S').length;
  const timeouts = rs.filter((s) => s.symbol === 'T').length;
  const fouls = rs.filter((s) => s.symbol === 'F' || s.symbol === 'V' || s.symbol === 'I').length;
  return { innings, defensiveShots, timeouts, fouls };
}
