// src/config/flags.ts
// ----------------------------------------------------------------------------
// Purpose: Central place for runtime flags. Defaults are safe for local dev.
// ----------------------------------------------------------------------------
import Constants from 'expo-constants';

const extra = (Constants.expoConfig?.extra ?? {}) as any;

export const REMOTE_SCORING_ENABLED: boolean = !!(extra?.enableRemoteScoring ?? true);

// If/when we batch score events to the server:
export const REMOTE_BATCH_EVENTS: boolean = !!(extra?.remoteBatchEvents ?? true);
