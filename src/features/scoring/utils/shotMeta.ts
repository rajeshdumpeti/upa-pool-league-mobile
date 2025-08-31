// src/features/scoring/utils/shotMeta.ts
// -----------------------------------------------------------------------------
// Purpose: Single source of truth for shot symbols used by the pad.
// - Labels, categories (for layout), and confirm flags.
// - No side effects; pure metadata.
// -----------------------------------------------------------------------------

import type { ShotSymbol } from '~/stores/liveScoringStore';

export type ShotCategory = 'offense' | 'safety' | 'foul' | 'timeout' | 'special';

export type ShotMeta = {
  symbol: ShotSymbol;
  label: string;
  category: ShotCategory;
  confirm?: boolean; // ask user to confirm on press/long-press
};

/** All symbols we support on the pad, with display metadata */
export const SHOTS: ShotMeta[] = [
  { symbol: 'X', label: 'Make', category: 'offense' },
  { symbol: 'O', label: 'Open', category: 'offense' },
  { symbol: 'M', label: 'Miss', category: 'offense' },

  { symbol: 'S', label: 'Safe', category: 'safety', confirm: true },

  { symbol: 'F', label: 'Foul', category: 'foul', confirm: true },
  { symbol: 'V', label: 'Violation', category: 'foul', confirm: true },
  { symbol: 'I', label: 'Intentional', category: 'foul', confirm: true },

  { symbol: 'T', label: 'Timeout', category: 'timeout', confirm: true },

  { symbol: '8', label: '8-ball', category: 'special', confirm: true },
];

/** Groups for layout order on the pad */
export const PAD_GROUPS: ShotCategory[] = [
  'offense', // primary row
  'safety', // secondary
  'foul', // tertiary
  'timeout', // tertiary
  'special', // last
];

/** Convenience helpers */
export const byCategory = (cat: ShotCategory) => SHOTS.filter((s) => s.category === cat);

export function needsConfirm(sym: ShotSymbol) {
  return SHOTS.find((s) => s.symbol === sym)?.confirm === true;
}

export function labelFor(sym: ShotSymbol) {
  return SHOTS.find((s) => s.symbol === sym)?.label ?? sym;
}
