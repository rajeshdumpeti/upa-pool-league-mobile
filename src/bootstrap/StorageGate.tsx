// src/app/bootstrap/StorageGate.tsx
// -----------------------------------------------------------------------------
// Purpose: Ensure storage (AsyncStorage fallback) is initialized before
// the app renders screens that hydrate from storage.
// In MMKV mode this resolves immediately; in Expo Go it preloads the cache.
// -----------------------------------------------------------------------------

import React, { useEffect, useState } from 'react';
import { ActivityIndicator, View } from 'react-native';
import { initStorage, storageMode } from '../lib/storage';
import { bootstrapStores } from './bootstrapStores';

export function StorageGate({ children }: { children: React.ReactNode }) {
  const [ready, setReady] = useState(storageMode !== 'async'); // MMKV or memory = ready

  useEffect(() => {
    let mounted = true;
    (async () => {
      if (storageMode === 'async') {
        await initStorage();
      }
      // Always bootstrap stores after storage is ready
      bootstrapStores();
      if (mounted) setReady(true);
    })();
    return () => {
      mounted = false;
    };
  }, []);

  if (!ready) {
    return (
      <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
        <ActivityIndicator />
      </View>
    );
  }
  return <>{children}</>;
}
