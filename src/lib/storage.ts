// src/lib/storage.ts
// -----------------------------------------------------------------------------
// Purpose: Single storage facade with three tiers:
// 1) MMKV (custom builds) -> fastest, truly persistent
// 2) AsyncStorage (Expo Go) -> persistent across restarts
// 3) Memory (last resort)   -> non-persistent, prevents crashes
// Also provides initStorage() to preload AsyncStorage into a sync cache.
// -----------------------------------------------------------------------------

type KV = {
  set: (key: string, value: string) => void;
  getString: (key: string) => string | undefined;
  delete: (key: string) => void;
};

// In-memory cache used by AsyncStorage fallback to give sync reads to callers.
const cache = new Map<string, string>();

// Tier 3: memory (always available)
const memoryKV: KV = {
  set: (k, v) => cache.set(k, v),
  getString: (k) => cache.get(k),
  delete: (k) => cache.delete(k),
};

let kv: KV = memoryKV;
let mode: 'mmkv' | 'async' | 'memory' = 'memory';

// Try MMKV first (custom dev/prod builds)
try {
  // eslint-disable-next-line @typescript-eslint/no-require-imports
  const { MMKV } = require('react-native-mmkv');
  const inst = new MMKV({ id: 'upa-pool-league' });
  inst.set('__probe__', '1');
  inst.delete('__probe__');
  kv = inst as KV;
  mode = 'mmkv';
} catch {
  /* fall through */
}

// If not MMKV, try AsyncStorage (works in Expo Go)
if (mode !== 'mmkv') {
  try {
    // eslint-disable-next-line @typescript-eslint/no-require-imports
    const AS = require('@react-native-async-storage/async-storage').default;

    // Wrap AsyncStorage with a sync facade via cache
    kv = {
      set: (k, v) => {
        cache.set(k, v);
        // fire-and-forget async write
        AS.setItem(k, v).catch((e: any) => console.warn('[storage] AS setItem failed', e));
      },
      getString: (k) => cache.get(k),
      delete: (k) => {
        cache.delete(k);
        AS.removeItem(k).catch((e: any) => console.warn('[storage] AS removeItem failed', e));
      },
    };
    mode = 'async';
  } catch {
    // remain in memory mode
  }
}
export const storage: KV = kv;
export const storageMode = mode; // 'mmkv' | 'async' | 'memory'

/** Centralized, versioned keys */
export const STORE_KEYS = {
  liveScoring: 'liveScoring:v1',
  scoreQueue: 'scoreQueue:v1',
} as const;

/**
 * Initialize storage module.
 * - If running in AsyncStorage mode, preload values into the cache
 *   so subsequent getString() calls are synchronous and non-blocking.
 * - No-op for MMKV or memory.
 */
export async function initStorage() {
  if (storageMode !== 'async') return;
  try {
    // eslint-disable-next-line @typescript-eslint/no-require-imports
    const AS = require('@react-native-async-storage/async-storage').default;
    // Preload just the keys we care about (expand list as needed)
    const keys = [STORE_KEYS.liveScoring];
    const pairs = await AS.multiGet(keys);
    for (const [k, v] of pairs) {
      if (typeof k === 'string' && typeof v === 'string') cache.set(k, v);
    }
  } catch (e) {
    console.warn('[storage] initStorage failed', e);
  }
}

// Convenience JSON helpers (sync from caller perspective)
export function setJSON<T>(key: string, value: T) {
  try {
    storage.set(key, JSON.stringify(value));
  } catch (err) {
    console.warn('[storage] setJSON failed:', err);
  }
}

export function getJSON<T>(key: string): T | undefined {
  try {
    const raw = storage.getString(key);
    if (!raw) return undefined;
    return JSON.parse(raw) as T;
  } catch (err) {
    console.warn('[storage] getJSON failed:', err);
    return undefined;
  }
}

export function del(key: string) {
  try {
    storage.delete(key);
  } catch (err) {
    console.warn('[storage] delete failed:', err);
  }
}
