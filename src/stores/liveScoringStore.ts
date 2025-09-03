// src/stores/liveScoringStore.ts
// -----------------------------------------------------------------------------
// Purpose
// - Central state for Live Scoring (match, rack meta, shots)
// - Side-effect free during render (no writes in selectors/components)
// - Explicit, one-shot bootstrap for persistence (prevents HMR loops)
// - Event listeners so integration layers can react to scoring changes
// -----------------------------------------------------------------------------

import { create } from 'zustand';
import type { LiveMatch } from '~/features/scoring/types';
import { STORE_KEYS, getJSON, setJSON } from '~/lib/storage';

// Symbols used on the paper scoresheet
export type ShotSymbol = 'X' | 'O' | 'M' | 'S' | 'F' | 'V' | 'I' | 'T' | '8';
export type BreakMark = 'Y' | 'N' | 'F' | '8';

export type Shot = {
  id: string;
  rackNumber: number;
  playerId: number;
  symbol: ShotSymbol;
  ts: number; // ms epoch
};

type RackMeta = {
  rackNumber: number;
  breakerPlayerId?: number;
  breakMark?: BreakMark;
};

// Store shape
export type LiveScoringState = {
  match: LiveMatch | null;
  shots: Shot[];
  rackMeta?: RackMeta;

  // server identifiers (optional until backend accepts the match)
  serverMatchId?: number;
  serverMatchGameId?: number | null;

  isSyncingGame?: boolean; // NEW: network in-flight when completing a rack

  // Actions (write-only; never call from render)
  hydrateMatch: (m: LiveMatch) => void;
  startRack: (rackNumber: number, breakerId: number) => void;
  setBreakMark: (mark: BreakMark) => void;
  addShot: (playerId: number, symbol: ShotSymbol) => void;
  removeLastShot: () => void;
  completeRack: (winnerId: number, notes?: string) => void;
  resetRack: () => void;
  clear: () => void;
  setIsSyncingGame: (v: boolean) => void; // NEW

  // Server id setters
  setServerMatchId: (id: number) => void;
  setServerMatchGameId: (id?: number | null) => void; // accepts undefined/null
};

// ----- internal helpers ------------------------------------------------------

function computeFromShots(shots: Shot[], rackNumber: number) {
  const rs = shots.filter((s) => s.rackNumber === rackNumber);
  const innings = rs.filter((s) => s.symbol === 'X' || s.symbol === 'O' || s.symbol === 'M').length;
  const defensiveShots = rs.filter((s) => s.symbol === 'S').length;
  const timeouts = rs.filter((s) => s.symbol === 'T').length;
  const fouls = rs.filter((s) => s.symbol === 'F' || s.symbol === 'V' || s.symbol === 'I').length;
  return { innings, defensiveShots, timeouts, fouls };
}

// -----------------------------------------------------------------------------

