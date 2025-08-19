// src/features/scoring/utils/labels.ts
// -----------------------------------------------------------------------------
// Purpose: Consistent display labels for team and player names.
// -----------------------------------------------------------------------------

export function formatCompetitorLabel(playerName: string, teamName?: string) {
  const p = playerName?.trim();
  const t = teamName?.trim();
  if (t && p) return `${t}: ${p}`;
  if (p) return p;
  return '—';
}

export function formatBreakerLabel(playerName?: string) {
  return playerName ? `Break: ${playerName}` : 'Break: —';
}
