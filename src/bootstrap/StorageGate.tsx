// src/bootstrap/StorageGate.tsx
// -----------------------------------------------------------------------------
// Purpose: Ensure storage is initialized before UI renders. Then bootstrap stores.
// -----------------------------------------------------------------------------

import React, { useEffect, useState } from 'react';
import { ActivityIndicator, View } from 'react-native';
import { initStorage, storageMode } from '~/lib/storage';
import { bootstrapStores } from '~/bootstrap/bootstrapStores';

export function StorageGate({ children }: { children: React.ReactNode }) {
  const [ready, setReady] = useState(storageMode !== 'async'); // MMKV/memory ready immediately

  useEffect(() => {
    let mounted = true;
    (async () => {
      if (storageMode === 'async') {
        await initStorage();
      }
      bootstrapStores(); // idempotent
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