export const useLiveScoringStore = create<LiveScoringState>((set, get) => ({
  match: null,
  shots: [],
  rackMeta: undefined,
  isSyncingGame: false, // NEW

  hydrateMatch: (m) =>
    set({
      match: m,
      shots: [],
      rackMeta: { rackNumber: 1 },
    }),

  startRack: (rackNumber, breakerId) => {
    const m = get().match;
    if (!m) {
      console.warn('startRack: no active match');
      return;
    }
    const before = m; // snapshot for listeners

    set({
      rackMeta: { rackNumber, breakerPlayerId: breakerId },
      match: { ...m, currentRack: rackNumber },
      shots: [],
    });

    notify('onRackStarted', { match: before, rackNumber, breakerId });
  },

  setBreakMark: (mark) => {
    const meta = get().rackMeta;
    if (!meta) return;
    set({ rackMeta: { ...meta, breakMark: mark } });
  },

  addShot: (playerId, symbol) => {
    const meta = get().rackMeta;
    const m = get().match;
    if (!meta) {
      console.warn('addShot: start a rack first');
      return;
    }

    const shot: Shot = {
      id: `${Date.now()}-${Math.random().toString(36).slice(2)}`,
      rackNumber: meta.rackNumber,
      playerId,
      symbol,
      ts: Date.now(),
    };

    set({ shots: [...get().shots, shot] });

    if (m) {
      notify('onShotAdded', { match: m, rackNumber: meta.rackNumber, shot });
    }
  },

  removeLastShot: () => {
    const list = get().shots;
    if (!list.length) return;
    set({ shots: list.slice(0, -1) });
  },

  completeRack: (winnerId, notes) => {
    const m = get().match;
    const meta = get().rackMeta;
    if (!m || !meta) {
      console.warn('completeRack: missing match or rackMeta');
      return;
    }

    const rackShots = get().shots.filter((s) => s.rackNumber === meta.rackNumber);
    const summary = computeFromShots(get().shots, meta.rackNumber);

    const rackEvent: LiveMatch['racks'][number] = {
      id: `${Date.now()}-${Math.random().toString(36).slice(2)}`,
      rackNumber: meta.rackNumber,
      winnerPlayerId: winnerId,
      breakerPlayerId: meta.breakerPlayerId,
      defensiveShots: summary.defensiveShots,
      innings: summary.innings,
      timeouts: summary.timeouts,
      notes,
      createdAt: new Date().toISOString(),
      shots: rackShots,
    };

    const before = m;

    set({
      match: {
        ...m,
        racks: [...m.racks, rackEvent],
        currentRack: meta.rackNumber + 1,
      },
      rackMeta: { rackNumber: meta.rackNumber + 1 },
      shots: [],
    });

    notify('onRackCompleted', {
      match: before,
      rackNumber: meta.rackNumber,
      winnerId,
      summary,
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

  setServerMatchId: (id) => set({ serverMatchId: id }),
  setServerMatchGameId: (id) => set({ serverMatchGameId: id ?? null }),
  setIsSyncingGame: (v) => set({ isSyncingGame: v }),
}));

// -----------------------------------------------------------------------------
// Persistence (explicit bootstrap; no side-effects at module load)
// -----------------------------------------------------------------------------

type PersistedLiveScoringV1 = {
  match: LiveScoringState['match'];
  rackMeta: LiveScoringState['rackMeta'];
  shots: LiveScoringState['shots'];
};

function serializeV1(s: LiveScoringState): PersistedLiveScoringV1 {
  return { match: s.match, rackMeta: s.rackMeta, shots: s.shots };
}

function hydrateFromStorage() {
  try {
    const data = getJSON<PersistedLiveScoringV1>(STORE_KEYS.liveScoring);
    if (!data) return;
    useLiveScoringStore.setState({
      match: data.match ?? null,
      rackMeta: data.rackMeta,
      shots: Array.isArray(data.shots) ? data.shots : [],
    });
  } catch (e) {
    console.warn('[liveScoring] hydrate failed:', e);
  }
}

function throttle<T extends (...args: any[]) => void>(fn: T, wait = 300) {
  let last = 0;
  let timer: ReturnType<typeof setTimeout> | null = null;
  let queuedArgs: any[] | null = null;

  return (...args: Parameters<T>) => {
    const now = Date.now();
    const remaining = wait - (now - last);

    if (remaining <= 0) {
      last = now;
      fn(...args);
    } else {
      queuedArgs = args;
      if (!timer) {
        timer = setTimeout(() => {
          last = Date.now();
          fn(...(queuedArgs as any[]));
          timer = null;
          queuedArgs = null;
        }, remaining);
      }
    }
  };
}

const persistThrottled = throttle((state: LiveScoringState) => {
  try {
    const payload = serializeV1(state);
    setJSON(STORE_KEYS.liveScoring, payload);
  } catch (e) {
    console.warn('[liveScoring] persist failed:', e);
  }
}, 300);

let _bootstrapped = false;
let _unsubPersist: (() => void) | null = null;

/** Call once from app bootstrap. */
export function bootstrapLiveScoringPersistence() {
  if (_bootstrapped) return;
  _bootstrapped = true;

  hydrateFromStorage();

  if (!_unsubPersist) {
    _unsubPersist = useLiveScoringStore.subscribe(persistThrottled);
  }
}

// -----------------------------------------------------------------------------
// Event listener registry (for side‑effect layers like remote sync)
// -----------------------------------------------------------------------------

export type LiveScoringListener = {
  onRackStarted?: (ctx: { match: LiveMatch; rackNumber: number; breakerId: number }) => void;
  onShotAdded?: (ctx: { match: LiveMatch; rackNumber: number; shot: Shot }) => void;
  onRackCompleted?: (ctx: {
    match: LiveMatch;
    rackNumber: number;
    winnerId: number;
    summary: { innings: number; defensiveShots: number; timeouts: number; fouls: number };
  }) => void;
};

const listeners = new Set<LiveScoringListener>();

export function registerLiveScoringListener(l: LiveScoringListener) {
  listeners.add(l);
  return () => listeners.delete(l);
}

function notify<K extends keyof LiveScoringListener>(
  event: K,
  payload: Parameters<NonNullable<LiveScoringListener[K]>>[0]
) {
  listeners.forEach((l) => {
    const fn = l[event] as any;
    if (typeof fn === 'function') {
      try {
        fn(payload);
      } catch (e) {
        console.warn(`[liveScoring] listener ${String(event)} failed`, e);
      }
    }
  });
}
