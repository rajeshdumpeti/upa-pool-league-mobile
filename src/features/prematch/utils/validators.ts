import type { PreMatchSelection } from '../models/prematch';

export function canStartMatch(sel: PreMatchSelection) {
  if (!sel.format) return { ok: false, reason: 'Choose a format' };
  if (!sel.breaker) return { ok: false, reason: 'Choose a breaker' };
  return { ok: true as const };
}
