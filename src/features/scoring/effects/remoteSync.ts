// src/features/scoring/effects/remoteSync.ts
import { registerLiveScoringListener, useLiveScoringStore } from '~/stores/liveScoringStore';
import { REMOTE_SCORING_ENABLED } from '~/config/flags';

import { createMatchGame, completeMatchGame } from '~/api/matches';
import { createScoreEventsBatch } from '~/api/events';
import type { CreateMatchGame, CompleteMatchGame } from '~/api/types';
import { splitQueueByGame, keepOnly } from './scoreQueue';

let unreg: (() => void) | null = null;

export function bootstrapScoringRemoteSync() {
  if (unreg) return; // idempotent

  unreg = registerLiveScoringListener({
    async onRackStarted({ match, rackNumber, breakerId }) {
      if (!REMOTE_SCORING_ENABLED) return;

      const serverMatchId = useLiveScoringStore.getState().serverMatchId;
      if (!serverMatchId || typeof serverMatchId !== 'number') {
        console.log('[remoteSync] skip createMatchGame (no numeric serverMatchId yet)');
        return;
      }

      try {
        const body: CreateMatchGame = {
          match_id: serverMatchId,
          game_no: rackNumber,
          format: match.format,
          home_player_id: match.home.id,
          away_player_id: match.away.id,
          breaker_player_id: breakerId,
          started_at: new Date().toISOString(),
        };
        console.log('[remoteSync] createMatchGame →', body);
        const created = await createMatchGame(body);
        useLiveScoringStore.getState().setServerMatchGameId(created.id);
        console.log('[remoteSync] createMatchGame OK', created.id);
      } catch (err) {
        console.warn('[remoteSync] createMatchGame failed (non-fatal)', err);
      }
    },

    onShotAdded({ match, rackNumber, shot }) {
      // C2.3 logic left as-is (enqueue when we have serverMatchGameId).
      const gameId = useLiveScoringStore.getState().serverMatchGameId;
      if (!gameId || typeof gameId !== 'number') {
        console.log('[scoreQueue] skip enqueue (no serverMatchGameId yet)');
        return;
      }
      // enqueue(...) is already wired in C2.3
    },

    async onRackCompleted({ match, rackNumber, winnerId, summary }) {
      if (!REMOTE_SCORING_ENABLED) return;

      const gameId = useLiveScoringStore.getState().serverMatchGameId;
      if (!gameId || typeof gameId !== 'number') {
        console.log('[remoteSync] skip flush/patch (no serverMatchGameId)');
        return;
      }

      // 1) Batch send queued events for THIS game
      const { current, others } = splitQueueByGame(gameId);
      try {
        if (current.length > 0) {
          console.log('[remoteSync] flushing score_events batch', {
            gameId,
            count: current.length,
          });
          await createScoreEventsBatch(gameId, { events: current });
          console.log('[remoteSync] batch OK');
        } else {
          console.log('[remoteSync] no events to flush for game', gameId);
        }
      } catch (err) {
        console.warn('[remoteSync] batch failed — keeping queue for retry', err);
        return; // do not PATCH if we couldn't persist events; try again next time
      }

      // 2) Patch/complete the match_game with winner + summary
      try {
        const patch: CompleteMatchGame = {
          winner_player_id: winnerId,
          innings: summary.innings,
          defensive_shots: summary.defensiveShots,
          timeouts: summary.timeouts,
          fouls: summary.fouls,
          ended_at: new Date().toISOString(),
        };
        console.log('[remoteSync] patch game', { gameId, patch });
        await completeMatchGame(gameId, patch);
        console.log('[remoteSync] patch OK');

        // 3) Only now do we clear the flushed items for this game + reset gameId
        keepOnly(others);
        useLiveScoringStore.getState().setServerMatchGameId(null);
      } catch (err) {
        console.warn('[remoteSync] patch failed — leaving queue for retry', err);
        // queue remains; we’ll retry next opportunity
      }
    },
  });
}
