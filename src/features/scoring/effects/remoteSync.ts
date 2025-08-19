// src/features/scoring/effects/remoteSync.ts
// -----------------------------------------------------------------------------
// Purpose: Subscribe to live-scoring events and (eventually) mirror them to API.
// In this C2.1 slice, we only log. C2.2 will wire axios calls behind a flag.
// -----------------------------------------------------------------------------
import { registerLiveScoringListener } from '../../../stores/liveScoring';
import { REMOTE_SCORING_ENABLED } from '../../../config/flags';

let unreg: (() => void) | null = null;

export function bootstrapScoringRemoteSync() {
  // Always register the listener; gate the behavior inside by the flag.
  if (unreg) return; // idempotent
  unreg = registerLiveScoringListener({
    onRackStarted: ({ match, rackNumber, breakerId }) => {
      if (!REMOTE_SCORING_ENABLED) return;
      console.log('[remoteSync] rack started', { matchId: match.matchId, rackNumber, breakerId });
      // C2.2: call createMatchGame(...)
    },
    onShotAdded: ({ match, rackNumber, shot }) => {
      if (!REMOTE_SCORING_ENABLED) return;
      console.log('[remoteSync] shot', { matchId: match.matchId, rackNumber, shot });
      // C2.3: queue for batch createScoreEventsBatch(...)
    },
    onRackCompleted: ({ match, rackNumber, winnerId, summary }) => {
      if (!REMOTE_SCORING_ENABLED) return;
      console.log('[remoteSync] rack completed', {
        matchId: match.matchId,
        rackNumber,
        winnerId,
        summary,
      });
      // C2.4: completeMatchGame(...)
    },
  });
}
