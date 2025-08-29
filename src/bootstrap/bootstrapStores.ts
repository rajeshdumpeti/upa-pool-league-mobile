// src/bootstrap/bootstrapStores.ts
// -----------------------------------------------------------------------------
// Purpose: One place to bootstrap app stores & side-effect layers (idempotent).
// - Keeps stores free of circular imports.
// -----------------------------------------------------------------------------

import { bootstrapLiveScoringPersistence, useLiveScoringStore } from '~/stores/liveScoringStore';
import { bootstrapScoringRemoteSync } from '~/features/scoring/effects/remoteSync';

let booted = false;

export function bootstrapStores() {
  if (booted) return;
  bootstrapLiveScoringPersistence();
  if (__DEV__) {
    const unsubLog = useLiveScoringStore.subscribe((s) => {
      // keep it tiny to avoid noise
      console.log('[liveScoring:update]', {
        racks: s.match?.racks.length ?? 0,
        shots: s.shots.length,
        rackNo: s.rackMeta?.rackNumber,
      });
    });
    unsubLog();
  }
  bootstrapScoringRemoteSync();
  booted = true;
}
