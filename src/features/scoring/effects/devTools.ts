import { useLiveScoringStore } from '~/stores/liveScoringStore';
import { readQueue, splitQueueByGame, keepOnly } from './scoreQueue';
import { createScoreEventsBatch } from '~/api/events';
import { toast } from '~/lib/notify';

export async function devFlushPendingForCurrentGame() {
  const gameId = useLiveScoringStore.getState().serverMatchGameId;
  if (!gameId || typeof gameId !== 'number') {
    toast('No active serverMatchGameId');
    return;
  }
  const { current, others } = splitQueueByGame(gameId);
  if (current.length === 0) {
    toast('No pending events to flush');
    return;
  }
  await createScoreEventsBatch(gameId, {
    events: current.map(({ _local_id, _rack_number, ...apiShape }) => apiShape),
  });
  keepOnly(others);
  toast(`Flushed ${current.length} event(s)`);
}

// (Optional) quick visibility helper
export function devPendingCountForCurrentGame(): number {
  const gameId = useLiveScoringStore.getState().serverMatchGameId;
  if (!gameId || typeof gameId !== 'number') return 0;
  return readQueue().filter((e) => e.match_game_id === gameId).length;
}
