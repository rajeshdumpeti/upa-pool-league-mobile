import { bootstrapLiveScoringPersistence } from '../stores/liveScoringStore';
import { bootstrapScoringRemoteSync } from '../features/scoring/effects/remoteSync';

export function bootstrapStores() {
  bootstrapLiveScoringPersistence();
  bootstrapScoringRemoteSync(); // new: registers remote listener (logs only today)
}
