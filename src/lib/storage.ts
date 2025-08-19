// src/lib/storage.ts
// -----------------------------------------------------------------------------
// Purpose: Single MMKV instance + tiny helpers for app-wide persistence.
// This module centralizes keys, schema versioning, and JSON (de)serialization.
// No business logic here.
// -----------------------------------------------------------------------------

import { MMKV } from 'react-native-mmkv';

/**
 * Global storage instance.
 * One instance is fine for our scale; if we later need namespaces,
 * we can create additional MMKV({ id: '...' }) stores.
 */
export const storage = new MMKV({ id: 'upa-pool-league' });

/** Keys used by the app (kept centralized to avoid typos) */
export const STORE_KEYS = {
  liveScoring: 'liveScoring:v1', // versioned key for scoring state snapshot
} as const;

/** Write a JS value as JSON */
export function setJSON<T>(key: string, value: T) {
  try {
    storage.set(key, JSON.stringify(value));
  } catch (e) {
    // Intentionally silent: persistence must never crash UI
    console.warn('[storage] setJSON failed:', e);
  }
}

/** Read a JS value from JSON */
export function getJSON<T>(key: string): T | undefined {
  try {
    const raw = storage.getString(key);
    if (!raw) return undefined;
    return JSON.parse(raw) as T;
  } catch (e) {
    console.warn('[storage] getJSON failed:', e);
    return undefined;
  }
}

/** Remove a key */
export function del(key: string) {
  try {
    storage.delete(key);
  } catch (e) {
    console.warn('[storage] delete failed:', e);
  }
}
